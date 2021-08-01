import "./App.scss";
import React, { useState, useRef, useEffect } from "react";
import Room from "./Room";
import { database } from "./firebase";
import VideoChat from "./videochat/VideoChat";

// const { connect } = require("twilio-video");

export default function App() {
  // const [identity, setIdentity] = useState("");
  // // const [room, setRoom] = useState(null);
  // const [roomName, setRoomName] = useState("");
  // const [token, setToken] = useState(null)
  // const inputRef = useRef();

  // const handleUsernameChange = useCallback((e) => {
  //   setUsername(e.target.value);
  // }, []);
  // const handleRoomNameChange = useCallback((e) => {
  //   setRoomName(e.target.value);
  // }, []);
  // const [error, setError] = useState("");

  // useEffect(() => {
  //   database.test.get().then((snapshot) => {
  //     snapshot.docs.map((s) => console.log(s.data()));
  //   });
  // }, []);

  // async function joinRoom() {
  //   try {
  //     const data = await axios(`/video-token`, {
  //       identity: identity,
  //       room_name: roomName,
  //     });

  //     console.log(data);
  //     console.log(`token: ${data.token}`);
  //     console.log(`room: ${data.room}`);

  //     const room = await connect(data.accessToken, {
  //       room: data.room,
  //       audio: true,
  //       video: { width: 426 },
  //     });

  //     setRoom(room);

  //     database.scores
  //       .doc(roomName)
  //       .set(
  //         {
  //           [identity]: 0,
  //           finished: false,
  //           prompt: "",
  //           isPlaying: false,
  //         },
  //         { merge: true }
  //       )
  //       .then(() => {
  //         console.log("insertion successful");
  //       });
  //   } catch (err) {
  //     console.log("this is inside catch");
  //     setError("This room is currently occuppied. Please choose a differet room.");
  //   }
  // }
  // function returnToLobby() {
  //   setRoom(null);
  // }

  // function removePlaceholderText() {
  //   inputRef.current.placeholder = "";
  // }
  // function updateIdentity(event) {
  //   setIdentity(event.target.value);
  // }
  // function updateRoomName(e) {
  //   setRoomName(e.target.value);
  // }
  // const disabled = identity === "" ? true : false;

  return (
    <div class="bg-blue-900 flex justify-center">
      <div class="mt-10">
        <h1 className="text-5xl text-white text-center lg:text-7xl mb-5">EmoFace 🤪</h1>
        <VideoChat />
      </div>
    </div>
  );
}
