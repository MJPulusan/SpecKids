import { useNavigate } from 'react-router-dom';
import { useMusic } from '../components/MusicContext';

export function HomePage() {
  const navigate = useNavigate();
  const { setHasInteracted } = useMusic();

  return (
    <div className="homepage-background">
      <div className="logo-header">
        <img src="/images/logo.png" alt="SpecKids Logo" className="logo" />
      </div>
      <div className="login-container">
        <div className="button-group">
          <button
            className="login-button"
            onClick={() => {
              setHasInteracted(true);
              navigate('/parent-register');
            }}>
            Sign Up
          </button>
          <button
            className="login-button"
            onClick={() => {
              setHasInteracted(true);
              navigate('/signin-form');
            }}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  );
}
