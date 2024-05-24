import React from "react";
import { Link } from "react-router-dom";
import "../css/NavBar.scss";
import logo from "../assets/images/LogoWhite.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

function NavBar({ handleAboutClick, handleFeaturesClick, handleContactClick }) {
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
      <div className="w-1/2 min-w-[500px] h-full flex flex-row items-center justify-end mr-28">
        <div
          className="w-24 h-12 flex flex-row items-center justify-center mr-10 hover:text-yellow-800 text-white font-bold text-[18px] hover:cursor-pointer hover:border-b-2 hover:border-yellow-800 hover:border-solid"
          onClick={handleAboutClick}
        >
          ABOUT
        </div>
        <div
          className="w-24 h-12 flex flex-row items-center justify-center mr-10 text-white font-bold text-[18px] hover:text-yellow-800 hover:cursor-pointer hover:border-b-2 hover:border-yellow-800 hover:border-solid"
          onClick={handleFeaturesClick}
        >
          FEATURES
        </div>
        <div
          className="w-24 h-12 flex flex-row items-center justify-center mr-10 text-white font-bold text-[18px] hover:text-yellow-800 hover:cursor-pointer hover:border-b-2 hover:border-yellow-800 hover:border-solid"
          onClick={handleContactClick}
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
