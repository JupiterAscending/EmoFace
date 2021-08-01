import React, { useState, useCallback } from "react";
import axios from "axios";
import Lobby from "./Lobby";
import Room from "./Room";

const VideoChat = () => {
  const [username, setUsername] = useState("");
  const [roomName, setRoomName] = useState("");
  const [token, setToken] = useState(null);

  const handleUsernameChange = useCallback((e) => {
    setUsername(e.target.value);
  }, []);
  const handleRoomNameChange = useCallback((e) => {
    setRoomName(e.target.value);
  }, []);
  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const response = await axios.post("/video-token", {
        identity: username,
        room: roomName,
      });
      setToken(response.data.token);
    },
    [username, roomName]
  );
  const handleLogout = useCallback((e) => {
    setToken(null);
  });
  let render;
  if (token) {
    render = <Room roomName={roomName} token={token} handleLogout={handleLogout} />;
  } else {
    render = (
      <Lobby
        username={username}
        roomName={roomName}
        handleUsernameChange={handleUsernameChange}
        handleRoomNameChange={handleRoomNameChange}
        handleSubmit={handleSubmit}
      />
    );
  }
  return render;
};

export default VideoChat;
