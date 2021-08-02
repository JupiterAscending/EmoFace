import React, { useRef, useEffect } from "react";

function Canvas({ participant }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    canvas.width = parseInt(container.clientWidth); //canvasの幅
    canvas.height = parseInt(container.clientHeight);
    // console.log(canvas, "canvas this is in drawCanvas");

    const img = new Image();
    img.src = participant.capturedFace;
    // console.log("IMG", img);
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
    console.log("canvas after draw", canvas);
  });
  return (
    <div
      id="canvas-container"
      class="w-30 h-25 mb-5 md:h-44 md:w-60 lg:w-96 lg:h-72 lg:border-4 md:border-2 relative"
      ref={containerRef}
    >
      <p class="absolute bg-white text-center">Name: {participant.identity}</p>
      <p class="absolute bottom-0 left-0 bg-white">Score: {participant.score}</p>
      <canvas
        ref={canvasRef}
        width="100"
        height="100"
        id={participant.identity + "-canvas"}
      />
    </div>
  );
}

export default Canvas;
