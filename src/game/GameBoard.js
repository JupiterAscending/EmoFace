import React, { useState, useCallback, useEffect } from "react";
import Prompt from "./Prompt";
import FaceCapture from "./FaceCapture";
import { generatePrompt } from "../utils/gameHelper";

function GameBoard({ room }) {
  const [prompt, setPrompt] = useState(generatePrompt());
  const [counter, setCounter] = useState(3);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timerId, setTimerId] = useState();

  const [isCapture, setCapture] = useState(false);
  const [users, setUsers] = useState([]);

  const countDown = () => {
    const id = setInterval(() => {
      setCounter((counter) => counter - 1);
    }, 1000);
    setTimerId(id);
  };

  useEffect(() => {
    if (counter === 0) {
      clearInterval(timerId);
      setIsPlaying(false);
      setCounter(3);

      // 2. capture face
      const localParticipant = room.localParticipant.identity;
      const remoteParticipants = Array.from(room.participants).map(
        (participant) => participant[1].identity
      );
      capture([localParticipant, ...remoteParticipants]);
    }
  }, [counter]);

  const capture = (names) => {
    for (let name of names) {
      const canvas = document.getElementById(name + "-canvas");
      const video = document.getElementById(name);
      const container = document.getElementById("canvas-container");
      canvas.width = parseInt(container.clientWidth); //canvasの幅
      canvas.height = parseInt(container.clientHeight);
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height); //videoタグの「今」の状態をcanvasに描写
    }
    setCapture(true);
  };

  const handleGameSet = async () => {
    // 1. start a timer
    setIsPlaying(true);
    countDown();
    // 2. capture face

    // 3. save to database
    // 4. prompt "Analyse this face?"
  };
  console.log("room participants", Array.from(room.participants)[0]);

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
      <FaceCapture
        localParticipant={room.localParticipant}
        remoteParticipants={Array.from(room.participants)}
      />
    </div>
  );
}

export default GameBoard;
