import { Routes, Route } from 'react-router-dom';
import SketchPage from './pages/SketchPage';
import ListPage from './pages/AppList';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ListPage />} />
      <Route path="/sketchpad" element={<SketchPage />} />
    </Routes>
  );
}
