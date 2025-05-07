import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readTimeLimitByUserId, updateTimeLimit } from '../lib/data';

export function ScreenTimeForm() {
  const navigate = useNavigate();
  const [hours, setHours] = useState('');
  const [minutes, setMinutes] = useState('');
  const [error, setError] = useState<string | undefined>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);

    try {
      const kidId = localStorage.getItem('selectedChildId');
      if (!kidId) throw new Error('No kid selected');

      const existingLimit = await readTimeLimitByUserId(Number(kidId));

      await updateTimeLimit({
        limitId: existingLimit?.limitId,
        userId: Number(kidId),
        hoursLimit: Number(hours),
        minutesLimit: Number(minutes),
      });

      navigate('/parents-main');
    } catch (err) {
      console.error(err);
      setError('Failed to set screen time.');
    }
  }

  function handleCancel() {
    navigate('/parents-main');
  }

  return (
    <div className="screen-time-page">
      <h2>Screen Time</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="screenTimeForm">
          <div className="inputRow">
            <div className="inputGroup">
              <label>Hours</label>
              <input
                type="number"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                min="0"
              />
            </div>
            <div className="inputGroup">
              <label>Minutes</label>
              <input
                type="number"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                min="0"
              />
            </div>
          </div>
          <div className="button-group">
            <button type="submit" className="submitButton">
              Submit
            </button>
            <button
              type="button"
              className="cancelButton"
              onClick={handleCancel}>
              Cancel
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}
