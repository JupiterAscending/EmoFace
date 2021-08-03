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
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // create a entry in a room database with your name
    database.rooms
      .doc(room.name)
      .set(
        {
          prompt: prompt,
          users: [],
          counter: counter,
          showCounter: showCounter,
        },
        { merge: true }
      )
      .then(() => {
        // realtime subscription
        database.rooms.doc(room.name).onSnapshot((doc) => {
          // sync prompt
          const currentPrompt = doc.data().prompt;
          if (prompt) setPrompt(currentPrompt);

          // sync counter & score & captured face
          const currentShowCounter = doc.data().showCounter;
          setShowCounter(currentShowCounter);
          const currentCounter = doc.data().counter;
          setCounter(currentCounter);

          const users = doc.data().users;
          if (users.length > 0) {
            setUsers(users);
          }
        });
      });
  }, []);

  const countDown = async () => {
    await database.rooms.doc(room.name).update({ showCounter: true }, { merge: true });
    return new Promise((resolve) => {
      const id = setInterval(() => {
        setCounter((counter) => {
          if (counter > 0) {
            database.rooms.doc(room.name).update(
              {
                counter: counter - 1,
              },
              { merge: true }
            );
          } else {
            database.rooms.doc(room.name).update(
              {
                counter: 3,
                showCounter: false,
              },
              { merge: true }
            );
            setShowCounter(false);
            clearInterval(id);
            setCounter(3);
            resolve();
          }
        });
      }, 1000);
    });
  };

  const capture = async (participants) => {
    for (let participant of participants) {
      const canvas = document.getElementById(participant.identity + "-canvas");
      const video = document.getElementById(participant.identity);
      const container = document.getElementById("canvas-container");
      canvas.width = parseInt(container.clientWidth);
      canvas.height = parseInt(container.clientHeight);
      canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height); //videoタグの「今」の状態をcanvasに描写
      const imgData = canvas.toDataURL("image/jpeg");
      participant.capturedFace = imgData;
    }
    // save to database
    await database.rooms.doc(room.name).update({ users: participants }, { merge: true });
  };

  const analyse = async (participants) => {
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
        score = "顔として認識されませんでした。";
      }
      participant.score = score;
    }
    // save score to database
    await database.rooms.doc(room.name).update({ users: participants }, { merge: true });
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
    }
  };
  const handleChangePrompt = () => {
    const prompt = generatePrompt();
    setPrompt(prompt);
    savePrompt(prompt);
  };

  const savePrompt = async (prompt) => {
    await database.rooms.doc(room.name).update({
      prompt: prompt,
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
    <div class="flex flex-col justify-center items-center">
      {showCounter && (
        <div className="timer-container">
          <p className="timer">{counter}</p>
        </div>
      )}
      <p class="mb-2 text-center text-white text-2xl md:text-4xl lg:text-4xl">
        Make your {prompt} {faces[prompt]} face!
      </p>
      <div class="mt-3 text-lg text-pink-300 ml-3 text-center md:text-2xl lg:text-1xl flex flex-col justify-center">
        <button
          class="w-40 lg:w-50 bg-pink-400 hover:bg-pink-700 text-white font-bold py-1 px-4 rounded-full mb-5 mt-5"
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
        <div>
          {loading && (
            <Loader type="Circles" color="rgb(244, 114, 182)" height={50} width={50} />
          )}
        </div>
        <div class="flex flex-row flex-wrap">
          {users.map((participant) => (
            <Canvas participant={participant} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default GameBoard;
