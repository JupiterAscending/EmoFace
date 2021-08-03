import React, { useRef, useEffect } from "react";

function Canvas({ participant }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    canvas.width = parseInt(container.clientWidth); //canvasの幅
    canvas.height = parseInt(container.clientHeight);
    const img = new Image();
    img.src = participant.capturedFace;
    canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  });
  return (
    <div
      id="canvas-container"
      class="w-30 h-30 mb-5 md:h-44 md:w-60 lg:w-96 lg:h-72 lg:border-4 md:border-2 flex flex-wrap"
      ref={containerRef}
    >
      <p class="absolute bg-white rounded-md text-left text-xs md:text-lg lg:text-xl">
        <b> Name</b>: {participant.identity}
        <br />
        <b> Score</b>: {participant.score}
      </p>

      <canvas
        ref={canvasRef}
        class="w-full h-full "
        id={participant.identity + "-canvas"}
      />
    </div>
  );
}

export default Canvas;
