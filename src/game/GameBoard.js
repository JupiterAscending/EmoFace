import React, { useState } from "react";
import Prompt from "./Prompt";
import Canvas from "./Canvas";
import { generatePrompt } from "../utils/gameHelper";

function GameBoard({ room }) {
  const [prompt, setPrompt] = useState(generatePrompt());
  const [counter, setCounter] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleGameSet = () => {};

  return (
    <div>
      <Prompt room={room} prompt={prompt} />
      {isPlaying && (
        <div className="timer-container">
          <p className="timer">{counter}</p>
        </div>
      )}
      <button
        class="w-40 lg:w-50 bg-pink-400 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-full mb-2"
        onClick={handleGameSet}
      >
        Game Set
      </button>
      <Canvas />
    </div>
  );
}

export default GameBoard;
