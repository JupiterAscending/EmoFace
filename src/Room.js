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
  const [score1, setScore1] = useState(0);
  const [score2, setScore2] = useState(0);
  const [username2, setusername2] = useState("");
  //   console.log("REMOTE PARTICIPANTS INSIDE ROOM", remoteParticipants);
  //   console.log("this is room in Room component", room);

  useEffect(() => {
    room.on("participantConnected", (participant) => {
      //   console.log("adding participant");
      addParticipant(participant);
    });
    room.on("participantDisconnected", (participant) => removeParticipant(participant));

    window.addEventListener("beforeunload", leaveRoom);
    database.scores.doc(room.name).onSnapshot((doc) => {
      const currentPrompt = doc.data().prompt;
      //   console.log("Realtime update snapshot-----", doc.data());
      setPrompt(currentPrompt);

      //   console.log("room inside realtimeupdate-----", room);
      const user1score = doc.data()[room.localParticipant.identity];
      setScore1(user1score);
      //   const user2name = remoteParticipants.map((participant) => {
      //     // console.log("PARTICIPANT", participant);
      //     return participant.identity;
      //   });
      let user2name;
      let user2score = 0;
      const userArr = Array.from(room.participants.values());
      if (userArr.length > 0) {
        user2name = userArr[0].identity;
        setusername2(user2name);
        user2score = doc.data()[user2name];
        setScore2(user2score);
        // console.log("SCORE2 SET WITH,", user2score);
      }
      //   console.log("USER2----", user2name);
      //   console.log({ user1score, user2score });
      //   console.log({ user1score });
    });

    return () => {
      leaveRoom();
    };
  }, []);

  // useEffect count が変わったとき動作、 if count === 2 firebaseにprompt を入れる。
  // realtimeでprompt表示
  useEffect(() => {
    // console.log("useEffect count-----", count);
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
    <React.Fragment>
      <div class="border-2 flex justify-content">
        <h1 class="text-3xl text-white ml-3">You are in ROOM: {room.name}</h1>
        <p> これがプロンプトだよーーー{prompt}</p>
        <div>
          <p>
            {" "}
            {room.localParticipant.identity}のスコア: {score1}
            {username2}のスコア2: {score2}
          </p>
        </div>

        <div class="grid grid-cols-1 gap-2 md:grid-cols-2 col-start-1">
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
      </div>
      <button id="leaveRoom" onClick={leaveRoom}>
        Leave Room
      </button>
    </React.Fragment>
  );
}
