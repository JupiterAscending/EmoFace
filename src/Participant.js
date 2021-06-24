import "./App.scss";
import Track from "./Track";
import React, { useState, useEffect } from "react";
import * as canvas from "canvas";
import * as faceapi from "face-api.js";
import { database } from "./firebase";
import Loader from "react-loader-spinner";

export default function Participant({
  participant,
  localParticipant,
  isAnalysed1,
  setAnalysed1,
  isAnalysed2,
  setAnalysed2,
  room,
  prompt,
  setPrompt,
  count,
  setCount,
  generatePrompt,
}) {
  const existingPublications = Array.from(participant.tracks.values());
  const existingTracks = existingPublications.map((publication) => publication.track);
  const nonNullTracks = existingTracks.filter((track) => track !== null);

  const [tracks, setTracks] = useState(nonNullTracks);
  console.log("-------", tracks);
  const [video, setVideo] = useState("");
  const [isReady, setReady] = useState(false);
  const [isCapture, setCapture] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [result1, setResult_p1] = useState([
    {
      expressions: {
        angry: 0,
        disgusted: 0,
        fearful: 0,
        happy: 0,
        neutral: 0,
        sad: 0,
        surprised: 0,
      },
    },
  ]);

  const [result2, setResult_p2] = useState([
    {
      expressions: {
        angry: 0,
        disgusted: 0,
        fearful: 0,
        happy: 0,
        neutral: 0,
        sad: 0,
        surprised: 0,
      },
    },
  ]);

  const [canvas, setCanvas] = useState();
  const [error, setError] = useState("");

  useEffect(() => {
    if (localParticipant !== "true") {
      console.log("attaching audio");
      participant.on("trackSubscribed", (track) => addTrack(track));
    }
  }, []);

  function addTrack(track) {
    console.log("Add track running with track", track);
    tracks.push(track);
    // setTracks([...tracks, track]);
    console.log({ tracks });
  }

  function videoCapture() {
    const name = participant.identity;
    setCanvas(document.getElementById(name + "-canvas"));
    setVideo(document.getElementById(name));
    setReady(true);
    setCount(count + 1);
    // console.count("-----localparticipant", localParticipant);
    if (localParticipant === "true") {
      generatePrompt();
    }
  }
  function capture() {
    let canvasSizeX = 300; //canvasの幅
    let canvasSizeY = (canvasSizeX * video.videoHeight) / video.videoWidth; //canvasの高さ
    canvas.getContext("2d").drawImage(video, 0, 0, canvasSizeX, canvasSizeY); //videoタグの「今」の状態をcanvasに描写
    setCapture(true);
  }
  function calculateScore(detectionsWithExpressions) {
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
  }

  async function analyse() {
    setError("");
    setLoading(true);
    await faceapi.nets.tinyFaceDetector.load("/models");
    await faceapi.nets.faceExpressionNet.load("/models");
    const detectionsWithExpressions = await faceapi
      .detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
      .withFaceExpressions();

    console.log(detectionsWithExpressions);

    if (isAnalysed1 === false) {
      setAnalysed1(true);
      setResult_p1(detectionsWithExpressions);
      const score = calculateScore(detectionsWithExpressions);

      if (score) {
        database.scores.doc(room.name).set(
          {
            [participant.identity]: score,
          },
          { merge: true }
        );
      } else {
        console.log("noscore");
      }
    } else {
      setAnalysed2(true);
      setResult_p2(detectionsWithExpressions);

      const score2 = calculateScore(detectionsWithExpressions);
      console.log("score2-----", score2);
      if (score2) {
        database.scores.doc(room.name).set(
          {
            [participant.identity]: score2,
          },
          { merge: true }
        );
      } else {
        console.log("no score!");
      }
    }
    setLoading(false);
  }

  return (
    <div>
      <div class="flex justify-center">
        <canvas width="300px" height="300px" id={participant.identity + "-canvas"} />
      </div>
      <button
        class="bg-pink-400 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-full mb-2"
        onClick={videoCapture}
      >
        Game Set
      </button>
      {isReady === true ? (
        <button
          class="bg-pink-400 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-full mb-2"
          onClick={capture}
        >
          Capture Me
        </button>
      ) : (
        <button class="bg-gray-400 text-white font-bold py-2 px-4 rounded-full mb-2">
          {" "}
          Capture Me
        </button>
      )}
      {isCapture === true ? (
        <button
          class="bg-pink-400 hover:bg-pink-700 text-white font-bold py-2 px-4 rounded-full mb-5"
          id={participant.identity + "-analyse"}
          onClick={analyse}
        >
          Analyse Me
        </button>
      ) : (
        <button class="bg-gray-400 text-white font-bold py-2 px-4 rounded-full mb-5">
          {" "}
          Analyse Me
        </button>
      )}

      {error ? (
        <span class="text-red-300">{error}</span>
      ) : (
        <span class="text-red-300 invisible">"this is the error place</span>
      )}

      {isLoading === true ? (
        <div class="flex justify-center">
          <Loader type="Circles" color="rgb(244, 114, 182)" height={50} width={50} />
        </div>
      ) : (
        <div class="flex justify-center invisible">
          <Loader type="Circles" color="rgb(244, 114, 182)" height={50} width={50} />
        </div>
      )}
      <div class="h-1/2 content-center" id={participant.identity + "div"}>
        <h2 class="text-2xl text-center text-white">{participant.identity}</h2>
        {tracks.map((track) => (
          <Track
            class="h-1/2 content-center"
            key={track}
            participant={participant}
            track={track}
          />
        ))}
      </div>
    </div>
  );
}
