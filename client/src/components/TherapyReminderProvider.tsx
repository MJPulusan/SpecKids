import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { readSchedulesByUserId, Schedule } from '../lib/data';

const TherapyReminderContext = createContext<{ schedules: Schedule[] }>({
  schedules: [],
});

export function useTherapyReminder() {
  return useContext(TherapyReminderContext);
}

export function TherapyReminderProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const shownRef = useRef<Set<string>>(new Set());

  const selectedChildId = Number(localStorage.getItem('selectedChildId'));

  useEffect(() => {
    async function fetchSchedules() {
      if (!selectedChildId) return;
      try {
        const result = await readSchedulesByUserId(selectedChildId);
        console.log('Fetched therapy schedules:', result);
        setSchedules(result);
      } catch (err) {
        console.error('Failed to fetch schedules:', err);
      }
    }
    fetchSchedules();
  }, [selectedChildId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' }); // e.g. "Mon"
      const currentTime = now.getHours() * 60 + now.getMinutes();

      for (const sched of schedules) {
        const days = sched.daysOfWeek
          .split(',')
          .map((d) => d.trim().slice(0, 3)); // normalize day names
        if (!days.includes(currentDay)) continue;

        const [hourStr, minuteStr] = sched.timeOfDay.split(':');
        const hour = Number(hourStr);
        const minute = Number(minuteStr.slice(0, 2)); //AM or PM
        const scheduleTime = hour * 60 + minute;
        const alertTime = scheduleTime - 30;

        const id = `${sched.scheduleId}-${currentDay}`;

        if (
          !shownRef.current.has(id) &&
          currentTime >= alertTime &&
          currentTime < alertTime + 2
        ) {
          alert(`⏰ Reminder: ${sched.therapyName} is at ${sched.timeOfDay}`);
          shownRef.current.add(id);
        }
      }
    }, 60000); // every minute

    return () => clearInterval(interval);
  }, [schedules]);

  return (
    <TherapyReminderContext.Provider value={{ schedules }}>
      {children}
    </TherapyReminderContext.Provider>
  );
}
