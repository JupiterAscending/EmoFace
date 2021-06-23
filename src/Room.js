import React, { useState, useEffect } from "react";
import Participant from "./Participant";
// import { RemoteParticipant } from "twilio-video";
import "./App.scss";

export default function Room({ room, returnToLobby }) {
  const [isAnalysed1, setAnalysed1] = useState(false);
  const [isAnalysed2, setAnalysed2] = useState(false);
  const [prompt, setPrompt] = useState("happy");
  const [isPlaying, setIsPlaying] = useState(false);

  const [remoteParticipants, setRemoteParticipants] = useState(
    Array.from(room.participants.values())
  );
  useEffect(() => {
    room.on("participantConnected", (participant) =>
      addParticipant(participant)
    );
    room.on("participantDisconnected", (participant) =>
      removeParticipant(participant)
    );

    window.addEventListener("beforeunload", leaveRoom);

    return () => {
      leaveRoom();
    };
  }, []);

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
      <p id="prompt">{prompt}</p>
      <div className="room">
        You are in ROOM: {room.name}
        <div className="participants">
          <Participant
            isAnalysed1={isAnalysed1}
            setAnalysed1={setAnalysed1}
            isAnalysed2={isAnalysed2}
            setAnalysed2={setAnalysed2}
            key={room.localParticipant.identity}
            localParticipant="true"
            participant={room.localParticipant}
            prompt={prompt}
            setIsPlaying={setIsPlaying}
          />
          {remoteParticipants.map((participant) => (
            <Participant
              key={participant.identity}
              participant={participant}
              isAnalysed1={isAnalysed1}
              setAnalysed1={setAnalysed1}
              isAnalysed2={isAnalysed2}
              setAnalysed2={setAnalysed2}
              prompt={prompt}
              setIsPlaying={setIsPlaying}
            />
          ))}
        </div>
        <button id="leaveRoom" onClick={leaveRoom}>
          Leave Room
        </button>
      </div>
    </div>
  );
}
