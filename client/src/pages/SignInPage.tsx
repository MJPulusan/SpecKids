import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { readUserEntries } from '../lib/data';
import { saveAuth } from '../lib/auth';

export function SignInForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);

    try {
      const users = await readUserEntries();
      const user = users.find(
        (u) => u.username === username && u.hashedPassword === password
      );

      if (!user || !user.userId) {
        setError('Invalid username, password, or missing userId');
        return;
      }

      saveAuth(
        {
          userId: user.userId ?? 0, // fallback if undefined, but should exist after database fetch
          fullName: user.fullName,
          username: user.username,
          role: user.role,
        },
        'fake-token'
      ); // Save to local storage or context

      if (user.role === 'parent') {
        navigate('/parents-main');
      } else if (user.role === 'kid') {
        localStorage.setItem('selectedChildId', user.userId?.toString() || '');
        navigate('/kids-main');
      }
    } catch (err) {
      console.error(err);
      setError('Sign in failed. Please try again.');
    }
  }

  function handleExit() {
    navigate('/');
  }

  return (
    <div className="sign-in-page">
      <div className="sign-in-container">
        <div className="sign-in-header">
          <h2>Login</h2>
          <button className="exitButton" onClick={handleExit}>
            <img src="/images/close.png" alt="Close" className="closeIcon" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="signInForm">
          <div className="formGroup">
            <label>UserName:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="formGroup">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="signInButton">
            Sign In
          </button>

          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
    </div>
  );
}
