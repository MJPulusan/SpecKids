export type UserEntry = {
  userId?: number;
  fullName: string;
  username: string;
  role: 'parent' | 'kid';
  hashedPassword: string;
};

export type Schedule = {
  scheduleId: number;
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

// ---------- AUTH STORAGE ----------

const authKey = 'um.auth';

type Auth = {
  user: UserEntry;
  token: string;
};

export function saveAuth(user: UserEntry, token: string): void {
  const auth: Auth = { user, token };
  localStorage.setItem(authKey, JSON.stringify(auth));
}

export function removeAuth(): void {
  localStorage.removeItem(authKey);
}

export function readUser(): UserEntry | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).user;
}

export function readToken(): string | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as Auth).token;
}

// *************** SIGN-IN (WORKING) *********************

export async function signIn(
  username: string,
  password: string
): Promise<{ user: UserEntry; token: string }> {
  const res = await fetch('/api/auth/sign-in', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    throw new Error('Invalid login credentials');
  }

  return await res.json(); // returns { user, token }
}

export async function registerParent(
  fullName: string,
  username: string,
  password: string
): Promise<void> {
  const res = await fetch('/api/auth/sign-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fullName,
      username,
      password,
      role: 'parent',
    }),
  });

  if (!res.ok) {
    throw new Error(`Parent registration failed with status ${res.status}`);
  }
}

export async function registerKid(
  fullName: string,
  username: string,
  password: string
): Promise<void> {
  const res = await fetch('/api/auth/sign-up', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ fullName, username, password, role: 'kid' }),
  });

  if (!res.ok) {
    throw new Error('Kid registration failed');
  }
}

export async function readKidEntries(): Promise<UserEntry[]> {
  const res = await fetch('/api/Users/kids', {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  });
  if (!res.ok) throw new Error('Failed to load Kids');
  return res.json();
}

export async function readTimeLimitByUserId(
  userId: number
): Promise<Limits | undefined> {
  const res = await fetch(`/api/TimeLimits/user/${userId}`, {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  });
  if (res.status === 404) return undefined;
  if (!res.ok)
    throw new Error(`Failed to load Time Limit for userId ${userId}`);
  return res.json();
}

