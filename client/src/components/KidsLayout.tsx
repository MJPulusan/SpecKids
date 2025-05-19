import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { TimerProvider, useTimer } from './TimerContext';
import { readUser, signIn } from '../lib/data';
import TimesUpModal from '../components/TimesUpModal';
import '../KidsMain.css';

function ModalPrompt() {
  const navigate = useNavigate();
  const { timeUp, setTimeUp, parentAuthError, setParentAuthError } = useTimer();

  const [isLoading, setIsLoading] = useState(false);

  // Login for Parents in Pop-up Form
  async function handleParentLogin(username: string, password: string) {
    setIsLoading(true);
    try {
      const result = await signIn(username, password);

      if (result.user.role !== 'parent') {
        setParentAuthError('Only parent accounts can log in here.');
        return;
      }

      setParentAuthError('');
      setTimeUp(false);
      navigate('/parents-main');
    } catch (err) {
      setParentAuthError('Login failed.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  if (!timeUp) return null;

  return (
    // Displays my TimesUpModal w/ login
    <TimesUpModal onSubmit={handleParentLogin} error={parentAuthError}>
      {isLoading && <p>Authenticating...</p>}
    </TimesUpModal>
  );
}

export default function KidsLayout() {
  const navigate = useNavigate();
  const user = readUser();

  useEffect(() => {
    if (!user || user.role !== 'kid') {
      navigate('/signin-form');
    }
  }, [user, navigate]);

  return (
    <>
      {user && user.role === 'kid' && (
        <TimerProvider user={user}>
          <ModalPrompt /> {/* Global modal prompt */}
          <Outlet />
        </TimerProvider>
      )}
    </>
  );
}
