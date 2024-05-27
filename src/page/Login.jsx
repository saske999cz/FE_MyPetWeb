import React, { useState } from "react";
import CustomInput from "../components/CustomInput";
import logoBlack from "../assets/images/LogoBlack.png";
import "../css/Login.scss";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  return (
    <div className="login_container w-[100vw] h-[100vh] bg-orange-300 flex flex-row items-center justify-end">
      <div className="paper_sheet w-[30%] h-[100%] min-w-[500px] min-h-[500px] bg-white flex flex-col items-center justify-center">
        <div className="logo_container w-full h-[9%] min-h-[80px] min-w-[100px] flex flex-row items-center justify-start border-b-[0.5px] border-solid border-gray-200">
          <img
            src={logoBlack}
            className="w-[30%] h-full object-contain"
            alt="logo"
          />
        </div>
        <div className="login_form_container w-full h-[90%] flex flex-row items-center justify-center">
          <div className="login_form w-[80%] h-full flex flex-col items-center justify-start">
            <h1 className="w-full text-[32px] font-semibold flex flex-row items-center justify-center px-4 mb-4 mt-[140px]">
              Login
            </h1>
            <div className="input_container w-full h-fit flex flex-col items-start justify-center px-4">
              <CustomInput
                label="Email"
                placeholder="Enter email"
                value={formData.email.value}
                onChange={(e) => setFormData({ ...formData, email: e })}
              />
              <CustomInput
                label="Password"
                placeholder="Enter password"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, password: e })}
                type="password"
              />
              <button className="login_btn w-full h-[45px] bg-amber-500 flex flex-row items-center justify-center rounded-[5px] mt-4 hover:brightness-[0.95]">
                <p className="text-white text-[16px] font-semibold">Login</p>
              </button>
              <p className="text-[14px] text-gray-500 mt-4 w-full flex flex-row items-center justify-center">
                Don't have an account? &nbsp;
                <span className="text-amber-500 cursor-pointer">Register</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
