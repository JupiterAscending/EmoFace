import "./App.scss";
import React, { useState } from "react";
import VideoChat from "./videochat/VideoChat";
import OnBoarding from "./OnBoarding";

export default function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  return (
    <main className="bg-blue-900 flex justify-center ">
      <div class="mt-10">
        <h1 className="text-5xl text-white text-center lg:text-7xl mb-5">EmoFace 🤪</h1>
        <div className="text-white text-center">
          <button
            className="hover:text-pink-700 fixed top-0 right-0"
            onClick={() => {
              setShowOnboarding(!showOnboarding);
            }}
          >
            👀 New to Emoface? Click here!
          </button>
        </div>
        {showOnboarding && <OnBoarding setShowOnboarding={setShowOnboarding} />}
        <VideoChat />
      </div>
    </main>
  );
}
