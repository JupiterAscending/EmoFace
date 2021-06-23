import "./App.scss";
import Track from "./Track";
import React, { useState, useEffect } from "react";
import * as canvas from "canvas";
import * as faceapi from "face-api.js";

export default function Participant ({
	participant,
	localParticipant,
	isAnalysed1,
	setAnalysed1,
	isAnalysed2,
	setAnalysed2,
	prompt,
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
	const [ result1, setResult_p1 ] = useState();
	const [ result2, setResult_p2 ] = useState();
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
		let canvasSizeX = 100; //canvasの幅
		let canvasSizeY = 100; //canvasの高さ
		canvas.getContext("2d").drawImage(video, 0, 0, canvasSizeX, canvasSizeY); //videoタグの「今」の状態をcanvasに描写
		setCapture(true);
	}

	async function analyse () {
		await faceapi.nets.tinyFaceDetector.load("/models");
		await faceapi.nets.faceExpressionNet.load("/models");
		const detectionsWithExpressions = await faceapi
			.detectAllFaces(canvas, new faceapi.TinyFaceDetectorOptions())
			.withFaceExpressions();

		console.log(detectionsWithExpressions);
		// console.log(prompt);

		if (isAnalysed1 === false && detectionsWithExpressions.length !== 0) {
			console.log("setting to result1");
			setAnalysed1(true);
			setResult_p1(detectionsWithExpressions);
		} else if (isAnalysed2 === false && detectionsWithExpressions.length !== 0) {
			console.log("setting to result2");
			setAnalysed2(true);
			setResult_p2(detectionsWithExpressions);
		}
	}

	console.log(canvas, "this is canvas");

	return (
		<div className="video-container">
			<div>
				{isAnalysed1 === true ? "true" : "false"}
				{isAnalysed2 === true ? "true" : "false"}
				{count}

				{tracks.map((track) => (
					<div>
						<canvas width="150" id={participant.identity + "-canvas"} />
					</div>
				))}

				<button onClick={videoCapture}>Set</button>
				{isReady === true ? <button onClick={capture}>Capture Me</button> : <p>Please click the Set Button</p>}
				{isCapture === true ? (
					<button id={participant.identity + "-analyse"} onClick={analyse}>
						Analyse Me
					</button>
				) : (
					<p>Please click the Set Button</p>
				)}
			</div>
			<div width="100px" className="participant" id={participant.identity + "div"}>
				<div className="identity">{participant.identity}</div>
				{tracks.map((track) => <Track key={track} participant={participant} track={track} />)}
			</div>
			<br />
			<p>{result1 ? result1[0].expressions.happy : "nothing"}</p>
			<p>{result2 ? result2[0].expressions.happy : "nothing"}</p>
		</div>
	);
}
