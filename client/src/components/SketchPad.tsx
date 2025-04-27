import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AudioPlayer } from '../components/AudioPlayer';
import CanvasDraw from 'react-canvas-draw';

export default function Sketch() {
  const canvasRef = useRef<typeof CanvasDraw | undefined>();
  const navigate = useNavigate();

  function handleUndo() {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  }

  function handleErase() {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  }

  function handleClose() {
    navigate('/kids-main'); // KIDS MAIN Page
  }

  return (
    <div className="flex justify-center p-4">
      <nav className="navbar">
        <div className="logoContainer">
          {/* Optional additional elements */}
        </div>
        <div className="navLinks">{/* Your nav links/buttons */}</div>
      </nav>

      <CanvasDraw
        ref={canvasRef}
        brushColor="#000"
        brushRadius={4}
        lazyRadius={1}
        canvasWidth={700}
        // canvasWidth="90%"
        canvasHeight={400}
        hideGrid
        className="canvas-style"
      />
      <button>Save</button>
      <button onClick={handleUndo}>Undo ↺</button>
      <button onClick={handleErase}>Erase</button>
      <button onClick={handleClose}>Close</button>
      <AudioPlayer src="/sounds/CalmMusic01.mp3" />
    </div>
  );
}
