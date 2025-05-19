import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTherapyReminder } from '../components/TherapyReminderProvider';
import { Schedule } from '../lib/data';
import '../TherapyPage.css';

export function TherapySchedForm() {
  const navigate = useNavigate();
  const selectedChildId = Number(localStorage.getItem('selectedChildId'));

  const { schedules, addSchedule, updateSchedule, removeSchedule } =
    useTherapyReminder();

  const [name, setName] = useState('');
  const [time, setTime] = useState('');
  const [days, setDays] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);

  function resetForm() {
    setName('');
    setTime('');
    setDays([]);
    setEditingId(null);
  }

  async function handleAddTherapy() {
    if (!selectedChildId || !name || !time || days.length === 0) return;

    const scheduleData: Schedule = {
      scheduleId: editingId ?? 0,
      userId: selectedChildId,
      therapyName: name,
      timeOfDay: time,
      daysOfWeek: days.join(', '),
    };

    try {
      if (editingId) {
        await updateSchedule(scheduleData);
      } else {
        await addSchedule(scheduleData);
      }
      resetForm();
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
      await removeSchedule({ scheduleId } as Schedule);
    } catch (err) {
      console.error('Failed to delete schedule:', err);
    }
  }

  return (
    <>
      <h2 className="welcome">Therapy Schedules</h2>
      <div className="therapy-form-container">
        <div className="therapy-layout">
          {/* LEFT: Therapy List */}
          <div className="therapy-list-column">
            {schedules.length === 0 ? (
              <div className="no-therapy-box">
                <h3>No therapy added yet.</h3>
              </div>
            ) : (
              <ul className="therapy-list">
                {schedules.map((therapy) => (
                  <li key={therapy.scheduleId} className="therapy-card">
                    <strong>{therapy.therapyName}</strong>
                    <br />
                    {therapy.daysOfWeek} - {therapy.timeOfDay}
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
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />

              <label>Days:</label>
              <div className="checkbox-group">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(
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
                {editingId ? 'Update Therapy' : 'Add Therapy'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
