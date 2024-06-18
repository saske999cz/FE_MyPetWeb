/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from "react";
import "../css/LandingPage.scss";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import NavBar from "../components/NavBar";
import FeaturesSection from "../components/FeaturesSection";
import RegisterSection from "../components/RegisterSection";
import AboutSection from "../components/AboutSection";
import ContactSection from "../components/ContactSection";

function LandingPage() {
  const aboutRef = useRef(null);
  const featuresRef = useRef(null);
  const registerRef = useRef(null);
  const contactRef = useRef(null);

  const scrollToSection = (section) => {
    let ref;
    if (section === "about") ref = aboutRef.current;
    if (section === "features") ref = featuresRef.current;
    if (section === "register") ref = registerRef.current;
    if (section === "contact") ref = contactRef.current;

    if (ref) {
      let offset = -110;
      if (section === "about") offset = -30;
      const elementPosition =
        ref.getBoundingClientRect().top + window.pageYOffset;
      const offsetPosition = elementPosition + offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="landing_page bg-black">
      <NavBar scrollToSection={scrollToSection} />
      <HeroSection scrollToSection={scrollToSection} />
      <FeaturesSection ref={featuresRef} />
      <RegisterSection ref={registerRef} />
      <AboutSection ref={aboutRef} />
      <ContactSection ref={contactRef} />
    </div>
  );
}

export default LandingPage;
