import React, { useState, useCallback, useEffect, useRef } from "react";
import Prompt from "./Prompt";
import FaceCapture from "./FaceCapture";
import { faces, generatePrompt } from "../utils/gameHelper";
import Loader from "react-loader-spinner";
import * as faceapi from "face-api.js";
import { ParticipantInstance } from "twilio/lib/rest/video/v1/room/roomParticipant";
import { database } from "../firebase";

function GameBoard({ room }) {
  const [prompt, setPrompt] = useState(generatePrompt());
  const [counter, setCounter] = useState(3);
  const [showCounter, setShowCounter] = useState(false);
  const [showScoreboard, setShowScoreboard] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [isCapture, setCapture] = useState(false);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // create a entry in a room database with your name
    database.rooms
      .doc(room.name)
      .set(
        {
          [room.localParticipant.identity]: {
            score: 0,
            capturedFace: "",
          },
          prompt: prompt,
          isPlaying: false,
        },
        { merge: true }
      )
      .then(() => {
        console.log("insertion successful");
      });

    // realtime subscription
    database.rooms.doc(room.name).onSnapshot((doc) => {
      // sync prompt
      const currentPrompt = doc.data().prompt;
      console.log("Realtime update snapshot----- prompt", doc.data().prompt);
      setPrompt(currentPrompt);

      // sync score
      const users = doc.data().users;
      console.log("Realtime users", users);

      // const user1score = doc.data()[room.localParticipant.identity];
      // setScore1(user1score);

      // let user2name;
      // let user2score = 0;
      // const userArr = Array.from(room.participants.values());
      // if (userArr.length > 0) {
      //   user2name = userArr[0].identity;
      //   setusername2(user2name);
      //   user2score = doc.data()[user2name];
      //   setScore2(user2score);
      //   console.log("SCORE2 SET WITH,", user2score);
      // }
    });
  }, []);

  // useEffect(() => {
  //   database.rooms.doc(room.name).onSnapshot((doc) => {
  //     // sync user scores
  //     users.forEach((user) => {
  //       const latestScore = doc.data()[user.identity];
  //       user.score = latestScore;
  //     });
  //     console.log("REAL TIME USERS", users);
  //   });
  // }, [users]);

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
      const imgData = canvas.toDataURL();
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
    // save score to database
    database.rooms.doc(room.name).set(
      {
        users: participants,
      },
      { merge: true }
    );

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
    console.log({ prompt });
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
      {users && <FaceCapture participants={users} />}
    </div>
  );
}

export default GameBoard;
