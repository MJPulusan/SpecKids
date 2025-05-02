import { useNavigate } from 'react-router-dom';

export function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <div className="homepage-background">
        <img src="/images/logo.png" alt="SpecKids Logo" className="logo" />
        {/* <h1 className="frontLogo">Kids in Spectrum</h1> */}
        <div className="login-container">
          <div className="button-group">
            <button
              className="login-button"
              onClick={() => navigate('/parent-register')}>
              Sign Up
            </button>
            <button
              className="login-button"
              onClick={() => navigate('/signin-form')}>
              Sign In
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
