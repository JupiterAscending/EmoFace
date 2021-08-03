import React from "react";

function Lobby({
  username,
  handleUsernameChange,
  roomName,
  handleRoomNameChange,
  handleSubmit,
}) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-blue-900 flex flex-col content-center justify-content mt-20">
        <div className="flex justify-center">
          <input
            className="mt-5 shadow appearance-none  rounded w-full lg:w-5/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            type="text"
            placeholder="Enter a room name"
            id="room"
            value={roomName}
            onChange={handleRoomNameChange}
            required
          />
        </div>
        <div className="flex justify-center">
          <input
            className="shadow appearance-none  rounded w-full lg:w-5/6 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="What's your name?"
            type="text"
            id="field"
            value={username}
            onChange={handleUsernameChange}
            required
          />
        </div>
      </div>
      <button
        className="px-9 py-4 mb-4 mt-5 text-base font-semibold rounded-full block bg-pink-400 border border-white text-white hover:bg-pink-700"
        type="submit"
      >
        Join Room
      </button>
    </form>
  );
}

export default Lobby;
