import Sketch from '../components/SketchPad';
import '../App.css';

export function SketchPage() {
  return (
    <>
      <h1>Sketch Pad</h1>
      <div className="form-container">
        <div className="no-touch-scroll">
          <Sketch />
        </div>
      </div>
    </>
  );
}