export async function updateTimeLimit(limit: Limits): Promise<Limits> {
  if (limit.limitId) {
    const res = await fetch(`/api/TimeLimits/${limit.limitId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${readToken()}`,
      },
      body: JSON.stringify(limit),
    });

    if (!res.ok) throw new Error('Failed to update Time Limit');
    return res.json();
  } else {
    const res = await fetch('/api/TimeLimits', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${readToken()}`,
      },
      body: JSON.stringify(limit),
    });

    if (!res.ok) throw new Error('Failed to create Time Limit');
    return res.json();
  }
}

export async function removeTimeLimitByUserId(userId: number): Promise<void> {
  const res = await fetch(`/api/TimeLimits/user/${userId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete time limit');
}

export async function readSchedulesByUserId(
  userId: number
): Promise<Schedule[]> {
  const res = await fetch(`/api/Schedules/${userId}`, {
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Server error:', res.status, errorText);
    throw new Error('Failed to fetch schedules');
  }
  return res.json();
}

// export async function readSchedulesByUserId(
//   userId: number
// ): Promise<Schedule[]> {
//   const now = new Date();
//   now.setMinutes(now.getMinutes() + 2);
//   const hour = now.getHours();
//   const minute = now.getMinutes().toString().padStart(2, '0');

//   return [
//     {
//       scheduleId: 999,
//       userId,
//       therapyName: 'Test Therapy',
//       timeOfDay: `${hour}:${minute}`,
//       daysOfWeek: new Date().toLocaleDateString('en-US', { weekday: 'short' }),
//     },
//   ];
// }

export async function addSchedule(schedule: {
  userId: number;
  therapyName: string;
  timeOfDay: string;
  daysOfWeek: string;
}): Promise<Schedule> {
  const token = readToken();

  const res = await fetch('/api/schedules', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(schedule),
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Failed to save schedule:', res.status, text);
    throw new Error('Failed to save schedule');
  }

  return res.json();
}

export async function removeSchedule(scheduleId: number): Promise<void> {
  const res = await fetch(`/api/Schedules/${scheduleId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${readToken()}`,
    },
  });
  if (!res.ok) throw new Error('Failed to delete Therapy Schedule');
}

// *************** USER ENTRY *********************

// export async function readUserEntries(): Promise<UserEntry[]> {
//   const res = await fetch('/api/Users', {
//     headers: {
//       Authorization: `Bearer ${readToken()}`,
//     },
//   });
//   if (!res.ok) throw new Error('Failed to load User Entry');
//   return res.json();
// }

// export async function readUserEntry(
//   userId: number
// ): Promise<UserEntry | undefined> {
//   const res = await fetch(`/api/Users/${userId}`, {
//     headers: {
//       Authorization: `Bearer ${readToken()}`,
//     },
//   });
//   if (!res.ok) throw new Error('Failed to load User Entry');
//   return res.json();
// }

// export async function addUserEntry(user: UserEntry): Promise<UserEntry> {
//   const res = await fetch('/api/Users', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${readToken()}`,
//     },
//     body: JSON.stringify(user),
//   });
//   if (!res.ok) throw new Error('Failed to add User Entry');
//   return res.json();
// }

// export async function updateUserEntry(user: UserEntry): Promise<UserEntry> {
//   const res = await fetch(`/api/Users/${user.userId}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${readToken()}`,
//     },
//     body: JSON.stringify(user),
//   });
//   if (!res.ok) throw new Error('Failed to update User Entry');
//   return res.json();
// }

// export async function removeUserEntry(userId: number): Promise<void> {
//   const res = await fetch(`/api/Users/${userId}`, {
//     method: 'DELETE',
//     headers: {
//       Authorization: `Bearer ${readToken()}`,
//     },
//   });
//   if (!res.ok) throw new Error('Failed to delete User Entry');
// }

// // ***************** SCHEDULE ENTRY ********************

// export async function readScheduleEntries(): Promise<Schedule[]> {
//   const res = await fetch('/api/Schedules', {
//     headers: {
//       Authorization: `Bearer ${readToken()}`,
//     },
//   });
//   if (!res.ok) throw new Error('Failed to load list of Therapy Schedule');
//   return res.json();
// }

// export async function readTherapySchedule(
//   scheduleId: number
// ): Promise<Schedule | undefined> {
//   const res = await fetch(`/api/Schedules/${scheduleId}`, {
//     headers: {
//       Authorization: `Bearer ${readToken()}`,
//     },
//   });
//   if (!res.ok) throw new Error('Failed to load Therapy Schedule');
//   return res.json();
// }

// export async function addSchedule(schedule: Schedule): Promise<Schedule> {
//   const res = await fetch('/api/Schedules', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${readToken()}`,
//     },
//     body: JSON.stringify(schedule),
//   });
//   if (!res.ok) throw new Error('Failed to add Therapy Schedule');
//   return res.json();
// }

// export async function updateSchedule(schedule: Schedule): Promise<Schedule> {
//   const res = await fetch(`/api/Schedules/${schedule.scheduleId}`, {
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${readToken()}`,
//     },
//     body: JSON.stringify(schedule),
//   });
//   if (!res.ok) throw new Error('Failed to update Therapy Schedule');
//   return res.json();
// }

// export async function removeTimeLimit(limitId: number): Promise<void> {
//   const res = await fetch(`/api/TimeLimits/${limitId}`, {
//     method: 'DELETE',
//     headers: {
//       Authorization: `Bearer ${readToken()}`,
//     },
//   });
//   if (!res.ok) throw new Error('Failed to delete Time Limit');
// }
