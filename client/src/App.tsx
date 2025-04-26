import { Route } from 'react-router-dom';
import { ParentRegForm } from './pages/ParentRegistration';
import { ParentsMain } from './pages/ParentsMainPage';
import { KidsRegForm } from './pages/KidsRegistration';
import { KidsMain } from './pages/KidsMainPage.tsx';
import SketchPage from './pages/SketchPage';
import HomePage from './pages/HomeLogin';
import { HashRouter as Router } from 'react-router-dom';

export default function App() {
  return (
    <Router>
      <Route path="/" element={<HomePage />} />
      <Route path="/sketchpad" element={<SketchPage />} />
      <Route path="/parent-register" element={<ParentRegForm />} />
      <Route path="/parents-main" element={<ParentsMain />} />
      <Route path="/kids-register" element={<KidsRegForm />} />
      <Route path="/kids-main" element={<KidsMain />} />
    </Router>
  );
}
