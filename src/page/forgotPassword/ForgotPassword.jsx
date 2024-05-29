import React, { useState } from "react";
import { Checkbox, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import logoBlack from "../../assets/images/LogoBlack.png";
import "./ForgotPassword.scss";
import { BiArrowBack } from "react-icons/bi";

const ForgotPassword = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm();
  const ROLE_ADMIN = "ROLE_ADMIN";
  const ROLE_SHOP = "ROLE_SHOP";
  const ROLE_MEDICAL_CENTER = "ROLE_MEDICAL_CENTER";
  const ROLE_AID_CENTER = "ROLE_AID_CENTER";
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const forgotPasswordFormLayout = {
    labelCol: {
      span: 16
    },
    wrapperCol: {
      span: 24
    },
  };

  const handleClickLogo = () => {
    navigate('/')
  }

  const onFinish = () => {

  }

  const onFinishFailed = () => {

  }

  return (
    <div className="forgot_password_container w-screen h-screen bg-orange-300 flex flex-row items-center justify-end">
      <div className="paper_sheet w-[30%] h-full min-w-[500px] min-h-[500px] bg-white flex flex-col items-center justify-center">
        <div className="w-full h-[9%] min-h-[80px] min-w-[100px] flex flex-row items-center justify-start border-b-[0.5px] border-solid border-gray-200">
          <img
            onClick={handleClickLogo}
            src={logoBlack}
            className="w-[30%] h-full object-contain hover:cursor-pointer"
            alt="logo"
          />
        </div>
        <div className="w-[80%] h-[90%] flex flex-row items-center justify-center">
          <div className="w-full h-full flex flex-col items-start justify-center">
            <Link to="/login" className="flex flex-row gap-2 items-center text-xl text-amber-500 transition duration-300 hover:no-underline hover:brightness-[0.95] -mt-32">
              <BiArrowBack />
              <h3>Back to login</h3>
            </Link>
            <h1 className="w-full text-[32px] font-semibold flex flex-row items-center justify-start my-4">
              Forgot Your Password?
            </h1>
            <span className="text-neutral-600 text-start text-sm">Don't worry, happens to all of us. Enter your email below to recover your password.</span>
            <div className="input_container w-full h-fit flex flex-col items-start justify-center mt-4">
              <Form
                {...forgotPasswordFormLayout}
                className='w-full'
                form={form}
                layout='vertical'
                name='login_form'
                labelAlign='left'
                labelWrap='true'
                size='large'
                autoComplete="off"
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                initialValues={{
                  remember: true,
                }}
              >
                <Form.Item
                  label="Email"
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: 'Email is required!',
                    },
                    {
                      type: 'email',
                      message: 'Invalid email address!',
                    },
                  ]}
                  hasFeedback
                >
                  <Input
                    placeholder='john.doe@gmail.com'
                    autoComplete='email'
                  />
                </Form.Item>
                <button className="login_btn w-full h-[45px] bg-amber-500 flex flex-row items-center justify-center rounded-[5px] transition duration-300 mt-4 hover:brightness-[0.95]">
                  <p className="text-white text-[16px] font-semibold">Submit</p>
                </button>
              </Form>
              <p className="text-[14px] text-gray-500 mt-4 w-full flex flex-row items-center justify-center">
                Don't have an account? &nbsp;
                <Link to="/register" className="text-amber-500 cursor-pointer" style={{ color: '#f59e0b' }}>
                  Register Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ForgotPassword