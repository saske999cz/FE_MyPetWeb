import React, { useState, useEffect, forwardRef } from "react";
import store from "../assets/images/store.png";
import shelter from "../assets/images/shelter.png";
import vet from "../assets/images/vet.png";
import app from "../assets/images/app.png";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import classNames from "classnames";
import "../css/RegisterSection.scss";

const RegisterSection = forwardRef((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const top = window.scrollY;
      if (top > 1150) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return (
    <div
      className="w-full h-[70vh] min-h-[900px] flex flex-row items-center justify-center bg-[#e5e7eb] absolute top-[1670px] z-3"
      ref={ref}
      id="register"
    >
      <div
        className={classNames(
          "w-full h-full flex flex-col items-center justify-start opacity-0",
          { "slide-in-from-right": isVisible }
        )}
      >
        <div className="w-full h-[20vh] min-h-[180px] flex flex-row items-center justify-end px-[50px] mt-[30px]">
          <div className="w-fit h-full flex-col mt-[140px]">
            <h1 className="text-[36px] font-bold">Join us</h1>
            <div className="w-[80px] h-[2px] bg-black mt-4 ml-[40px]"></div>
          </div>
        </div>
        <div className="w-full h-[40vh] min-h-[400px] flex flex-row items-center justify-around">
          <div
            className={classNames(
              "w-[20%] min-w-[300px] h-[350px] bg-[#e5e7eb] rounded-[20px] flex flex-col items-center justify-start px-12 border-solid border-[2px] border-black opacity-0",
              { "show-up": isVisible }
            )}
          >
            <img
              src={store}
              alt="store"
              className="w-[70px] h-[70px] mt-[20px]"
            />
            <h1 className="text-[23px] font-semibold mt-4">Become a partner</h1>
            <p className="text-[16px] mt-4 text-left">
              Join our community today and let your products find their perfect
              homes!
            </p>
            <Link to="/register-shop" className="mt-4">
              <div className="flex flex-row items-center justify-start w-fit">
                <p className="text-[18px] font-semibold text-amber-500 mr-[8px]">
                  Sign up your shop
                </p>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  style={{ color: "#f59e0b", fontSize: "19px" }}
                />
              </div>
            </Link>
          </div>
          <div
            className={classNames(
              "w-[20%] min-w-[300px] h-[350px] bg-[#e5e7eb] rounded-[20px] flex flex-col items-center justify-start px-12 border-solid border-[2px] border-black opacity-0",
              { "show-up": isVisible }
            )}
          >
            <img
              src={shelter}
              alt="shelter"
              className="w-[70px] h-[70px] mt-[20px]"
            />
            <h1 className="text-[20px] font-semibold mt-4">Animal Shelter</h1>
            <p className="text-[16px] mt-4 text-left">
              Help more animals find their forever homes by joining us today and
              connect with a community of loving pet adopters!
            </p>
            <Link to="/register-shelter" className="mt-4">
              <div className="flex flex-row items-center justify-start w-fit">
                <p className="text-[18px] font-semibold text-amber-500 mr-[8px]">
                  Sign up your shelter
                </p>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  style={{ color: "#f59e0b", fontSize: "19px" }}
                />
              </div>
            </Link>
          </div>
          <div
            className={classNames(
              "w-[20%] min-w-[300px] h-[350px] bg-[#e5e7eb] rounded-[20px] flex flex-col items-center justify-start px-12 border-solid border-[2px] border-black opacity-0",
              { "show-up": isVisible }
            )}
          >
            <img src={vet} alt="vet" className="w-[70px] h-[70px] mt-[20px]" />
            <h1 className="text-[20px] font-semibold mt-4">Medical Center</h1>
            <p className="text-[16px] mt-4 text-left">
              Provide top-notch care to more pets by joining our network today
              and reach pet owners in need of trusted veterinary services!
            </p>
            <Link to="/register-medical-center" className="mt-4">
              <div className="flex flex-row items-center justify-start w-fit">
                <p className="text-[18px] font-semibold text-amber-500 mr-[8px]">
                  Sign up your center
                </p>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  style={{ color: "#f59e0b", fontSize: "19px" }}
                />
              </div>
            </Link>
          </div>
          <div
            className={classNames(
              "w-[20%] min-w-[300px] h-[350px] bg-[#e5e7eb] rounded-[20px] flex flex-col items-center justify-start px-12 border-solid border-[2px] border-black opacity-0",
              { "show-up": isVisible }
            )}
          >
            <img src={app} alt="app" className="w-[70px] h-[70px] mt-[20px]" />
            <h1 className="text-[20px] font-semibold mt-4">Get the app</h1>
            <p className="text-[16px] mt-4 text-left">
              Download our app and connect with pet shops, shelters, and
              veterinary services. Your pet's needs, just a tap away!
            </p>
            <Link to="/register" className="mt-4">
              <div className="flex flex-row items-center justify-start w-fit">
                <p className="text-[18px] font-semibold text-amber-500 mr-[8px]">
                  Download the app
                </p>
                <FontAwesomeIcon
                  icon={faArrowRight}
                  style={{ color: "#f59e0b", fontSize: "19px" }}
                />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
});

export default RegisterSection;
