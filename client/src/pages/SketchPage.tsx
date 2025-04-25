import Sketch from '../components/SketchPad';
import '../App.css';

export default function SketchPage() {
  return (
    <div className="no-touch-scroll">
      <h1>Sketch Pad</h1>
      <Sketch />
    </div>
  );
}
