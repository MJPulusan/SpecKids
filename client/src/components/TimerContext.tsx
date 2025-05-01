import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import { readTimeLimitByUserId } from '../lib/data';
import type { UserEntry } from '../lib/data';

type TimerContextType = {
  timeUp: boolean;
  hours: number;
  minutes: number;
  seconds: number;
  parentAuthError: string;
  setParentAuthError: (msg: string) => void;
  setTimeUp: (state: boolean) => void;
  reloadTimer: () => void;
};

const TimerContext = createContext<TimerContextType | undefined>(undefined);

export function TimerProvider({
  children,
  user,
}: {
  children: React.ReactNode;
  user: UserEntry;
}) {
  const [time, setTime] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [timeUp, setTimeUp] = useState(false);
  const [parentAuthError, setParentAuthError] = useState('');

  const fetchLimit = useCallback(async () => {
    if (!user?.userId) {
      setTimeUp(true);
      return;
    }

    try {
      const limit = await readTimeLimitByUserId(user.userId);
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
  }, [user]);

  useEffect(() => {
    fetchLimit();
  }, [fetchLimit]);

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
  }, [hasLoaded, timeUp, time]);

  const reloadTimer = useCallback(() => {
    setHasLoaded(false);
    fetchLimit();
  }, [fetchLimit]);

  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60;

  return (
    <TimerContext.Provider
      value={{
        timeUp,
        hours,
        minutes,
        seconds,
        parentAuthError,
        setParentAuthError,
        setTimeUp,
        reloadTimer,
      }}>
      {children}
    </TimerContext.Provider>
  );
}

export function useTimer() {
  const context = useContext(TimerContext);
  if (!context) throw new Error('useTimer must be used inside a TimerProvider');
  return context;
}
