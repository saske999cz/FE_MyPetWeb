import React from "react";
import { Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import logoBlack from "../../assets/images/LogoBlack.png";
import "./Register.scss";

const Register = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm();
  // const ROLE_ADMIN = "ROLE_ADMIN";
  // const ROLE_SHOP = "ROLE_SHOP";
  // const ROLE_MEDICAL_CENTER = "ROLE_MEDICAL_CENTER";
  // const ROLE_AID_CENTER = "ROLE_AID_CENTER";
  // const [formData, setFormData] = useState({
  //   email: "",
  //   password: "",
  // });

  const registerFormLayout = {
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
    <div className="register_container w-screen h-screen bg-orange-300 flex flex-row items-center justify-end">
      <div className="paper_sheet w-[30%] h-[100%] min-w-[500px] min-h-[500px] bg-white flex flex-col items-center justify-center">
        <div className="w-full h-[9%] min-h-[80px] min-w-[100px] flex flex-row items-center justify-start border-b-[0.5px] border-solid border-gray-200">
          <img
            onClick={handleClickLogo}
            src={logoBlack}
            className="w-[30%] h-full object-contain hover:cursor-pointer"
            alt="logo"
          />
        </div>
        <div className="w-full h-[90%] flex flex-row items-center justify-center">
          <div className="w-[80%] h-full flex flex-col items-start justify-center">
            <h1 className="w-full text-[32px] font-semibold flex flex-row items-center justify-center px-4 mb-4">
              Sign Up
            </h1>
            <div className="input_container w-full h-fit flex flex-col items-start justify-center px-4">
              <Form
                {...registerFormLayout}
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
                  label="Username"
                  name="username"
                  
                  rules={[
                    {
                      required: true,
                      message: 'Username is required!',
                    },
                  ]}
                  hasFeedback
                >
                  <Input
                    placeholder='John Doe'
                    autoComplete='username'
                  />
                </Form.Item>
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
                <Form.Item
                  label="Password"
                  name="password"
                  className=""
                  rules={[
                    {
                      required: true,
                      message: 'Password is required!',
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    placeholder='******'
                    autoComplete='new-password'
                  />
                </Form.Item>
                <Form.Item
                  name="confirmPassword"
                  label="Confirm Password"
                  dependencies={['password']}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: 'Please confirm your password!',
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue('password') === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(new Error('The two passwords that you entered do not match!'));
                      },
                    }),
                  ]}
                >
                  <Input.Password 
                    placeholder='******'
                    autoComplete='new-password'
                  />
                </Form.Item>
                <button className="login_btn w-full h-[45px] bg-amber-500 flex flex-row items-center justify-center rounded-[5px] transition duration-300 mt-4 hover:brightness-[0.95]">
                  <p className="text-white text-[16px] font-semibold">Sign Up</p>
                </button>
              </Form>
              <p className="text-[14px] text-gray-500 mt-4 w-full flex flex-row items-center justify-center">
                Already have an account yet? &nbsp;
                <Link to="/login" className="text-amber-500 cursor-pointer" style={{ color: '#f59e0b' }}>
                  Login Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Register