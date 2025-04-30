import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readUser, signIn, saveAuth } from '../lib/data';
import { readTimeLimitByUserId } from '../lib/data';
import TimesUpModal from '../components/TimesUpModal';
import '../KidsMain.css';

export function KidsMain() {
  const navigate = useNavigate();
  const [time, setTime] = useState(0);
  const [timeUp, setTimeUp] = useState(false);
  const [parentAuthError, setParentAuthError] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);
  const user = readUser(); // the logged-in kid

  useEffect(() => {
    if (!user || user.role !== 'kid') {
      navigate('/login-form');
      return;
    }

    async function fetchLimit() {
      try {
        if (!user?.userId) {
          setTimeUp(true);
          return;
        }
        const limit = await readTimeLimitByUserId(user.userId!);
        if (!limit) {
          setTimeUp(true);
          return;
        }

        const total = limit.hoursLimit * 3600 + limit.minutesLimit * 60;
        setTime(total);
        setHasLoaded(true);
      } catch (err) {
        console.error('Error fetching time limit:', err);
        setTimeUp(true);
      }
    }

    fetchLimit();
  }, [navigate]); // didn't include "user" as it reset time after 1sec

  //   readTimeLimitByUserId(user.userId!)
  //     .then((limit) => {
  //       if (!limit) {
  //         setTimeUp(true);
  //         return;
  //       }
  //       const total = limit.hoursLimit * 3600 + limit.minutesLimit * 60;
  //       setTime(total);
  //       setHasLoaded(true);
  //     })
  //     .catch((err) => {
  //       console.error('Error fetching time limit:', err);
  //       setTimeUp(true);
  //     });
  // }, []);

  useEffect(() => {
    if (!hasLoaded || timeUp || time <= 0) return;

    const id = setInterval(() => {
      setTime((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          setTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(id);
  }, [time, timeUp, hasLoaded]);

  async function handleParentLogin(username: string, password: string) {
    try {
      const { user: parentUser, token } = await signIn(username, password);

      if (parentUser.role !== 'parent') {
        setParentAuthError('Oops! This section is for parents only.');
        return;
      }

      saveAuth(parentUser, token);

      // Runtime check for user before accessing .userId
      if (!user || !user.userId) {
        setParentAuthError('Missing kid session info.');
        return;
      }

      // await removeTimeLimitByUserId(user.userId);
      setTimeUp(false);
      setHasLoaded(false); //allow countdown to reload
      navigate('/parents-main');
    } catch {
      setParentAuthError('Login failed. Please check credentials.');
    }
  }

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return (
    <div className="kids-main-container">
      {timeUp && (
        <TimesUpModal onSubmit={handleParentLogin} error={parentAuthError} />
      )}

      <header className="kids-header">
        <img src="/images/logo.png" alt="SpecKids Logo" className="kids-logo" />
        <h1>Hello, {user?.fullName || 'Kid'}!</h1>
      </header>

      <div className="stopwatch">
        <div className="circle">
          <span className="time">
            {hours}h {minutes}m {seconds.toString().padStart(2, '0')}s
          </span>
        </div>
      </div>

      <div className="activity-grid">
        <div className="activity-card" onClick={() => navigate('/sketchpad')}>
          <img src="/images/sketchpad-icon.png" alt="Sketch Pad" />
          <p>Sketch Pad</p>
        </div>

        <div className="activity-card" onClick={() => navigate('/color-game')}>
          <img src="/images/guess_color_game.png" alt="Color Game" />
          <p>Color Game</p>
        </div>
      </div>
    </div>
  );
}
