export type User = {
  userId: number;
  fullName: string;
  username: string;
  role: 'parent' | 'kid';
};

const authKey = 'um.auth';

export function readUser(): User | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as { user: User }).user;
}

export function readToken(): string | undefined {
  const auth = localStorage.getItem(authKey);
  if (!auth) return undefined;
  return (JSON.parse(auth) as { token: string }).token;
}
