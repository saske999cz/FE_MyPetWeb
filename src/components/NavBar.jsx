import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../css/NavBar.scss";
import logo from "../assets/images/LogoWhite.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faArrowUp } from "@fortawesome/free-solid-svg-icons";

function NavBar({ scrollToSection }) {
  const [isScrolled, setIsScrolled] = useState(false);

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const handleScroll = () => {
      const top = window.scrollY;
      if (top > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="nav_bar_container w-full h-28 flex flex-row items-center justify-between z-5">
      <div className="w-44 min-w-[150px] h-[75%] flex flex-row items-center justify-center -mt-2">
        <img
          src={logo}
          className="w-full h-full"
          alt="logo"
          style={{ objectFit: "contain" }}
        />
      </div>
      {isScrolled && (
        <div
          className="w-[40px] h-[40px] min-w-[20px] ml-[530px] mt-[130px] bg-white rounded-full border-solid border-1 border-gray-300  transform -translate-y-1/2 hover:cursor-pointer hover:bg-yellow-800 hover:text-white flex flex-row items-center justify-center"
          onClick={handleScrollToTop}
        >
          <FontAwesomeIcon
            icon={faArrowUp}
            style={{ fontSize: 20, color: "#f59e0b" }}
            beat
          />
        </div>
      )}
      <div className="w-1/2 min-w-[500px] h-full flex flex-row items-center justify-end mr-28">
        <div
          className="w-24 h-12 flex flex-row items-center justify-center mr-10 hover:text-yellow-800 text-white font-bold text-[18px] hover:cursor-pointer hover:border-b-2 hover:border-yellow-800 hover:border-solid"
          onClick={() => scrollToSection("about")}
        >
          ABOUT
        </div>
        <div
          className="w-24 h-12 flex flex-row items-center justify-center mr-10 text-white font-bold text-[18px] hover:text-yellow-800 hover:cursor-pointer hover:border-b-2 hover:border-yellow-800 hover:border-solid"
          onClick={() => scrollToSection("features")}
        >
          FEATURES
        </div>
        <div
          className="w-24 h-12 flex flex-row items-center justify-center mr-10 text-white font-bold text-[18px] hover:text-yellow-800 hover:cursor-pointer hover:border-b-2 hover:border-yellow-800 hover:border-solid"
          onClick={() => scrollToSection("contact")}
        >
          CONTACT
        </div>
        <Link to="/login" className="w-32 h-12 rounded-full mr-6 min-w-[100px]">
          <button className="w-full h-full bg-white text-black font-semibold rounded-full transition duration-200 hover:bg-yellow-800 hover:text-white">
            LOGIN
          </button>
        </Link>
        <FontAwesomeIcon
          icon={faBars}
          style={{ color: "#ffffff", fontSize: 28 }}
        />
      </div>
    </div>
  );
}

export default NavBar;
