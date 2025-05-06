import Sketch from '../components/SketchPad';
import { AudioPlayer } from '../components/AudioPlayer';
import '../App.css';

export function SketchPage() {
  return (
    <>
      <AudioPlayer src="/sounds/CalmMusic01.mp3" />
      <h1>Sketch Pad</h1>
      <div className="form-container">
        <div className="no-touch-scroll">
          <Sketch />
        </div>
      </div>
    </>
  );
}
