import { Routes, Route } from 'react-router-dom';
import { ParentRegForm } from './pages/ParentRegistration';
import { ParentsMain } from './pages/ParentsMainPage';
import { KidsRegForm } from './pages/KidsRegistration';
import { KidsMain } from './pages/KidsMainPage.tsx';
import { SignInForm } from './pages/SignInPage.tsx';
import { ScreenTimeForm } from './pages/ScreenTimePage';
import { TherapySchedForm } from './pages/TherapySchedPage';
import { SketchPage } from './pages/SketchPage';
import { HomePage } from './pages/HomeLogin';
import KidsLayout from './components/KidsLayout';

export default function App() {
  return (
    <Routes>
      {/* Parent routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/signin-form" element={<SignInForm />} />
      <Route path="/parent-register" element={<ParentRegForm />} />
      <Route path="/parents-main" element={<ParentsMain />} />
      <Route path="/kids-register" element={<KidsRegForm />} />
      <Route path="/set-screentime" element={<ScreenTimeForm />} />
      <Route path="/set-therapy" element={<TherapySchedForm />} />

      {/* Kid routes: wrap in TimerProvider */}
      <Route path="/kids/*" element={<KidsLayout />}>
        <Route path="kids-main" element={<KidsMain />} />
        <Route path="sketchpad" element={<SketchPage />} />
      </Route>
    </Routes>
  );
}
