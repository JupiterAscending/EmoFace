import "./App.scss";
import Track from "./Track";
import React, { useState, useEffect } from "react";
import * as canvas from "canvas";
import * as faceapi from "face-api.js";
import { database } from "./firebase";

export default function Participant ({
	participant,
	localParticipant,
	isAnalysed1,
	setAnalysed1,
	isAnalysed2,
	setAnalysed2,
	room,
	setPrompt,
	count,
	setCount,
}) {
	const existingPublications = Array.from(participant.tracks.values());
	const existingTracks = existingPublications.map((publication) => publication.track);
	const nonNullTracks = existingTracks.filter((track) => track !== null);

	const [ tracks, setTracks ] = useState(nonNullTracks);
	const [ video, setVideo ] = useState("");
	const [ isReady, setReady ] = useState(false);
	const [ isCapture, setCapture ] = useState(false);

	const [ result1, setResult_p1 ] = useState([
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

	const [ result2, setResult_p2 ] = useState([
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

	console.log(result1);
	const [ canvas, setCanvas ] = useState();

	useEffect(() => {
		if (!localParticipant) {
			participant.on("trackSubscribed", (track) => addTrack(track));
		}
	}, []);

	function addTrack (track) {
		setTracks([ ...tracks, track ]);
	}

	function videoCapture () {
		const name = participant.identity;
		setCanvas(document.getElementById(name + "-canvas"));
		setVideo(document.getElementById(name));
		setReady(true);
		setCount(count + 1);
	}
	function capture () {
		let canvasSizeX = 300; //canvasの幅
		let canvasSizeY = canvasSizeX * video.videoHeight / video.videoWidth; //canvasの高さ
		canvas.getContext("2d").drawImage(video, 0, 0, canvasSizeX, canvasSizeY); //videoタグの「今」の状態をcanvasに描写
		setCapture(true);
	}

	function calculateScore (detectionsWithExpressions) {
		const float = parseFloat(detectionsWithExpressions[0].expressions.happy);
		const multiplied = float * 100;
		const score = Math.round(multiplied);
		console.log({ float, multiplied, score });
		return score;
	}

	async function analyse () {
		await faceapi.nets.tinyFaceDetector.load("/models");
		await faceapi.nets.faceExpressionNet.load("/models");
		const detectionsWithExpressions = await faceapi
			.detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
			.withFaceExpressions();

		console.log(detectionsWithExpressions);

		if (isAnalysed1 === false) {
			console.log("setting to result1");
			setAnalysed1(true);
			setResult_p1(detectionsWithExpressions);
			const score = calculateScore(detectionsWithExpressions);
			console.log("score1-----", score);
			database.scores.doc(room.name).set(
				{
					[participant.identity]: score,
				},
				{ merge: true }
			);

			//firebaseにスコア投げる
			// detectionsWithExpressions[0].expressions.happy
			//float & round 小数点なし　* 100
		} else {
			console.log("setting to result2");
			setAnalysed2(true);
			setResult_p2(detectionsWithExpressions);
			//firebaseにスコア投げる
			// detectionsWithExpressions[0].expressions.happy
			//float & round 小数点なし　* 100
			const score2 = calculateScore(detectionsWithExpressions);
			console.log("score2-----", score2);
			database.scores.doc(room.name).set(
				{
					[participant.identity]: score2,
				},
				{ merge: true }
			);
		}
	}

	console.log(canvas, "this is canvas");

	return (
		<div>
			<canvas width="300px" height="300px" id={participant.identity + "-canvas"} />

			<button
				class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-2"
				onClick={videoCapture}
			>
				Set
			</button>
			{isReady === true ? (
				<button
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-2"
					onClick={capture}
				>
					Capture Me
				</button>
			) : (
				""
			)}
			{isCapture === true ? (
				<button
					class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-5"
					id={participant.identity + "-analyse"}
					onClick={analyse}
				>
					Analyse Me
				</button>
			) : (
				""
			)}

			<div class="h-1/2 content-center" id={participant.identity + "div"}>
				<h2 class="text-2xl text-center text-white">{participant.identity}</h2>
				{tracks.map((track) => (
					<Track class="h-1/2 content-center" key={track} participant={participant} track={track} />
				))}
			</div>

			{/* <h1>result1[0].expressions &&Result 1: {result1}</h1>
      <h1>result2[0].expressions && Result 2: {result2}</h1> */}
			{result1[0].expressions ? result1[0].expressions.happy : "nothing"}
			{result2[0].expressions ? result2[0].expressions.happy : "nothing"}
		</div>
	);
}

// realtime data入れるぜ
