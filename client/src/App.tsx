import { Routes, Route } from 'react-router-dom';
import { ParentRegForm } from './pages/ParentRegistration';
import { ParentsMain } from './pages/ParentsMainPage';
import { KidsRegForm } from './pages/KidsRegistration';
import { KidsMain } from './pages/KidsMainPage.tsx';
// import { ScreenTimeForm } from './pages/ScreenTimePage';
// import { TheraphySchedForm } from './pages/TheraphySchedForm';
import SketchPage from './pages/SketchPage';
import HomePage from './pages/HomeLogin';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sketchpad" element={<SketchPage />} />
      <Route path="/parent-register" element={<ParentRegForm />} />
      <Route path="/parents-main" element={<ParentsMain />} />
      <Route path="/kids-register" element={<KidsRegForm />} />
      <Route path="/kids-main" element={<KidsMain />} />
      {/* <Route path="/set-screentime" element={<ScreenTime />} />
      <Route path="/set-therapy" element={<TherapySched />} /> */}
    </Routes>
  );
}
