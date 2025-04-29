import './TimesUpModal.css';

type Props = {
  onSubmit: (username: string, password: string) => void;
  error?: string;
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
        <form onSubmit={handleSubmit} className="parent-login-form">
          <input name="username" type="text" placeholder="Username" required />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
          />
          <button type="submit">Login</button>
          {error && <p className="error-text">{error}</p>}
        </form>
      </div>
    </div>
  );
}
