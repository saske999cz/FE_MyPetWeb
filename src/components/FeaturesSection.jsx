import React, { useState, useEffect, forwardRef } from "react";
import "../css/FeaturesSection.scss";
import classNames from "classnames";

const FeaturesSection = forwardRef((props, ref) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const top = window.scrollY;
      if (top > 450) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="w-full h-[70vh] min-h-[900px] flex flex-row items-center justify-center bg-[#0b0b0b] absolute top-[980px] z-3"
      ref={ref}
      id="features"
    >
      <div
        className={classNames(
          "w-full h-full flex flex-col items-center justify-start opacity-0",
          { "slide-in-from-left": isVisible }
        )}
      >
        <div className="w-full h-[20vh] min-h-[200px] flex flex-row items-center justify-start px-[50px] mt-[30px]">
          <div className="w-fit h-full flex-col mt-[140px]">
            <h1 className="text-[36px] text-white font-bold">Features</h1>
            <div className="w-[80px] h-[2px] bg-white mt-4"></div>
          </div>
        </div>
        <div
          className={classNames(
            "w-[95%] h-[35vh] min-h-[350px] flex flex-col items-center justify-around rounded-[20px] border-solid border-[2px] border-gray-300 opacity-0",
            { "show-up": isVisible }
          )}
        >
          <div className="w-full h-fit flex flex-row items-start justify-start px-4 rounded-[20px]">
            <div className="w-[15px] h-[10px] rounded-full bg-white m-2"></div>
            <p className="text-[16px] text-white text-left ml-1 line-clamp-3">
              <strong>Shopping</strong> - Easily browse and purchase a wide
              range of pet products from trusted shops. From food and toys to
              grooming supplies and accessories, find everything your pet needs
              in one convenient place. Enjoy a seamless shopping experience with
              secure payment options and fast delivery.
            </p>
          </div>
          <div className="w-full h-fit flex flex-row items-start justify-start px-4 rounded-[20px]">
            <div className="w-[15px] h-[10px] rounded-full bg-white m-2"></div>
            <p className="text-[16px] text-white text-left ml-1 line-clamp-3">
              <strong>Pet Adoption</strong> - Looking to add a new member to
              your family? Our pet adoption feature connects you with local
              shelters, allowing you to browse available pets and find your
              perfect companion. Adopting a pet has never been easier -
              discover, connect, and bring home your new best friend with just a
              few taps.
            </p>
          </div>
          <div className="w-full h-fit flex flex-row items-start justify-start px-4 rounded-[20px]">
            <div className="w-[15px] h-[10px] rounded-full bg-white m-2"></div>
            <p className="text-[16px] text-white text-left ml-1 line-clamp-3">
              <strong>Appointment Scheduling</strong> - Manage your pet's health
              effortlessly with our appointment scheduling feature. Book and
              keep track of vet visits, grooming sessions, and other important
              appointments directly through the app. Receive timely reminders
              and ensure your pet gets the care they need, when they need it.
            </p>
          </div>
          <div className="w-full h-fit flex flex-row items-start justify-start px-4 rounded-[20px]">
            <div className="w-[15px] h-[10px] rounded-full bg-white m-2"></div>
            <p className="text-[16px] text-white text-left ml-1 line-clamp-3">
              <strong>Blog</strong> - Stay informed and inspired with our in-app
              blog. Read articles written by pet care experts, covering a wide
              range of topics from training tips and health advice to
              heartwarming pet stories. Share your own experiences and connect
              with a community of passionate pet owners.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
});

export default FeaturesSection;
