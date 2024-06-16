import React from "react";
import { Checkbox, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import logoBlack from "../../assets/images/LogoBlack.png";
import "./Login.scss";
import { toast } from "react-toastify";
import AuthUser from "../../utils/AuthUser";

const Login = () => {
  const loginFormLayout = {
    labelCol: {
      span: 16
    },
    wrapperCol: {
      span: 24
    },
  };
  
  const navigate = useNavigate()
  const { http, saveToken } = AuthUser()
  const [form] = Form.useForm();

  // const ROLE_ADMIN = "ROLE_ADMIN";
  // const ROLE_SHOP = "ROLE_SHOP";
  // const ROLE_MEDICAL_CENTER = "ROLE_MEDICAL_CENTER";
  // const ROLE_AID_CENTER = "ROLE_AID_CENTER";

  const handleClickLogo = () => {
    navigate('/')
  }

  const onFinish = (values) => {
    const formData = new FormData()
    formData.append('email',  values.email)
    formData.append('password', values.password);

    http.post('/auth/login', formData)
      .then((resolve) => {
        console.log(resolve)

        const accessToken = resolve.data.access_token
        const user = resolve.data.user
        saveToken(accessToken, user)

        navigate('/dashboard')
        
        toast.success(`Welcome back ${resolve.data.user.username}`, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        })
      })
      .catch((reject) => {
        console.log(reject);
        toast.error('Email or password is incorrect..', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        })
      })
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
    toast.error('Please input all fields', {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    })
  }

  return (
    <div className="login_container w-screen h-screen bg-orange-300 flex flex-row items-center justify-end">
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
          <div className="w-[80%] h-full flex flex-col items-center justify-start">
            <h1 className="w-full text-[32px] font-semibold flex flex-row items-center justify-center px-4 mb-4 mt-[140px]">
              Sign In
            </h1>
            <div className="input_container w-full h-fit flex flex-col items-start justify-center px-4">
              <Form
                {...loginFormLayout}
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
                    autoComplete='password'
                  />
                </Form.Item>
                <div className="flex flex-row justify-between items-center w-full">
                  <Form.Item
                    name="remember"
                    className="m-0"
                    valuePropName="checked"
                    wrapperCol={{
                      span: 12,
                    }}
                  >
                    <Checkbox className="w-40">Remember me</Checkbox>
                  </Form.Item>
                  <Link to="/forgot-password" style={{color: '#f59e0b'}}>
                    Forgot Password
                  </Link>
                </div>
                <button className="login_btn w-full h-[45px] bg-amber-500 flex flex-row items-center justify-center rounded-[5px] transition duration-300 mt-4 hover:brightness-[0.95]">
                  <p className="text-white text-[16px] font-semibold">Login</p>
                </button>
              </Form>
              <p className="text-sm text-gray-500 mt-4 w-full flex flex-row items-center justify-center">
                Don't have an account? &nbsp;
                <Link to="/register" className="text-amber-500 cursor-pointer" style={{color: '#f59e0b'}}>
                  Register Here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
