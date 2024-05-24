/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import "../css/HeroSection.scss";

function HeroSection() {
  return (
    <div className="hero_container w-full h-full flex-1 flex-col items-center justify-center bg-black">
      <video
        src="/videos/video2.mp4"
        autoPlay
        loop
        muted
        className="object-right"
      />
      <div
        className={`side_text w-[30%] min-w-[400px] h-full min-h-[600px] absolute top-0 right-0 bg-black opacity-[0.85] flex flex-col items-center justify-start px-4`}
      >
        <h1 className="text-[34px] font-bold text-white pt-56">My Pet</h1>
        <p className="text-[19px] text-white mt-7 px-4">
          Your furry friend's perfect companion awaits. MyPet is your one-stop
          destination for all things pet-related, designed to make life with
          your beloved companion easier, happier, and more fulfilling.
        </p>
        <button className="w-36 h-12 bg-amber-500 rounded-lg text-white font-bold opacity-100 mt-16 text-[18px]">
          LET'S START
        </button>
      </div>
    </div>
  );
}

export default HeroSection;
