import { Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { readUser } from '../lib/data';
import '../KidsMain.css';

export default function KidsLayout() {
  const navigate = useNavigate();
  const user = readUser();

  useEffect(() => {
    if (!user || user.role !== 'kid') {
      navigate('/signin-form');
    }
  }, [user, navigate]);

  return (
    <div>
      <Outlet /> {/* Render nested kid routes */}
    </div>
  );
}
