import { Divider, Form, Input } from 'antd'
import React from 'react'
import avatar1 from '../../assets/images/avatar1.jpg'
import AuthUser from '../../utils/AuthUser'
import { toast } from 'react-toastify'

const Settings = () => {
  const { http } = AuthUser()
  const [form] = Form.useForm()

  const loginFormLayout = {
    labelCol: {
      span: 8
    },
    wrapperCol: {
      span: 24
    },
  };

  const onFinish = (values) => {
    const formData = new FormData()

    formData.append('name', values.name)
    formData.append('description', values.description)
    formData.append('name', values.name)
    formData.append('name', values.name)
    formData.append('name', values.name)
    formData.append('name', values.name)
  }

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo)
    toast.error('Please input all required fields', {
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
    <div className='flex flex-col p-8 bg-white'>
      <Divider orientation='left' orientationMargin={0}>
        <span className='text-gray-800 font-bold text-md'>Informations</span>
      </Divider>
      <div className='flex flex-row items-start w-full'>
        <div className='flex flex-col justify-center items-start w-[40%]'>
          <img src={avatar1} alt="avatar" className='w-24 h-24' />
        </div>
        <div className='flex flex-col flex-1'>
          <Form
            {...loginFormLayout}
            form={form}
            layout='vertical'
            name='shop_update_form'
            labelAlign='left'
            labelWrap='true'
            size='large'
            autoComplete="off"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <div className='flex flex-row justify-between items-center gap-12'>
              <Form.Item
                className='flex-1'
                label="Name Shop"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Name of shop is required!',
                  },
                ]}
                hasFeedback
              >
                <Input
                  placeholder='Your Pet Shop Name'
                />
              </Form.Item>
              <Form.Item
                className='flex-1'
                label="Establish Year"
                name="establish_year"
                rules={[

                ]}
                hasFeedback
              >
                <Input
                  placeholder='2024'
                />
              </Form.Item>
            </div>
            <div className='flex flex-row justify-between items-center gap-12'>
              <Form.Item
                className='flex-1'
                label="Phone Contact"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: 'Phone is required!',
                  },
                ]}
                hasFeedback
              >
                <Input
                  placeholder='yourpetshop@gmail.com'
                  autoComplete='email'
                />
              </Form.Item>
              <Form.Item
                className='flex-1'
                label="Address"
                name="address"
                rules={[
                  {
                    required: true,
                    message: 'Address is required!',
                  },
                ]}
                hasFeedback
              >
                <Input
                  placeholder='100 Nguyen Van Linh'
                />
              </Form.Item>
            </div>
            <div className='flex flex-row justify-between items-center gap-12'>
              <Form.Item
                className='flex-1'
                label="Website URL"
                name="website"
                rules={[
                  {
                    type: 'url',
                    message: 'Invalid url!',
                  },
                ]}
                hasFeedback
              >
                <Input
                  placeholder='Your Website URL'
                />
              </Form.Item>
              <Form.Item
                className='flex-1'
                label="Fanpage URL"
                name="fanpage"
                rules={[
                  {
                    type: 'url',
                    message: 'Invalid url!',
                  },
                ]}
                hasFeedback
              >
                <Input
                  placeholder='Your Fanpage Site'
                />
              </Form.Item>
            </div>
            
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
          </Form>
        </div>
      </div>
    </div>
  )
}

export default Settings