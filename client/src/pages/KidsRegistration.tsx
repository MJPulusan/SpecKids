import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// to import my backend helper (kids-specific endpoint)
import { addUserEntry } from '../lib/data'; // will adjust for my kids-specific function
import { AudioPlayer } from '../components/AudioPlayer';

export function KidsRegForm() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    fullName: '', // Kid's name
    username: '',
    password: '',
  });

  const fields = [
    { name: 'fullName', label: "Kid's Name:", type: 'text' },
    { name: 'username', label: 'Username:', type: 'text' },
    { name: 'password', label: 'Password:', type: 'password' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { fullName, username, password } = form;
    setIsSubmitting(true);
    setError(undefined);

    try {
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setIsSubmitting(false);
        return;
      }

      await addUserEntry({ fullName, username, hashedPassword: password });
      navigate('/parents-main'); // Go to PARENTS MAIN PAGE
    } catch {
      setError('Kid registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="kids-reg-page">
      <div className="kids-form-container">
        <h1>Kids Registration</h1>
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
        <AudioPlayer src="/sounds/kidsRegistrationVoice.mp3" />
      </div>
    </div>
  );
}
