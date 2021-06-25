import React, { useState, useEffect } from "react";
import Participant from "./Participant";
import { database } from "./firebase";
import "./Room.scss";

export default function Room({ room, returnToLobby }) {
  const [isAnalysed1, setAnalysed1] = useState(false);
  const [isAnalysed2, setAnalysed2] = useState(false);
  const [prompt, setPrompt] = useState("miho");
  const [count, setCount] = useState(0);
  const [remoteParticipants, setRemoteParticipants] = useState(
    Array.from(room.participants.values())
  );
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [username2, setusername2] = useState("");
  useEffect(() => {
    // console.log("REMOTE PARTICIPANTS INSIDE ROOM", remoteParticipants);
    // console.log("this is room in Room component", room);
    room.on("participantConnected", (participant) => addParticipant(participant));
    room.on("participantDisconnected", (participant) => removeParticipant(participant));

    window.addEventListener("beforeunload", leaveRoom);
    database.scores.doc(room.name).onSnapshot((doc) => {
      const currentPrompt = doc.data().prompt;
      //   const isPlaying = doc.data().isPlaying;
      console.log("Realtime update snapshot-----", doc.data());
      setPrompt(currentPrompt);

      console.log("room inside realtimeupdate-----", room);
      const user1score = doc.data()[room.localParticipant.identity];
      setScore1(user1score);

      let user2name;
      let user2score = 0;
      const userArr = Array.from(room.participants.values());
      if (userArr.length > 0) {
        user2name = userArr[0].identity;
        setusername2(user2name);
        user2score = doc.data()[user2name];
        setScore2(user2score);
        console.log("SCORE2 SET WITH,", user2score);
      }
    });

    return () => {
      leaveRoom();
    };
  }, []);

  // useEffect count が変わったとき動作、 if count === 2 firebaseにprompt を入れる。
  // realtimeでprompt表示
  useEffect(() => {
    if (count >= 2) {
      console.count("generatePrompt running-----");
      //   const prompt = generatePrompt();
      console.log("prompt------", prompt);
      database.scores
        .doc(room.name)
        .update({
          prompt: prompt,
        })
        .then(() => {
          console.log("prompt updated!!", prompt);
        });
    }
  }, [count]);

  function generatePrompt() {
    const prompts = [
      "angry",
      "disgusted",
      "fearful",
      "happy",
      "neutral",
      "sad",
      "surprised",
    ];
    const index = Math.floor(Math.random() * prompts.length);
    const prompt = prompts[index];
    setPrompt(prompt);
    return prompt;
  }
  const faces = {
    angry: "😠",
    disgusted: "🤢",
    fearful: "😨",
    happy: "😊",
    neutral: "😐",
    sad: "🥺",
    surprised: "😲",
  };

  function addParticipant(participant) {
    console.log(`${participant.identity} has joined the room.`);

    setRemoteParticipants([...remoteParticipants, participant]);
  }

  function removeParticipant(participant) {
    console.log(`${participant.identity} has left the room`);
    setRemoteParticipants(
      remoteParticipants.filter((p) => p.identity !== participant.identity)
    );
  }
  function leaveRoom() {
    room.disconnect();
    returnToLobby();
  }

  return (
    <div>
      <span class="text-xs text-white text-right ml-3">You are in ROOM: {room.name}</span>
      {count >= 2 ? (
        <div class="mt-3 text-xl text-pink-300 ml-3 text-center md:text-2xl lg:text-3xl">
          <span class="mb-2">
            Make your {prompt} {faces[prompt]} face!
          </span>
          <br />
          <span class="text-white mt-6">
            {" "}
            {room.localParticipant.identity}: {score1} %
            <br />
            {username2}: {score2} %
          </span>
        </div>
      ) : (
        <div class="mt-3 text-xl text-pink-300 ml-3 text-center md:text-2xl lg:text-3xl ">
          <span class="mb-2 text-transparent">Prompt will be shown after game set</span>
          <br />
          <span class="text-transparent mt-6">
            {" "}
            Score
            <br />
            Score
          </span>
        </div>
      )}
      <div />

      <div class="grid grid-cols-2 gap-2 col-start-1">
        <Participant
          generatePrompt={generatePrompt}
          isAnalysed1={isAnalysed1}
          setAnalysed1={setAnalysed1}
          isAnalysed2={isAnalysed2}
          setAnalysed2={setAnalysed2}
          key={room.localParticipant.identity}
          localParticipant="true"
          participant={room.localParticipant}
          prompt={prompt}
          count={count}
          setCount={setCount}
          room={room}
          setPrompt={setPrompt}
          username2={username2}
        />
        {remoteParticipants.map((participant) => (
          <Participant
            generatePrompt={generatePrompt}
            key={participant.identity}
            participant={participant}
            isAnalysed1={isAnalysed1}
            setAnalysed1={setAnalysed1}
            isAnalysed2={isAnalysed2}
            setAnalysed2={setAnalysed2}
            count={count}
            setCount={setCount}
            prompt={prompt}
            room={room}
            setPrompt={setPrompt}
            username2={username2}
          />
        ))}
      </div>
      <div class="flex justify-center">
        <button
          id="leaveRoom"
          onClick={leaveRoom}
          class="bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full mt-5 mb-2"
        >
          Leave Room
        </button>
      </div>
    </div>
  );
}
