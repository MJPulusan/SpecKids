import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  readSchedulesByUserId,
  addSchedule,
  removeSchedule,
  updateSchedule,
  Schedule,
} from '../lib/data';
import '../TherapyPage.css';

export function TherapySchedForm() {
  const navigate = useNavigate();
  const selectedChildId = Number(localStorage.getItem('selectedChildId'));
  const [therapies, setTherapies] = useState<Schedule[]>([]);
  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [days, setDays] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

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
    if (!selectedChildId || !name || !time || days.length === 0) return;

    try {
      if (editingId) {
        const updated = await updateSchedule({
          scheduleId: editingId,
          userId: selectedChildId,
          therapyName: name,
          timeOfDay: time,
          daysOfWeek: days.join(', '),
        });

        setTherapies((prev) =>
          prev.map((t) => (t.scheduleId === editingId ? updated : t))
        );
        setEditingId(null);
      } else {
        const newEntry = await addSchedule({
          userId: selectedChildId,
          therapyName: name,
          timeOfDay: time,
          daysOfWeek: days.join(', '),
        });

        setTherapies([...therapies, newEntry]);
      }

      // Reset form
      setName('');
      setTime('');
      setDays([]);
    } catch (err) {
      console.error('Error saving therapy schedule:', err);
    }
  }

  function handleEdit(therapy: Schedule) {
    setEditingId(therapy.scheduleId ?? null);
    setName(therapy.therapyName);
    setTime(therapy.timeOfDay);
    setDays(therapy.daysOfWeek.split(', ').map((d) => d.trim()));
  }

  async function handleDelete(scheduleId: number | undefined) {
    if (!scheduleId) return;

    try {
      await removeSchedule(scheduleId);
      setTherapies((prev) => prev.filter((t) => t.scheduleId !== scheduleId));
    } catch (err) {
      console.error('Failed to delete schedule:', err);
    }
  }

  return (
    <>
      <h2>Therapy Schedules</h2>
      <div className="therapy-form-container">
        <div className="therapy-layout">
          {/* LEFT: Therapy List */}
          <div className="therapy-list-column">
            {therapies.length === 0 ? (
              <div className="no-therapy-box">
                <h3>No therapy added yet.</h3>
              </div>
            ) : (
              <ul className="therapy-list">
                {therapies.map((therapy) => (
                  <li key={therapy.scheduleId} className="therapy-card">
                    <strong>{therapy.therapyName}</strong>
                    <br />
                    {therapy.daysOfWeek} – {therapy.timeOfDay}
                    <br />
                    <button
                      onClick={() => handleEdit(therapy)}
                      className="edit-button">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(therapy.scheduleId)}
                      className="delete-button">
                      Delete
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* RIGHT: Therapy Form */}
          <div className="therapy-form-column">
            <div className="therapy-form">
              <div className="button-to-right">
                <button
                  className="exitButton"
                  onClick={() => navigate('/parents-main')}>
                  <img
                    src="/images/close.png"
                    alt="Close"
                    className="closeIcon"
                  />
                </button>
              </div>

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
              <div className="checkbox-group">
                {['Sun', 'Mon', 'Tues', 'Weds', 'Thurs', 'Fri', 'Sat'].map(
                  (day) => (
                    <label key={day} className="day-checkbox">
                      <input
                        type="checkbox"
                        value={day}
                        checked={days.includes(day)}
                        onChange={(e) => {
                          const updated = e.target.checked
                            ? [...days, day]
                            : days.filter((d) => d !== day);
                          setDays(updated);
                        }}
                      />
                      {day}
                    </label>
                  )
                )}
              </div>

              <button onClick={handleAddTherapy} className="add-therapy">
                Add Therapy
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
