import "./App.scss";
import React, { useState, useRef, useEffect } from "react";
import Room from "./Room";
import { database } from "./firebase";

const { connect } = require("twilio-video");

export default function App() {
  const [identity, setIdentity] = useState("");
  const [room, setRoom] = useState(null);
  const [roomName, setRoomName] = useState("");
  const inputRef = useRef();
  const [error, setError] = useState("");

  useEffect(() => {
    database.test.get().then((snapshot) => {
      snapshot.docs.map((s) => console.log(s.data()));
    });
  }, []);

  async function joinRoom() {
    try {
      const response = await fetch(
        `https://video-sample-jp-3971-dev.twil.io/video-token`,
        {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            identity: identity,
            room_name: roomName,
          }),
        }
      );

      const data = await response.json();
      console.log(data);
      console.log(`token: ${data.accessToken}`);
      console.log(`room: ${data.room}`);

      const room = await connect(data.accessToken, {
        room: data.room,
        audio: true,
        video: { width: 426 },
      });

      setRoom(room);

      database.scores
        .doc(roomName)
        .set(
          {
            [identity]: 0,
            finished: false,
            prompt: "",
          },
          { merge: true }
        )
        .then(() => {
          console.log("insertion successful");
        });
    } catch (err) {
      console.log("this is inside catch");
      setError("This room is currently occuppied. Please choose a differet room.");
    }
  }
  function returnToLobby() {
    setRoom(null);
  }

  function removePlaceholderText() {
    inputRef.current.placeholder = "";
  }
  function updateIdentity(event) {
    setIdentity(event.target.value);
  }
  function updateRoomName(e) {
    setRoomName(e.target.value);
  }
  const disabled = identity === "" ? true : false;

  return (
    <div class="bg-blue-900 flex mt-5 justify-center">
      {room === null ? (
        <div>
          <h1 className="text-white text-center text-3xl mb-5">EmoFace 🤪</h1>
          <div className="bg-blue-900 flex flex-col items-center">
            <div>
              <input
                class="shadow appearance-none  rounded w-100 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="room name"
                onChange={updateRoomName}
              />
            </div>
            <input
              class="shadow appearance-none  rounded w-100 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="What's your name?"
              ref={inputRef}
              value={identity}
              onChange={updateIdentity}
              onClick={removePlaceholderText}
            />
            <button
              class="px-9 py-4 mb-4 text-base font-semibold rounded-full block bg-pink-400 border border-white text-white hover:bg-pink-700"
              onClick={joinRoom}
            >
              Join Room
            </button>
            <p class="text-white">{error}</p>
          </div>
        </div>
      ) : (
        <Room returnToLobby={returnToLobby} room={room} />
      )}
    </div>
  );
}
