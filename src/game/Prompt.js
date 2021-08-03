import React from "react";
import { faces, generatePrompt } from "../utils/gameHelper";

function Prompt({ room, prompt }) {
  return (
    <div class="mt-3 text-xl text-pink-300 ml-3 text-center md:text-2xl lg:text-3xl">
      <span class="mb-2">
        Make your {prompt} {faces[prompt]} face!
      </span>
      <br />
      <span className="text-white mt-6">
        {room.localParticipant.identity}: %
        <br />
        "user2": %
      </span>
    </div>
  );
}

export default Prompt;
