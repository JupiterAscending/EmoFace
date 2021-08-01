import React, { useState } from "react";
import Prompt from "./Prompt";
import Canvas from "./Canvas";
import { generatePrompt } from "../utils/gameHelper";

function GameBoard({ room }) {
  const [prompt, setPrompt] = useState(generatePrompt());

  return (
    <div>
      <Prompt room={room} prompt={prompt} />
      <Canvas />
    </div>
  );
}

export default GameBoard;
