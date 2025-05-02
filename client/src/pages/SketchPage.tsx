import Sketch from '../components/SketchPad';
import '../App.css';

export function SketchPage() {
  return (
    <div className="form-container">
      <div className="no-touch-scroll">
        <h1>Sketch Pad</h1>
        <Sketch />
      </div>
    </div>
  );
}
