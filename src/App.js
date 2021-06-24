import "./App.scss";
import React, { useState, useRef, Fragment, useEffect } from "react";
import Room from "./Room";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Hidden from "@material-ui/core/Hidden";
import { makeStyles } from "@material-ui/core/styles";
import { database } from "./firebase";

import Prompt from "./components/Prompt";
import Video from "./components/Video";
const { connect } = require("twilio-video");

export default function App() {
  const [identity, setIdentity] = useState("");
  const [room, setRoom] = useState(null);
  const [roomName, setRoomName] = useState("");
  const inputRef = useRef();

  // function returnToLobby () {
  // 	setRoom(null);
  // }

  // function removePlaceholderText () {
  // 	inputRef.current.placeholder = "";
  // }
  // function updateIdentity (event) {
  // 	setIdentity(event.target.value);
  // }
  // function updateRoomName (e) {
  // 	// console.log(e.target.value);
  // 	setRoomName(e.target.value);
  // }
  // const disabled = identity === "" ? true : false;

  // useEffect(() => {
  //   database.test.get().then((snapshot) => {
  //     // console.log(snapshot);
  //     snapshot.docs.map((s) => console.log(s.data()));
  //   });

  //   // database.test((snapshot))
  // }, []);

  // console.log({ identity, room, roomName });

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
      console.log(`token: ${data.accessToken}`);
      console.log(`room: ${data.room}`);
      // console.log(`roomSid: ${roomSid}`);
      const room = await connect(data.accessToken, {
        room: data.room,
        audio: true,
        video: true,
      });
      // console.log("this is rooom ----------", room);
      //   const room = data.room;
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
          // console.log("insertion successful");
        });
    } catch (err) {
      console.log(err);
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
    // console.log(e.target.value);
    setRoomName(e.target.value);
  }
  const disabled = identity === "" ? true : false;

  return (
    <div className="bg-blue-900">
      <h1 className="text-white text-center text-3xl mb-5">EmoFace</h1>
      {room === null ? (
        <div className="flex justify-center">
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
              class="px-9 py-4 mb-4 text-base font-semibold rounded-full block hover:bg-pink-400 border border-white text-white "
              onClick={joinRoom}
            >
              Join Room
            </button>
          </div>
        </div>
      ) : (
        <Room returnToLobby={returnToLobby} room={room} />
      )}
    </div>
  );
}
