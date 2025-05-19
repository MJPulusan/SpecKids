import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { readUser } from '../lib/data';
import { useTimer } from '../components/TimerContext';
import '../KidsMain.css';

export function KidsMain() {
  const navigate = useNavigate();
  const user = readUser();

  const { hours, minutes, seconds, setTimeUp } = useTimer();

  // Redirect if user is not a kid
  useEffect(() => {
    if (!user || user.role !== 'kid') {
      navigate('/signin-form');
    }
  }, [user, navigate]);

  if (!user || user.role !== 'kid') return null;

  function handleExit() {
    setTimeUp(true); // trigger the modal instead of navigating
  }

  return (
    <div className="kids-main-container">
      <header className="kids-header">
        <img src="/images/logo.png" alt="SpecKids Logo" className="kids-logo" />

        <div className="stopwatch">
          <div className="circle">
            <span className="time">
              {hours}h {minutes}m {seconds.toString().padStart(2, '0')}s
            </span>
          </div>
        </div>
        <div className="button-to-right">
          <button className="exitButton" onClick={handleExit}>
            <img src="/images/close.png" alt="Close" className="closeIcon" />
          </button>
        </div>
      </header>
      <h1 className="welcome">
        Hello {user.fullName || 'Kid'}, We're happy you're here!
      </h1>
      <div className="activity-grid">
        <div
          className="activity-card"
          onClick={() => navigate('/kids/sketchpad')}>
          <img src="/images/sketchpad-icon.png" alt="Sketch Pad" />
          <p>Sketch Pad</p>
        </div>

        <div
          className="activity-card"
          onClick={() => navigate('/kids/storybook')}>
          <img src="/images/storybook-icon.png" alt="Story book" />
          <p>Story Page</p>
        </div>
      </div>
    </div>
  );
}
