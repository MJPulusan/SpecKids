import { Routes, Route } from 'react-router-dom';
import SketchPage from './pages/SketchPage';
import HomePage from './pages/HomePage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<SketchPage />} />
      <Route path="/success" element={<HomePage />} />
    </Routes>
  );
}
