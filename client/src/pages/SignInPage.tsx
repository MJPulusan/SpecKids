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

      saveAuth(user, token); // your saveAuth() function stores in localStorage
      navigate(user.role === 'parent' ? '/parents-main' : '/kids-main');
    } catch (err) {
      setError('Login failed. Please check your username and password.');
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
        <AudioPlayer src="/sounds/SignInVoice.mp3" />
      </div>
    </div>
  );
}
