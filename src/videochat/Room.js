import React, { useState, useEffect } from "react";
import Video from "twilio-video";
import Participant from "./Participant";
import { faces, generatePrompt } from "../utils/gameHelper";

function Room({ roomName, token, handleLogout }) {
  const [room, setRoom] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [username2, setusername2] = useState("");
  const [isAnalysed1, setAnalysed1] = useState(false);
  const [isAnalysed2, setAnalysed2] = useState(false);
  const [count, setCount] = useState(0);

  console.log("rooom.localParticipant", room);

  const [participants, setParticipants] = useState([]);
  const remoteParticipants = participants.map((participant) => (
    <Participant key={participant.sid} participant={participant} />
  ));

  useEffect(() => {
    const participantConnected = (participant) => {
      setParticipants((prevParticipants) => [...prevParticipants, participant]);
    };

    const participantDisconnected = (participant) => {
      setParticipants((prevParticipants) =>
        prevParticipants.filter((p) => p !== participant)
      );
    };

    Video.connect(token, {
      name: roomName,
    }).then((room) => {
      setRoom(room);
      room.on("participantConnected", participantConnected);
      room.on("participantDisconnected", participantDisconnected);
      room.participants.forEach(participantConnected);
    });

    return () => {
      setRoom((currentRoom) => {
        if (currentRoom && currentRoom.localParticipant.state === "connected") {
          currentRoom.localParticipant.tracks.forEach(function (trackPublication) {
            trackPublication.track.stop();
          });
          currentRoom.disconnect();
          return null;
        } else {
          return currentRoom;
        }
      });
    };
  }, [roomName, token]);
  return (
    <div>
      <span class="text-xs text-white text-right ml-3">You are in ROOM: {roomName}</span>

      {room && (
        <div class="mt-3 text-xl text-pink-300 ml-3 text-center md:text-2xl lg:text-3xl">
          <span class="mb-2">
            Make your {prompt} {faces[prompt]} face!
          </span>
          <br />
          <span class="text-white mt-6">
            {room.localParticipant.identity}: {score1} %
            <br />
            {username2}: {score2} %
          </span>
        </div>
      )}

      <div className="local-participant">
        {room ? (
          <Participant
            key={room.localParticipant.sid}
            participant={room.localParticipant}
          />
        ) : (
          ""
        )}
      </div>
      <div className="remote-participants">{remoteParticipants}</div>

      <button
        id="leaveRoom"
        onClick={handleLogout}
        class="bg-gray-400 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full mt-5 mb-2"
      >
        Leave Room
      </button>
    </div>
  );
}

export default Room;
