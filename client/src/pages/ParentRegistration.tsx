import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerParent, signIn, saveAuth } from '../lib/data';
import { AudioPlayer } from '../components/AudioPlayer';

export function ParentRegForm() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false); // tracks if the form is currently being submitted.

  //sets up form for 3 fields
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    password: '',
  });

  //a config array used to render form fields dynamically in JSX.
  const fields = [
    { name: 'fullName', label: 'Parent Name / Guardian:', type: 'text' },
    { name: 'username', label: 'Username:', type: 'text' },
    { name: 'password', label: 'Password:', type: 'password' },
  ];

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) =>
    // this updates form state without overwriting the other fields.
    setForm({ ...form, [event.target.name]: event.target.value });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { fullName, username, password } = form;
    setIsSubmitting(true); //update state to true
    setError(undefined);

    try {
      if (password.length < 8) {
        setError('Password must be at least 8 characters long.');
        setIsSubmitting(false);
        return;
      }

      if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
        setError('Password must contain at least one letter and one number.');
        setIsSubmitting(false);
        return;
      }

      await registerParent(fullName, username, password);

      const { user, token } = await signIn(username, password);
      saveAuth(user, token);

      navigate('/kids-register'); // KIDS register page.
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="parent-reg-page">
      <h1 className="welcome">Parent Registration</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="parentRegForm">
          {fields.map((field) => (
            <div key={field.name} className="form-field">
              <label>{field.label}</label>
              <input
                type={field.type}
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
          <div className="button-group">
            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Registering...' : 'Register'}
            </button>
            <button type="button" onClick={() => navigate('/')}>
              Home
            </button>
          </div>
          {error && <p className="error-message">{error}</p>}
        </form>
      </div>
      <AudioPlayer src="/sounds/ParentRegistrationVoice.mp3" />
    </div>
  );
}
