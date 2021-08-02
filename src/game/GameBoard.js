import React, { useState, useEffect } from "react";
import Canvas from "./Canvas";
import { faces, generatePrompt } from "../utils/gameHelper";
import Loader from "react-loader-spinner";
import * as faceapi from "face-api.js";
import { database } from "../firebase";

function GameBoard({ room }) {
  const [prompt, setPrompt] = useState(generatePrompt());
  const [counter, setCounter] = useState(3);
  const [showCounter, setShowCounter] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [users, setUsers] = useState([]);

  useEffect(() => {
    // create a entry in a room database
    database.rooms
      .doc(room.name)
      .set(
        {
          prompt: prompt,
          isPlaying: false,
          users: [],
        },
        { merge: true }
      )
      .then(() => {
        // realtime subscription
        database.rooms.doc(room.name).onSnapshot((doc) => {
          // sync prompt
          const currentPrompt = doc.data().prompt;
          if (prompt) setPrompt(currentPrompt);

          // sync score & captured face
          const users = doc.data().users;
          if (users.length > 0) {
            setUsers(users);
          }
        });
      });
  }, []);

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

  // const drawCanvas = (participant, base64) => {
  //   if (base64 === "") return;
  //   console.count("draw canvas was called!");

  //   const canvas = document.getElementById(participant.identity + "-canvas");
  //   const container = document.getElementById("canvas-container");
  //   canvas.width = parseInt(container.clientWidth); //canvasの幅
  //   canvas.height = parseInt(container.clientHeight);
  //   console.log(canvas, "canvas this is in drawCanvas");

  //   const img = new Image();
  //   img.src = base64;
  //   console.log("IMG", img);
  //   canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  //   console.log("canvas after draw", canvas);
  // };

  const capture = async (participants) => {
    for (let participant of participants) {
      const canvas = document.getElementById(participant.identity + "-canvas");
      const video = document.getElementById(participant.identity);
      // console.log({ video });
      const container = document.getElementById("canvas-container");
      canvas.width = parseInt(container.clientWidth); //canvasの幅
      canvas.height = parseInt(container.clientHeight);
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height); //videoタグの「今」の状態をcanvasに描写
      const imgData = canvas.toDataURL("image/jpeg");
      participant.capturedFace = imgData;
    }
    // save to database
    await database.rooms.doc(room.name).update(
      {
        users: participants,
      },
      { merge: true }
    );
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
      if (score === undefined) {
        score = 0;
        setError("顔と認識されませんでした");
      }

      participant.score = score;
    }
    // save score to database
    console.log({ participants });
    database.rooms.doc(room.name).update(
      {
        users: participants,
      },
      { merge: true }
    );

    setLoading(false);
  };

  const calculateScore = (detectionsWithExpressions) => {
    if (detectionsWithExpressions[0]) {
      const float = parseFloat(detectionsWithExpressions[0].expressions[prompt]);
      const multiplied = float * 100;
      const score = multiplied.toFixed(2);
      return score;
    } else {
      setLoading(false);
      setError("Please capture again! Please make sure to take a clear picture!");
    }
  };
  const handleChangePrompt = () => {
    const prompt = generatePrompt();
    setPrompt(prompt);
    savePrompt(prompt);
  };

  const savePrompt = async (prompt) => {
    await database.rooms
      .doc(room.name)
      .update({
        prompt: prompt,
      })
      .then(() => {
        console.log("prompt updated!!", prompt);
      });
  };

  const handleGameSet = async () => {
    // 0. save prompt to the database
    await savePrompt(prompt);

    // 1. start a timer
    setShowCounter(true);
    await countDown();

    // 2. capture face
    const localParticipant = { identity: room.localParticipant.identity, score: 0 };
    const remoteParticipants = Array.from(room.participants).map((participant) => {
      return { identity: participant[1].identity, score: 0 };
    });

    setUsers([localParticipant, ...remoteParticipants]);

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
        class="w-40 lg:w-50 bg-pink-400 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-full mb-5 mt-5"
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
      {users.map((participant) => (
        <Canvas participant={participant} />
      ))}
      {/* <FaceCapture participants={users} /> */}
    </div>
  );
}

export default GameBoard;
