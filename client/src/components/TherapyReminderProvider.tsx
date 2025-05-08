import { createContext, useContext, useEffect, useRef, useState } from 'react';
import {
  createSchedule,
  deleteSchedule,
  editSchedule,
  readSchedulesByUserId,
  Schedule,
} from '../lib/data';
import { TherapyModal } from './TherapyModal';
import '../TherapyModal.css';

type ReminderContextType = {
  schedules: Schedule[];
  addSchedule: (addSched: Schedule) => Promise<void>;
  updateSchedule: (updateSched: Schedule) => Promise<void>;
  removeSchedule: (removeSched: Schedule) => Promise<void>;
};

const TherapyReminderContext = createContext<ReminderContextType>({
  schedules: [],
  addSchedule: async () => undefined,
  updateSchedule: async () => undefined,
  removeSchedule: async () => undefined,
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
  const [modalData, setModalData] = useState<{
    therapyName: string;
    timeOfDay: string;
    scheduleId: number;
  } | null>(null);
  const [selectedChildId, setSelectedChildId] = useState<number | null>(null);

  const shownRef = useRef(new Set());

  // this hook triggers a re-fetch so schedules will not be available for all kids.
  useEffect(() => {
    const selectedChildId = Number(localStorage.getItem('selectedChildId'));
    if (selectedChildId && !isNaN(selectedChildId))
      setSelectedChildId(selectedChildId);

    // detect changes in localStorage (e.g., if dropdown updates it)
    const interval = setInterval(() => {
      const storedId = Number(localStorage.getItem('selectedChildId'));
      if (storedId !== selectedChildId && !isNaN(storedId)) {
        setSelectedChildId(storedId);
      }
    }, 1000); // Check every second

    return () => clearInterval(interval);
  }, [selectedChildId]);

  //get and stores kid's therapy schedule from the database or backend.
  useEffect(() => {
    async function fetchSchedules() {
      if (!selectedChildId) return;

      try {
        const result = await readSchedulesByUserId(selectedChildId);
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
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' }); // e.g., "Mon"
      const currentTime = now.getHours() * 60 + now.getMinutes(); // convert to total minutes

      for (const sched of schedules) {
        // Get days this therapy happens (e.g., "Mon, Wed" → ["Mon", "Wed"])
        const days = sched.daysOfWeek
          .split(',')
          .map((d) => d.trim().slice(0, 3));
        if (!days.includes(currentDay)) continue; // Skip if not today's day

        // Convert therapy time to total minutes
        const [hourStr, minuteStr] = sched.timeOfDay.split(':');
        const hour = Number(hourStr);
        const minute = Number(minuteStr.slice(0, 2));
        const scheduleTime = hour * 60 + minute;

        const minutesBefore = scheduleTime - currentTime;
        const id = `${sched.scheduleId}-${currentDay}-${sched.timeOfDay}`;

        // Only show the modal if it's exactly 30 minutes before, and it haven’t shown up yet
        if (!shownRef.current.has(id) && minutesBefore === 30 && !modalData) {
          setModalData({
            therapyName: sched.therapyName,
            timeOfDay: sched.timeOfDay,
            scheduleId: sched.scheduleId,
          });

          shownRef.current.add(id);
        }
      }
    }, 60000); // Run every 60,000ms = 1 minute

    return () => clearInterval(interval);
  }, [schedules, modalData]);

  async function addSchedule(addSched: Schedule) {
    const newEntry = await createSchedule(addSched);

    setSchedules([...schedules, newEntry]);
  }

  async function updateSchedule(updateSched: Schedule) {
    const updated = await editSchedule(updateSched);

    setSchedules((prev) =>
      prev.map((t) => (t.scheduleId === updateSched.scheduleId ? updated : t))
    );
  }

  async function removeSchedule(removeSched: Schedule) {
    await deleteSchedule(removeSched.scheduleId);
    setSchedules((prev) =>
      prev.filter((t) => t.scheduleId !== removeSched.scheduleId)
    );
  }

  return (
    <TherapyReminderContext.Provider
      value={{ addSchedule, updateSchedule, removeSchedule, schedules }}>
      {children}
      {modalData && (
        <TherapyModal
          therapyName={modalData.therapyName}
          timeOfDay={modalData.timeOfDay}
          onClose={() => {
            setModalData(null);
            const currentDay = new Date().toLocaleDateString('en-US', {
              weekday: 'short',
            });
            const id = `${modalData.scheduleId}-${currentDay}-${modalData.timeOfDay}`;
            shownRef.current.add(id); // to make sure it doesn’t show again even after closing
          }}
        />
      )}
    </TherapyReminderContext.Provider>
  );
}
