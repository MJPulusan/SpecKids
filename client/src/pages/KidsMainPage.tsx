import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readUser } from '../lib/auth';
import { readTimeLimitByUserId, readUserEntries } from '../lib/data';
import TimesUpModal from '../components/TimesUpModal';
import { removeTimeLimitByUserId } from '../lib/data';
import '../components/TimesUpModal.css';

export function KidsMain() {
  const navigate = useNavigate();
  const [time, setTime] = useState(0); // seconds remaining
  const [timeUp, setTimeUp] = useState(false);
  const [parentAuthError, setParentAuthError] = useState('');
  const [hasLoaded, setHasLoaded] = useState(false);

  // Load time limit on first mount only
  useEffect(() => {
    const user = readUser();
    if (!user || user.role !== 'kid') {
      navigate('/login-form');
      return;
    }
    console.log('Kid logged in:', user.userId);

    readTimeLimitByUserId(user.userId)
      .then((limit) => {
        console.log('Fetched time limit:', limit);

        if (!limit) {
          setTimeUp(true);
          return;
        }

        const total = limit.hoursLimit * 3600 + limit.minutesLimit * 60;
        setTime(total);
        setHasLoaded(true); // only set once
      })
      .catch((err) => {
        console.error('Error fetching time limit:', err);
        setTimeUp(true);
      });
  }, []); //  only run once

  // Countdown TIMER logic
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

  // Parent override
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

      const kid = readUser(); // if current session is a kid
      if (kid?.role === 'kid') {
        await removeTimeLimitByUserId(kid.userId); // delete the old timelimit
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
    <div className="container">
      {timeUp && (
        <TimesUpModal onSubmit={handleParentLogin} error={parentAuthError} />
      )}

      <div className="stopwatch">
        <div className="circle">
          <span className="time">
            {hours}h {minutes}m {seconds.toString().padStart(2, '0')}s
          </span>
        </div>
        <h2>Welcome to SpecKids!</h2>
      </div>
    </div>
  );
}

// I use padStart() for my time to adds characters to the beginning of a string until it reaches the desired limit.
