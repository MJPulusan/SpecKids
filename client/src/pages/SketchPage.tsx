import DrawingPad from '../components/SketchPad';
import '../App.css';

export default function SketchPage() {
  return (
    <div>
      <h1 className="text-xl font-bold text-brown-700 mb-4">Sketch Pad</h1>
      <DrawingPad />
    </div>
  );
}
