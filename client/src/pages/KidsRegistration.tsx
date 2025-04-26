import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Import your backend helper (if you have a kids-specific endpoint)
import { addUserEntry } from '../lib/data'; // Adjust if you have a kids-specific function

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
      // Password validation (optional: adjust as needed)
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setIsSubmitting(false);
        return;
      }

      await addUserEntry({ fullName, username, hashedPassword: password });
      navigate('/parents-main'); // Go PARENTS MAIN PAGE
    } catch {
      setError('Kid registration failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="kidsRegPage">
      <div className="kidsFormContainer">
        <h1>Kids Registration</h1>
        <form onSubmit={handleSubmit} className="kidsRegForm">
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
          <div className="buttonGrp">
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
    </div>
  );
}
