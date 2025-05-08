import '../TimesUpModal.css';
import React from 'react';

type Props = {
  onSubmit: (username: string, password: string) => void;
  error?: string;
  children?: React.ReactNode;
};

export default function TimesUpModal({ onSubmit, error }: Props) {
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const username = form.get('username') as string;
    const password = form.get('password') as string;
    onSubmit(username, password);
  }

  return (
    <div className="times-up-overlay">
      <div className="times-up-modal">
        <img
          src="/images/TimesUp-icon.png"
          alt="Time's Up"
          className="times-up-img"
        />
        <h1>Thank you for using SpecKids!</h1>

        <form onSubmit={handleSubmit} className="parent-login-form">
          <input name="username" type="text" placeholder="Username" required />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
          />
          <div>
            <button type="submit">Login</button>
          </div>
          {error && <p className="error-text">{error}</p>}
        </form>
      </div>
    </div>
  );
}
