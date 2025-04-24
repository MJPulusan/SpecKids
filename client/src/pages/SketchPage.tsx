import DrawingPad from '../components/SketchPad';
import './App.css';

export default function App() {
  return (
    <div className="min-h-screen bg-blue-200 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">SpecKids Drawing Pad</h1>
      <DrawingPad />
    </div>
  );
}
