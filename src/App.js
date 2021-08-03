import "./App.scss";
import React from "react";
// import { database } from "./firebase";
import VideoChat from "./videochat/VideoChat";

export default function App() {
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
