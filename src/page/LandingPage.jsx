/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import "../css/LandingPage.scss";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import NavBar from "../components/NavBar";
import FeaturesSection from "../components/FeaturesSection";

function LandingPage() {
  const handleAboutClick = () => {};
  const handleFeaturesClick = () => {};
  const handleContactClick = () => {};

  return (
    <div className="landing_page bg-black">
      <NavBar
        handleAboutClick={handleAboutClick}
        handleContactClick={handleContactClick}
        handleFeaturesClick={handleFeaturesClick}
      />
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}

export default LandingPage;
