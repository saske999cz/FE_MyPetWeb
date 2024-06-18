import React, { useState, useEffect, forwardRef } from "react";
import long from "../assets/images/long.jpg";
import thai from "../assets/images/thai.jpg";
import "../css/AboutSection.scss";
import classNames from "classnames";

const AboutSection = forwardRef((props, ref) => {
  const [isVisibleLeft, setIsVisibleLeft] = useState(false);
  const [isVisibleRight, setIsVisibleRight] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      const top = window.scrollY;
      if (top > 1650) {
        setIsVisibleLeft(true);
      }
      if (top > 2200) {
        setIsVisibleRight(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className="w-full h-[110vh] min-h-[1080px] flex flex-row items-center justify-center bg-orange-200 absolute top-[2360px] z-3"
      ref={ref}
      id="about"
    >
      <div className="w-full h-full flex flex-col items-start justify-start px-10">
        <div
          className={classNames(
            "w-full h-[20vh] min-h-[200px] flex flex-row items-center justify-start mt-[30px] opacity-0",
            { "slide-in-from-left": isVisibleLeft }
          )}
        >
          <div className="w-fit h-full flex-col mt-[140px]">
            <h1 className="text-[36px] font-bold text-[#C01111]">About</h1>
            <div className="w-[80px] h-[2px] bg-[#C01111] mt-4"></div>
          </div>
        </div>
        <div
          className={classNames(
            "w-[80%] min-w-[600px] h-fit rounded-[20px] bg-[#C01111] flex flex-row items-start justify-start py-8 opacity-0",
            { "slide-in-from-left": isVisibleLeft }
          )}
        >
          <div className=" w-[15%] min-w-[200px] h-[300px]">
            <img
              src={long}
              alt="long"
              className="w-[140px] h-[140px] rounded-full ml-10 object-center"
            />
          </div>
          <div className="w-[80%] min-w-[300px] h-[300px] flex flex-col items-start justify-start">
            <p className="text-[26px] font-medium text-white">
              DEV - Co.Founder
            </p>
            <p className="text-[30px] font-bold text-white mt-2">
              Lê Hoàng Long
            </p>
            <p className="text-[16px] text-white mt-4 text-left italic leading-relaxed line-clamp-2 px-2">
              "MyPet is a pet care platform that aims to make life with pets
              easier, happier, and more fulfilling. "
            </p>
            <p className="text-[16px] text-white text-left italic leading-relaxed line-clamp-5 px-2">
              We provide a range of services and features designed to help pet
              owners take better care of their furry friends, connect with other
              pet lovers, and create a safe and loving environment for their
              pets. With MyPet, you can shop for the best pet products, adopt a
              new companion, schedule appointments with trusted vets, and stay
              informed with our insightful blog. Our platform is user-friendly
              and designed with your pet's well-being in mind, ensuring you have
              everything you need to give your pets the love and care they
              deserve. Join the MyPet community today and experience the joy of
              enhanced pet care, right at your fingertips.
            </p>
          </div>
        </div>
        <div className="w-full h-fit flex flex-row items-center justify-end ">
          <div
            className={classNames(
              "w-[80%] min-w-[600px] h-fit rounded-[20px] bg-[#e5e7eb] flex flex-row items-start justify-end py-8 mt-16 opacity-0",
              { "slide-in-from-right": isVisibleRight }
            )}
          >
            <div className="w-[80%] min-w-[300px] h-[300px] flex flex-col items-end justify-start">
              <p className="text-[26px] font-medium text-right ">
                Founder - DEV
              </p>
              <p className="text-[30px] font-bold text-right mt-2">
                Nguyễn Khắc Thái
              </p>
              <p className="text-[16px] mt-4 text-left italic leading-relaxed w-full line-clamp-2 px-2">
                "We care about our users' experience and are dedicated to making
                pet ownership as enjoyable and fulfilling as possible."
              </p>
              <p className="text-[16px] text-left italic leading-relaxed line-clamp-4 px-2">
                At MyPet, we leverage cutting-edge technology to enhance your
                pet care experience. Our platform integrates advanced features
                to ensure seamless navigation and user-friendly interactions.
                With secure, efficient systems for booking appointments and
                purchasing products, you can trust that your data is safe with
                us. Our adoption services use smart algorithms to match you with
                the perfect pet, while our blog utilizes AI to bring you the
                most relevant and helpful content. Join the MyPet community
                today and experience the future of pet care technology.
              </p>
            </div>
            <div className="w-[15%] min-w-[200px] h-[300px] flex flex-row items-start justify-end">
              <img
                src={thai}
                alt="thai"
                className="w-[140px] h-[140px] rounded-full mr-10"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default AboutSection;
