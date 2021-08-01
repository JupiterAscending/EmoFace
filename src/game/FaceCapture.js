import React from "react";
import Participant from "../videochat/Participant";

function FaceCapture({ localParticipant, remoteParticipants }) {
  console.log("remote participants", remoteParticipants);
  return (
    <div class="flex-row w-full	">
      <Canvas identity={localParticipant.identity} />
      {remoteParticipants.map((participant) => (
        <Canvas identity={participant[1].identity} />
      ))}
    </div>
  );
}

function Canvas({ identity }) {
  console.log(identity);
  return (
    <div
      id="canvas-container"
      class="w-30 h-25 mb-5 md:h-44 md:w-60 lg:w-96 lg:h-72 lg:border-4 md:border-2"
    >
      <canvas width="100" height="100" id={identity + "-canvas"} />
    </div>
  );
}

export default FaceCapture;
