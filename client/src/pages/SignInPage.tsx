import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAuth, signIn } from '../lib/data';
import { AudioPlayer } from '../components/AudioPlayer';

export function SignInForm() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | undefined>();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(undefined);

    try {
      const { user, token } = await signIn(username, password);

      saveAuth(user, token);
      navigate(user.role === 'parent' ? '/parents-main' : '/kids/kids-main');
    } catch (err) {
      setError('Login failed. Please check your username and password.');
    }
  }

  // GUEST Login
  async function handleGuestLogin(role: 'parent' | 'kid') {
    try {
      const credentials =
        role === 'parent'
          ? { username: 'guest_parent', password: 'Qwerty123$' }
          : { username: 'guest_kid', password: 'abc123' };

      const res = await fetch('/api/auth/sign-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!res.ok) {
        throw new Error('Guest login failed');
      }

      const { user, token } = await res.json();

      saveAuth(user, token);
      navigate(user.role === 'parent' ? '/parents-main' : '/kids/kids-main');
    } catch (err) {
      console.error('Guest login error:', err);
      setError('Guest login unavailable.');
    }
  }

  return (
    <div className="sign-in-page">
      <h2 className="welcome">Login</h2>
      <div className="form-container">
        <div className="sign-in-header">
          <div className="button-to-right">
            <button className="exitButton" onClick={() => navigate('/')}>
              <img src="/images/close.png" alt="Close" className="closeIcon" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="signInForm">
          <div className="formGroup">
            <label>Username:</label>
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
          <h2 className="guest-link" onClick={() => handleGuestLogin('parent')}>
            Sign In as Guest Parent
          </h2>
          <h2 className="guest-link" onClick={() => handleGuestLogin('kid')}>
            Sign In as Guest Kid
          </h2>

          {error && <p className="error-message">{error}</p>}
        </form>
        <AudioPlayer src="/sounds/SignInVoice.mp3" />
      </div>
    </div>
  );
}
