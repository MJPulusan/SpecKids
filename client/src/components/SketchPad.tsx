// SketchPad
import React, { useRef } from 'react';
import CanvasDraw from 'react-canvas-draw';

export default function DrawingPad() {
  const canvasRef = useRef(null);

  return (
    <div className="flex justify-center p-4">
      <CanvasDraw
        ref={canvasRef}
        brushColor="#000"
        brushRadius={4}
        lazyRadius={1}
        canvasWidth={500}
        canvasHeight={400}
        hideGrid
        style={{ border: '5px solid #ccc', borderRadius: '12px' }}
      />
    </div>
  );
}
