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
  children: React.ReactNode; // can be any valid JSX.
  user: UserEntry;
}) {
  const [time, setTime] = useState(0);
  const [hasLoaded, setHasLoaded] = useState(false); // tracks my screen time data if fetch successfully.
  const [timeUp, setTimeUp] = useState(false);
  const [parentAuthError, setParentAuthError] = useState('');

  const fetchLimit = useCallback(async () => {
    if (!user?.userId) {
      setTimeUp(true); // shows TimesUp!
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
  }, [user?.userId]);

  // This hook calls fetchLimit() to load the time limit.
  useEffect(() => {
    fetchLimit();
  }, [fetchLimit]);

  // This hook starts the timer once the child logged in.
  useEffect(() => {
    if (!hasLoaded || timeUp) return;

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
  }, [hasLoaded, timeUp]);

  const reloadTimer = useCallback(() => {
    setHasLoaded(false);
    fetchLimit();
  }, [fetchLimit]);

  const hours = Math.floor(time / 3600); // drops any decimal (3600sec in an hour)
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = time % 60; // remaining sec. after getting full minutes. (65 % 60 = 5sec)

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
