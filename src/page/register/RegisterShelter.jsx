import React, { useRef, useState, useEffect, useMemo } from "react";
import { Form, Input, Steps, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import logoBlack from "../../assets/images/LogoBlack.png";
import "./Register.scss";
import PlaceAutocompleteInput from "../../components/PlaceAutoCompleteInput";

const RegisterShelter = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const ROLE_ADMIN = "ROLE_ADMIN";
  const ROLE_SHOP = "ROLE_SHOP";
  const ROLE_MEDICAL_CENTER = "ROLE_MEDICAL_CENTER";
  const ROLE_AID_CENTER = "ROLE_AID_CENTER";
  const [shopData, setShopData] = useState({
    email: "",
    password: "",
    confirm_password: "",
    phone: null,
    website: "",
    fanpage: "",
    name: "",
    address: "",
    work_time: "",
    established_year: "",
  });
  const [currentStep, setCurrentStep] = useState(0);

  const registerFormLayout = {
    labelCol: {
      span: 16,
    },
    wrapperCol: {
      span: 24,
    },
  };

  const handleClickLogo = () => {
    navigate("/");
  };

  const onFinish = (value) => {
    if (currentStep === 0) {
      setShopData({
        ...shopData,
        email: value.email,
        password: value.password,
        confirm_password: value.confirmPassword,
      });
      setCurrentStep(1);
    } else if (currentStep === 1) {
      setShopData({
        ...shopData,
        phone: value.phone,
        website: value.website,
        fanpage: value.fanpage,
      });
      setCurrentStep(2);
    } else {
      setShopData({
        ...shopData,
        name: value.name,
        work_time: value.work_time,
      });
      console.log(shopData.address);
    }
  };

  const validateWorkingHours = (_, value) => {
    if (!value || !value.opening || !value.closing) {
      return Promise.reject(new Error("All fields are required"));
    }
    if (
      !value.opening.time ||
      !value.opening.ampm ||
      !value.closing.time ||
      !value.closing.ampm
    ) {
      return Promise.reject(new Error("All fields are required"));
    }
    return Promise.resolve();
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const onFinishFailed = () => {};

  return (
    <div className="register_container w-screen h-screen bg-orange-300 flex flex-row items-center justify-center">
      <div className="paper_sheet w-[50%] h-[90%] min-w-[500px] min-h-[500px] bg-white flex flex-col items-center justify-start rounded-[10px]">
        <div className="w-full h-[9%] min-h-[80px] min-w-[100px] flex flex-row items-center justify-start border-b-[0.5px] border-solid border-gray-200">
          <img
            onClick={handleClickLogo}
            src={logoBlack}
            className="w-[30%] h-full object-contain hover:cursor-pointer"
            alt="logo"
          />
        </div>
        <div className="w-full h-[90%] flex flex-row items-center justify-center">
          <div className="w-[80%] h-full flex flex-col items-start justify-start">
            <h1 className="w-full text-[32px] font-semibold flex flex-row items-center justify-center px-4 mb-4 mt-[30px]">
              Sign Up For Shelter
            </h1>
            <Steps
              current={currentStep}
              items={[
                {
                  title: "Account Set Up",
                },
                {
                  title: "Contact Info",
                },
                {
                  title: "Shelter Info",
                },
              ]}
              className="mt-[30px] mb-[40px]"
            />
            <div className="input_container w-full h-fit flex flex-col items-start justify-center px-4">
              {currentStep === 0 && (
                <Form
                  {...registerFormLayout}
                  className="w-full"
                  form={form}
                  layout="vertical"
                  name="login_form"
                  labelAlign="left"
                  labelWrap="true"
                  size="large"
                  autoComplete="off"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  initialValues={{
                    remember: true,
                  }}
                >
                  <Form.Item
                    label="Username"
                    name="username"
                    rules={[
                      {
                        required: true,
                        message: "Username is required!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input placeholder="John Doe" autoComplete="username" />
                  </Form.Item>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      {
                        required: true,
                        message: "Email is required!",
                      },
                      {
                        type: "email",
                        message: "Invalid email address!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      placeholder="john.doe@gmail.com"
                      autoComplete="email"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Password"
                    name="password"
                    className=""
                    rules={[
                      {
                        required: true,
                        message: "Password is required!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Password
                      placeholder="******"
                      autoComplete="new-password"
                    />
                  </Form.Item>
                  <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    dependencies={["password"]}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: "Please confirm your password!",
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue("password") === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(
                            new Error(
                              "The two passwords that you entered do not match!"
                            )
                          );
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      placeholder="******"
                      autoComplete="new-password"
                    />
                  </Form.Item>
                  <div className="w-full h-fit flex flex-row items-center justify-center">
                    <button className="login_btn w-[150px] h-[45px] bg-amber-500 flex flex-row items-center justify-center rounded-[5px] transition duration-300 mt-4 hover:brightness-[0.95]">
                      <p className="text-white text-[16px] font-semibold">
                        Next
                      </p>
                    </button>
                  </div>
                </Form>
              )}
              {currentStep === 1 && (
                <Form
                  {...registerFormLayout}
                  className="w-full"
                  form={form}
                  layout="vertical"
                  name="login_form"
                  labelAlign="left"
                  labelWrap="true"
                  size="large"
                  autoComplete="off"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  initialValues={{
                    remember: true,
                  }}
                >
                  <Form.Item
                    label="Phone Number"
                    name="phone"
                    rules={[
                      {
                        required: true,
                        message: "Phone number is required!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input placeholder="0123456789" autoComplete="phone" />
                  </Form.Item>
                  <Form.Item
                    label="Website"
                    name="website"
                    rules={[
                      {
                        required: false,
                        message: "Email is required!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      placeholder="www.google.com"
                      autoComplete="website"
                    />
                  </Form.Item>
                  <Form.Item
                    label="Fanpage"
                    name="fanpage"
                    className=""
                    rules={[
                      {
                        required: false,
                        message: "Password is required!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input
                      placeholder="www.facebook.com"
                      autoComplete="fanpage"
                    />
                  </Form.Item>
                  <div className="w-full h-fit flex flex-row items-center justify-center">
                    <button
                      className="login_btn w-[160px] h-[45px] bg-white flex flex-row items-center justify-center border-solid border-2 border-amber-500 rounded-[5px] mr-[20px] transition duration-300 mt-4 hover:brightness-[0.95]"
                      onClick={(e) => {
                        e.preventDefault();
                        handleBack();
                      }}
                    >
                      <p className="text-amber-500 text-[16px] font-semibold">
                        Back
                      </p>
                    </button>
                    <button className="login_btn w-[160px] h-[45px] bg-amber-500 flex flex-row items-center justify-center rounded-[5px] ml-[20px] transition duration-300 mt-4 hover:brightness-[0.95]">
                      <p className="text-white text-[16px] font-semibold">
                        Next
                      </p>
                    </button>
                  </div>
                </Form>
              )}
              {currentStep === 2 && (
                <Form
                  {...registerFormLayout}
                  className="w-full"
                  form={form}
                  layout="vertical"
                  name="login_form"
                  labelAlign="left"
                  labelWrap="true"
                  size="large"
                  autoComplete="off"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                  initialValues={{
                    remember: true,
                  }}
                >
                  <Form.Item
                    label="Shop Name"
                    name="name"
                    rules={[
                      {
                        required: true,
                        message: "Shop name is required!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input placeholder="Amazon" autoComplete="name" />
                  </Form.Item>
                  <PlaceAutocompleteInput setData={setShopData} form={form} />
                  <Form.Item
                    label="Working Hours"
                    name="work_time"
                    rules={[
                      {
                        required: true,
                        message: "Working Hours are required!",
                        validator: validateWorkingHours,
                      },
                    ]}
                    hasFeedback
                  >
                    <Input.Group compact>
                      <Form.Item
                        name={["work_time", "opening", "time"]}
                        noStyle
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
                        ]}
                        dependencies={[
                          "work_time",
                          "opening",
                          "ampm",
                          "closing",
                          "time",
                          "closing",
                          "ampm",
                        ]}
                        hasFeedback={false}
                      >
                        <Input
                          style={{ width: "30%" }}
                          placeholder="Opening Time"
                          type="number"
                          max={12}
                          min={1}
                        />
                      </Form.Item>
                      <Form.Item
                        name={["work_time", "opening", "ampm"]}
                        noStyle
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
                        ]}
                        dependencies={[
                          "work_time",
                          "opening",
                          "time",
                          "closing",
                          "time",
                          "closing",
                          "ampm",
                        ]}
                        hasFeedback={false}
                      >
                        <Select style={{ width: "16%" }} placeholder="AM">
                          <Select.Option value="AM">AM</Select.Option>
                          <Select.Option value="PM">PM</Select.Option>
                        </Select>
                      </Form.Item>
                      <span
                        style={{
                          width: "5%",
                          marginLeft: 20,
                          marginTop: 9,
                        }}
                      >
                        to
                      </span>
                      <Form.Item
                        name={["work_time", "closing", "time"]}
                        noStyle
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
                        ]}
                        dependencies={[
                          "work_time",
                          "opening",
                          "time",
                          "opening",
                          "ampm",
                          "closing",
                          "ampm",
                        ]}
                        hasFeedback={false}
                      >
                        <Input
                          style={{ width: "30%" }}
                          placeholder="Closing Time"
                          type="number"
                          max={12}
                          min={1}
                        />
                      </Form.Item>
                      <Form.Item
                        name={["work_time", "closing", "ampm"]}
                        noStyle
                        rules={[
                          {
                            required: true,
                            message: "",
                          },
                        ]}
                        dependencies={[
                          "work_time",
                          "opening",
                          "time",
                          "opening",
                          "ampm",
                          "closing",
                          "time",
                        ]}
                        hasFeedback={false}
                      >
                        <Select style={{ width: "16%" }} placeholder="AM">
                          <Select.Option value="AM">AM</Select.Option>
                          <Select.Option value="PM">PM</Select.Option>
                        </Select>
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                  <Form.Item
                    label="Established Year"
                    name="established_year"
                    rules={[
                      {
                        required: true,
                        message: "Established year is required!",
                      },
                    ]}
                    hasFeedback
                  >
                    <Input placeholder="2021" autoComplete="established_year" />
                  </Form.Item>

                  <div className="w-full h-fit flex flex-row items-center justify-center">
                    <button
                      className="login_btn w-[160px] h-[45px] bg-white flex flex-row items-center justify-center mr-[20px] border-solid border-2 border-amber-500 rounded-[5px] transition duration-300 mt-4 hover:brightness-[0.95]"
                      onClick={(e) => {
                        e.preventDefault();
                        handleBack();
                      }}
                    >
                      <p className="text-amber-500 text-[16px] font-semibold">
                        Back
                      </p>
                    </button>
                    <button className="login_btn w-[160px] h-[45px] bg-amber-500 flex flex-row items-center justify-center ml-[20px] rounded-[5px] transition duration-300 mt-4 hover:brightness-[0.95]">
                      <p className="text-white text-[16px] font-semibold">
                        Sign Up
                      </p>
                    </button>
                  </div>
                </Form>
              )}
              <p className="text-[14px] text-gray-500 mt-4 w-full flex flex-row items-center justify-center">
                Already have an account yet? &nbsp;
                <Link
                  to="/login"
                  className="text-amber-500 cursor-pointer"
                  style={{ color: "#f59e0b" }}
                >
                  Login Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterShelter;
