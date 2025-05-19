import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AudioPlayer } from '../components/AudioPlayer';
import { registerKid } from '../lib/data';

export function KidsRegForm() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // sets up form for 3 fields (kids)
  const [form, setForm] = useState({
    fullName: '',
    username: '',
    password: '',
  });

  //a config array used to render form fields dynamically in JSX.
  const fields = [
    { name: 'fullName', label: "Kid's Name:", type: 'text' },
    { name: 'username', label: 'Username:', type: 'text' },
    { name: 'password', label: 'Password:', type: 'password' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    // this updates form state without overwriting the other fields.
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const { fullName, username, password } = form;
    setIsSubmitting(true);
    setError(undefined);

    try {
      if (password.length < 4) {
        setError('Password must be at least 4 characters.');
        setIsSubmitting(false);
        return;
      }

      await registerKid(fullName, username, password);
      setForm({ fullName: '', username: '', password: '' });
      navigate('/parents-main');
    } catch {
      setError('Registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="kids-reg-page">
      <h1 className="welcome">Kids Registration</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit} className="kidsRegForm">
          {/* Loop through each field defined in the 'fields' array above. */}
          {fields.map((field) => (
            <div key={field.name} className="form-field">
              {/* Render the label for each input field */}
              <label>{field.label}</label>

              {/* Render the input field with dynamic properties */}
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
        <AudioPlayer src="/sounds/KidsRegistrationVoice.mp3" />
      </div>
    </div>
  );
}
