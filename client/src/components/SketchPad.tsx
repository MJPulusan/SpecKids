import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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
    navigate('/kids/kids-main'); // KIDS MAIN Page
  }

  function handleSave() {
    if (canvasRef.current) {
      // This grabs actual canvas element.
      const image = canvasRef.current.canvasContainer
        .children[1] as HTMLCanvasElement;

      // Convert to PNG Data URL.
      const pngDataUrl = image.toDataURL('image/png');

      // download the save file.
      const link = document.createElement('a');
      link.download = 'my-sketch.png';
      link.href = pngDataUrl;
      link.click();
    }
  }

  return (
    <div className="flex justify-center p-4">
      <nav className="navbar">
        <div className="logoContainer">
          {/* Optional additional elements */}
        </div>
        <div className="navLinks">{/* Your nav links/buttons */}</div>
      </nav>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <CanvasDraw
          ref={canvasRef}
          brushColor="#000"
          brushRadius={4}
          lazyRadius={1}
          canvasWidth={900}
          // canvasWidth="90%"
          canvasHeight={400}
          hideGrid
          className="canvas-style"
        />
      </div>
      <div className="button-group">
        <button onClick={handleSave}>Save</button>
        <button onClick={handleUndo}>Undo ↺</button>
        <button onClick={handleErase}>Erase</button>
        <button onClick={handleClose}>Close</button>
      </div>
    </div>
  );
}
