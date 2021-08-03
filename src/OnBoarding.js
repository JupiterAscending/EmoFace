import React from "react";

export default function OnBoarding({ setShowOnboarding }) {
  return (
    <div className="onboarding-container">
      <div className="text-box">
        <h1 className="text-center text-5xl mb-5">How to Play EmoFace 🤪</h1>
        <p>1. Choose a unique name for your room 👀</p>
        <p>2. Share it with your friend 👭</p>
        <p>3. Choose a prompt 🥳</p>
        <p>4. Press "Game Set" whenever you are ready! 😁</p>
      </div>
      <button
        className="px-9 py-4 mb-4 mt-5 text-base font-semibold rounded-full block bg-pink-400 border border-white text-white hover:bg-pink-700"
        onClick={() => {
          setShowOnboarding(false);
        }}
      >
        Got it!
      </button>
    </div>
  );
}
