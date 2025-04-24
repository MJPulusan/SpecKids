// SketchPad
import { useRef } from 'react';
import CanvasDraw from 'react-canvas-draw';
import { useNavigate } from 'react-router-dom';

export default function DrawingPad() {
  const canvasRef = useRef<typeof CanvasDraw | null>(null);
  const navigate = useNavigate();

  const handleUndo = () => {
    if (canvasRef.current) {
      canvasRef.current.undo();
    }
  };

  const handleErase = () => {
    if (canvasRef.current) {
      canvasRef.current.clear();
    }
  };

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className="flex justify-center p-4">
      <CanvasDraw
        ref={canvasRef}
        brushColor="#000"
        brushRadius={4}
        lazyRadius={1}
        canvasWidth={600}
        canvasHeight={400}
        hideGrid
        style={{ border: '5px solid #ccc', borderRadius: '50px' }}
      />
      <button>Save</button>
      <button onClick={handleUndo}>Undo ↺</button>
      <button onClick={handleErase}>Erase</button>
      <button onClick={handleClose}>Close</button>
    </div>
  );
}
