import React from "react";

function FaceCapture({ participants }) {
  // console.log("remote participants", remoteParticipants);
  return (
    <div class="flex-row w-full	">
      {participants.map((participant) => (
        <Canvas participant={participant} />
      ))}
      {/* <Canvas identity={localParticipant.identity} />
      {remoteParticipants.map((participant) => (
        <Canvas identity={participant[1].identity} />
      ))} */}
    </div>
  );
}

function Canvas({ participant }) {
  console.count("canvas is being re-rendered");

  // useEffect(()=>{

  // })
  // console.log(identity);
  return (
    <div
      id="canvas-container"
      class="w-30 h-25 mb-5 md:h-44 md:w-60 lg:w-96 lg:h-72 lg:border-4 md:border-2 relative"
    >
      <p class="absolute bg-white text-center">Name: {participant.identity}</p>
      <p class="absolute bottom-0 left-0 bg-white">Score: {participant.score}</p>
      <canvas width="100" height="100" id={participant.identity + "-canvas"} />
    </div>
  );
}

export default FaceCapture;
