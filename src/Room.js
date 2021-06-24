import React, { useState, useEffect } from "react";
import Participant from "./Participant";
import { database } from "./firebase";

// import { RemoteParticipant } from "twilio-video";
// import "./App.scss";

export default function Room({ room, returnToLobby }) {
  const [isAnalysed1, setAnalysed1] = useState(false);
  const [isAnalysed2, setAnalysed2] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [count, setCount] = useState(0);
  const [remoteParticipants, setRemoteParticipants] = useState(
    Array.from(room.participants.values())
  );
  useEffect(() => {
    console.log("this is room in Room component", room);
    room.on("participantConnected", (participant) => addParticipant(participant));
    room.on("participantDisconnected", (participant) => removeParticipant(participant));

    window.addEventListener("beforeunload", leaveRoom);
    database.scores.doc(room.name).onSnapshot((doc) => {
      const currentPrompt = doc.data().prompt;
      console.log("Realtime update snapshot-----currentPrompt", currentPrompt);
      setPrompt(currentPrompt);
    });

    return () => {
      leaveRoom();
    };
  }, []);

  // useEffect count が変わったとき動作、 if count === 2 firebaseにprompt を入れる。
  // realtimeでprompt表示
  useEffect(() => {
    console.log("useEffect count-----", count);
    if (count === 2) {
      database.scores
        .doc(room.name)
        .update({
          prompt: "happy",
        })
        .then(() => {
          console.log("prompt updated!!");
        });
    }
  }, [count]);

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
    <div className="room">
      You are in ROOM: {room.name}
      <div className="participants">
        <p> これがプロンプトだよーーー{prompt}</p>
        {count === 2 ? <p id="prompt">{prompt}</p> : ""}

        <Participant
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
        />
        {remoteParticipants.map((participant) => (
          <Participant
            key={participant.identity}
            participant={participant}
            isAnalysed1={isAnalysed1}
            setAnalysed1={setAnalysed1}
            isAnalysed2={isAnalysed2}
            setAnalysed2={setAnalysed2}
            count={count}
            setCount={setCount}
            room={room}
            setPrompt={setPrompt}
          />
        ))}
      </div>
      <button id="leaveRoom" onClick={leaveRoom}>
        Leave Room
      </button>
    </div>
  );
}
