import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readSchedulesByUserId, addSchedule, Schedule } from '../lib/data';

export function TherapySchedForm() {
  const navigate = useNavigate();
  const selectedChildId = Number(localStorage.getItem('selectedChildId')); // the kidId selected
  const [therapies, setTherapies] = useState<Schedule[]>([]);
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [days, setDays] = useState('');

  useEffect(() => {
    if (!selectedChildId) return;

    async function load() {
      try {
        const result = await readSchedulesByUserId(selectedChildId);
        setTherapies(result);
      } catch (err) {
        console.error('Failed to load therapy schedules:', err);
      }
    }

    load();
  }, [selectedChildId]);

  async function handleAddTherapy() {
    if (!selectedChildId || !name || !time || !days) return;

    try {
      const newEntry = await addSchedule({
        userId: selectedChildId,
        therapyName: name,
        timeOfDay: time,
        daysOfWeek: days,
      });

      setTherapies([...therapies, newEntry]);
      setName('');
      setTime('');
      setDays('');
    } catch (err) {
      console.error('Error saving therapy schedule:', err);
    }
  }

  function handleClose() {
    navigate('/parents-main');
  }

  return (
    <div className="form-container">
      <div className="therapy-page">
        <h2>Therapy Schedules</h2>

        <div>
          {therapies.length === 0 ? (
            <div className="no-therapy-box">
              <h3>No therapy added yet.</h3>
            </div>
          ) : (
            <ul>
              {therapies.map((therapy) => (
                <li key={therapy.scheduleId}>
                  <strong>{therapy.therapyName}</strong> - {therapy.daysOfWeek}{' '}
                  - {therapy.timeOfDay}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          <label>Therapy Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label>Time:</label>
          <input
            type="text"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
          <label>Days:</label>
          <input
            type="text"
            value={days}
            onChange={(e) => setDays(e.target.value)}
          />
        </div>

        <div>
          <button onClick={handleAddTherapy}>Add Therapy</button>
          <button onClick={handleClose}>Close</button>
        </div>
      </div>
    </div>
  );
}
