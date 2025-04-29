import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readUser } from '../lib/auth';
import { readTimeLimitByUserId, readUserEntries } from '../lib/data';
import TimesUpModal from '../components/TimesUpModal';
import { removeTimeLimitByUserId } from '../lib/data';
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

    console.log('Kid logged in:', user.userId);

    readTimeLimitByUserId(user.userId)
      .then((limit) => {
        if (!limit) {
          setTimeUp(true);
          return;
        }
        const total = limit.hoursLimit * 3600 + limit.minutesLimit * 60;
        setTime(total);
        setHasLoaded(true);
      })
      .catch((err) => {
        console.error('Error fetching time limit:', err);
        setTimeUp(true);
      });
  }, []);

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
      const users = await readUserEntries();
      const parent = users.find(
        (u) =>
          u.username === username &&
          u.hashedPassword === password &&
          u.role === 'parent'
      );

      if (!parent) {
        setParentAuthError('Oops! This section is for parents only.');
        return;
      }

      if (user?.role === 'kid') {
        await removeTimeLimitByUserId(user.userId);
      }

      setTimeUp(false);
      navigate('/parents-main');
    } catch {
      setParentAuthError('Login failed');
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

// I use padStart() for my time to adds characters to the beginning of a string until it reaches the desired limit.
