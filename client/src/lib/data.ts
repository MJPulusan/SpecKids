export type UserEntry = {
  userId?: number;
  fullName: string;
  username: string;
  role: 'parent' | 'kid';
  hashedPassword: string;
};

export type Schedule = {
  scheduleId?: number;
  userId: number;
  therapyName: string;
  timeOfDay: string;
  daysOfWeek: string;
};

export type Limits = {
  limitId?: number;
  userId: number;
  hoursLimit: number;
  minutesLimit: number;
};

// *************** USER ENTRY *********************

export async function readUserEntries(): Promise<UserEntry[]> {
  const res = await fetch(`/api/Users`);
  if (!res.ok) throw new Error(`Failed to load User Entry`);
  return res.json();
}

export async function readUserEntry(
  userId: number
): Promise<UserEntry | undefined> {
  const res = await fetch(`/api/Users/${userId}`);
  if (!res.ok) throw new Error(`Failed to load User Entry`);
  return res.json();
}

export async function readKidEntries(): Promise<UserEntry[]> {
  const res = await fetch(`/api/Users/kids`);
  if (!res.ok) throw new Error(`Failed to load Kids`);
  return res.json();
}

export async function addUserEntry(user: UserEntry): Promise<UserEntry> {
  const res = await fetch('/api/Users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });
  if (!res.ok) throw new Error('Failed to add User Entry');
  return res.json();
}

export async function updateUserEntry(user: UserEntry): Promise<UserEntry> {
  const res = await fetch(`/api/Users/${user.userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

  if (!res.ok) throw new Error('Failed to update User Entry');
  return res.json();
}

export async function removeUserEntry(userId: number): Promise<void> {
  const res = await fetch(`/api/Users/${userId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete User Entry');
}

// ***************** SCHEDULE ENTRY ********************

export async function readScheduleEntries(): Promise<Schedule[]> {
  const res = await fetch(`/api/Schedules`);
  if (!res.ok) throw new Error(`Failed to load list of Therapy Schedule`);
  return res.json();
}

export async function readTherapySchedule(
  scheduleId: number
): Promise<Schedule | undefined> {
  const res = await fetch(`/api/Schedules/${scheduleId}`);
  if (!res.ok) throw new Error(`Failed to load Therapy Schedule`);
  return res.json();
}

export async function addSchedule(schedule: Schedule): Promise<Schedule> {
  const res = await fetch('/api/Schedules', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(schedule),
  });
  if (!res.ok) throw new Error('Failed to add Therapy Schedule');
  return res.json();
}

export async function updateSchedule(schedule: Schedule): Promise<Schedule> {
  const res = await fetch(`/api/Schedules/${schedule.scheduleId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(schedule),
  });

  if (!res.ok) throw new Error('Failed to update Therapy Schedule');
  return res.json();
}

export async function removeSchedule(scheduleId: number): Promise<void> {
  const res = await fetch(`/api/Schedules/${scheduleId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete Therapy Schedule');
}

// ***************** TIME LIMIT ENTRY ********************

export async function readTimeLimitByUserId(
  userId: number
): Promise<Limits | undefined> {
  const res = await fetch(`/api/TimeLimits/user/${userId}`);
  if (!res.ok)
    throw new Error(`Failed to load Time Limit for userId ${userId}`);
  return res.json();
}

export async function removeTimeLimitByUserId(userId: number): Promise<void> {
  const res = await fetch(`/api/TimeLimits/user/${userId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete time limit');
}

export async function addTimeLimit(limit: Limits): Promise<Limits> {
  const res = await fetch('/api/TimeLimits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(limit),
  });
  if (!res.ok) throw new Error('Failed to add Time Limit');
  return res.json();
}

export async function updateTimeLimit(limit: Limits): Promise<Limits> {
  const res = await fetch(`/api/TimeLimits/${limit.limitId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(limit),
  });

  if (!res.ok) throw new Error('Failed to update Time Limit');
  return res.json();
}

export async function removeTimeLimit(limitId: number): Promise<void> {
  const res = await fetch(`/api/TimeLimits/${limitId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete Time Limit');
}
