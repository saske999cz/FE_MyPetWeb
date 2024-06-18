import React, { forwardRef } from "react";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa6";
import logo from "../assets/images/LogoWhite.png";

const ContactSection = forwardRef((props, ref) => {
  return (
    <div
      className="w-full h-[40vh] min-h-[400px] flex flex-row items-center justify-start bg-[#212121] absolute top-[3440px]"
      ref={ref}
      id="contact"
    >
      <div className="w-[400px] h-full flex flex-col items-start justify-start px-10">
        <div className="w-full h-[20vh] min-h-[200px] flex flex-row items-center justify-start mt-[10px]">
          <div className="w-fit h-full flex flex-col mt-[140px]">
            <h1 className="text-[36px] font-bold text-white">Contact</h1>
            <div className="w-[140px] h-[2px] bg-white mt-4"></div>
          </div>
        </div>
        <div className="w-full h-fit flex flex-col items-start justify-start">
          <p className="text-white text-[14px]">Phone number: 0123456789</p>
          <p className="text-white text-[14px] mt-2">
            Email: contact@mypet.com
          </p>
          <p className="text-white text-[14px] mt-2">
            Address: 123 Pet Street, Pet City, PC 12345
          </p>
        </div>
      </div>
      <div className="w-[300px] h-fit flex flex-col items-start justify-center mt-[90px] ml-[100px]">
        <div className="w-full flex flex-col space-y-2 items-start">
          <div className="w-full h-fit flex flex-row items-center justify-start">
            <FaFacebook
              style={{ color: "white", fontSize: 16, marginRight: 5 }}
            />
            <a
              href="https://www.facebook.com"
              className="text-white text-[14px]"
            >
              Facebook: facebook.com/mypet
            </a>
          </div>
          <div className="w-full h-fit flex flex-row items-center justify-start">
            <FaTwitter
              style={{ color: "white", fontSize: 16, marginRight: 5 }}
            />
            <a
              href="https://www.twitter.com"
              className="text-white text-[14px]"
            >
              Twitter: twitter.com/mypet
            </a>
          </div>
          <div className="w-full h-fit flex flex-row items-center justify-start">
            <FaLinkedin
              style={{ color: "white", fontSize: 16, marginRight: 5 }}
            />
            <a
              href="https://www.linkedin.com"
              className="text-white text-[14px]"
            >
              LinkedIn: linkedin.com/company/mypet
            </a>
          </div>
        </div>
      </div>
      <div className="w-[350px] h-fit flex flex-col items-start justify-center mt-[90px] ml-[100px]">
        <div className="w-full flex flex-col space-y-2 items-start">
          <p className="text-white text-[14px]">Founder: Nguyễn Khắc Thái</p>
          <p className="text-white text-[14px]">Co-Founder: Lê Hoàng Long</p>
          <p className="text-white text-[14px]">
            Da Nang University of Technology and Science
          </p>
        </div>
      </div>
      <img
        src={logo}
        className="w-[180px] h-[70px] mt-[70px] ml-[80px]"
        alt="logo"
      />
    </div>
  );
});

export default ContactSection;
