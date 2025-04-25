// SketchPad
import { useRef } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { useNavigate } from 'react-router-dom';

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
    console.log('List Page');
    navigate('/');
  }

  return (
    <div className="flex justify-center p-4">
      <CanvasDraw
        ref={canvasRef}
        brushColor="#000"
        brushRadius={4}
        lazyRadius={1}
        canvasWidth={700}
        canvasHeight={400}
        hideGrid
        className="canvas-style"
      />
      <button>Save</button>
      <button onClick={handleUndo}>Undo ↺</button>
      <button onClick={handleErase}>Erase</button>
      <button onClick={handleClose}>Close</button>
    </div>
  );
}
