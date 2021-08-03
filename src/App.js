import "./App.scss";
import React from "react";
import VideoChat from "./videochat/VideoChat";

export default function App() {
  return (
    <div class="bg-blue-900 flex justify-center">
      <div class="mt-10">
        <h1 className="text-5xl text-white text-center lg:text-7xl mb-5">EmoFace 🤪</h1>
        <VideoChat />
      </div>
    </div>
  );
}
