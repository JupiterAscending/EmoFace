import React, { useState, useEffect } from "react";
import Video from "twilio-video";
import Participant from "./Participant";

import GameBoard from "../game/GameBoard";

function Room({ roomName, token, handleLogout }) {
  const [room, setRoom] = useState(null);

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

      {room && <GameBoard room={room} />}

      <div className="participants">
        {room ? (
          <div className="local-participant">
            <Participant
              key={room.localParticipant.sid}
              participant={room.localParticipant}
            />
          </div>
        ) : (
          ""
        )}
        <div className="remote-participants">{remoteParticipants}</div>
      </div>

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
