import React, { useState, useCallback, useEffect, useRef } from "react";
import Prompt from "./Prompt";
import FaceCapture from "./FaceCapture";
import { faces, generatePrompt } from "../utils/gameHelper";
import Loader from "react-loader-spinner";
import * as faceapi from "face-api.js";
import { ParticipantInstance } from "twilio/lib/rest/video/v1/room/roomParticipant";

function GameBoard({ room }) {
  const [prompt, setPrompt] = useState(generatePrompt());
  const [counter, setCounter] = useState(3);
  const [showCounter, setShowCounter] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isCapture, setCapture] = useState(false);
  const [users, setUsers] = useState();

  const countDown = () => {
    return new Promise((resolve) => {
      const id = setInterval(() => {
        setCounter((counter) => {
          if (counter > 0) {
            return counter - 1;
          } else {
            setShowCounter(false);
            clearInterval(id);
            // reset counter
            setCounter(3);
            resolve();
          }
        });
      }, 1000);
    });
  };

  const capture = (participants) => {
    for (let participant of participants) {
      const canvas = document.getElementById(participant.identity + "-canvas");
      const video = document.getElementById(participant.identity);
      const container = document.getElementById("canvas-container");
      canvas.width = parseInt(container.clientWidth); //canvasの幅
      canvas.height = parseInt(container.clientHeight);
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height); //videoタグの「今」の状態をcanvasに描写
    }
    // setCapture(true);
  };

  const analyse = async (participants) => {
    setError("");
    setLoading(true);
    for (let participant of participants) {
      const canvas = document.getElementById(participant.identity + "-canvas");

      await faceapi.nets.tinyFaceDetector.load("/models");
      await faceapi.nets.faceExpressionNet.load("/models");
      const detectionsWithExpressions = await faceapi
        .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
        .withFaceExpressions();

      let score = calculateScore(detectionsWithExpressions);
      participant.score = score;

      if (score === undefined) {
        setError("顔と認識されませんでした");
      }

      console.log(score);
    }

    //   if (score) {
    //     database.scores.doc(room.name).set(
    //       {
    //         [participant.identity]: score,
    //       },
    //       { merge: true }
    //     );
    //   } else {
    //     console.log("noscore");
    //   }
    // } else {
    //   setAnalysed2(true);
    //   setResult_p2(detectionsWithExpressions);

    //   const score2 = calculateScore(detectionsWithExpressions);
    //   console.log("score2-----", score2);
    //   if (score2) {
    //     database.scores.doc(room.name).set(
    //       {
    //         [participant.identity]: score2,
    //       },
    //       { merge: true }
    //     );
    //   } else {
    //     console.log("no score!");
    //   }
    //   setAnalysed1(false);
    //   setAnalysed2(false);
    // }
    setLoading(false);
  };

  const calculateScore = (detectionsWithExpressions) => {
    if (detectionsWithExpressions[0]) {
      console.log(prompt);
      const float = parseFloat(detectionsWithExpressions[0].expressions[prompt]);
      console.log(
        "inside calculatescore----",
        detectionsWithExpressions[0].expressions[prompt],
        prompt
      );
      const multiplied = float * 100;
      const score = multiplied.toFixed(2);
      console.log({ float, multiplied, score });
      return score;
    } else {
      setLoading(false);
      setError("Please capture again! Please make sure to take a clear picture!");
    }
  };
  const handleChangePrompt = () => {
    const prompt = generatePrompt();
    setPrompt(prompt);
  };

  const handleGameSet = async () => {
    // 1. start a timer
    setShowCounter(true);
    await countDown();

    // 2. capture face
    const localParticipant = { identity: room.localParticipant.identity, score: 0 };
    const remoteParticipants = Array.from(room.participants).map((participant) => {
      return { identity: participant[1].identity, score: 0 };
    });
    setUsers([localParticipant, ...remoteParticipants]);
    setShowScoreboard(true);

    capture([localParticipant, ...remoteParticipants]);

    // 3. analyse
    analyse([localParticipant, ...remoteParticipants]);
  };

  return (
    <div>
      <div class="mt-3 text-xl text-pink-300 ml-3 text-center md:text-2xl lg:text-3xl">
        <span class="mb-2">
          Make your {prompt} {faces[prompt]} face!
        </span>
        <br />
        {/* {showScoreboard && (
          <span className="text-white mt-6">
            {room.localParticipant.identity}: %
            <br />
            "user2": %
          </span>
        )} */}
      </div>
      {showCounter && (
        <div className="timer-container">
          <p className="timer">{counter}</p>
        </div>
      )}
      <button
        class="w-40 lg:w-50 bg-pink-400 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-full mb-5"
        onClick={handleChangePrompt}
      >
        Change prompt?
      </button>
      <button
        class="w-40 lg:w-50 bg-pink-400 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-full mb-5"
        onClick={handleGameSet}
      >
        Game Set
      </button>
      {loading && (
        <Loader type="Circles" color="rgb(244, 114, 182)" height={50} width={50} />
      )}
      <p class="text-yellow">{error}</p>
      {users && <FaceCapture participants={users} />}
    </div>
  );
}

export default GameBoard;
