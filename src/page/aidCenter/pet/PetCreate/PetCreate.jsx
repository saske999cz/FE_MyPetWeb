import { Button, Form, Input, InputNumber, Upload } from 'antd'
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa';
import { UploadOutlined } from '@ant-design/icons';
import Select from 'react-select'
import AuthUser from '../../../../utils/AuthUser';
import { useAuth } from '../../../../utils/AuthContext';
import { toast } from 'react-toastify';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import { storage, firebaseConfig } from '../../../../utils/firebase';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const PetCreate = () => {
  const { http } = AuthUser()
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  const createPetFormLayout = {
    labelCol: {
      span: 16
    },
    wrapperCol: {
      span: 24
    },
  };

  const [form] = Form.useForm();
  const [listBreeds, setListBreeds] = useState([])
  const [fileList, setFileList] = useState([]);

  // Chuyển đổi dữ liệu để phù hợp với định dạng của react-select
  const options = listBreeds.map(group => ({
    label: group.type,
    options: group.breed.map(breed => ({
      value: breed.id,
      label: breed.name,
    })),
  }));

  const uploadImage = async (file) => {
    try {
      const filePath = `pets/${file.name}`;
      const storageRef = ref(storage, filePath);

      await uploadBytes(storageRef, file);

      const gsUrl = `gs://${firebaseConfig.storageBucket}/${filePath}`;
      return gsUrl;
    } catch (error) {
      console.error("Error uploading image: ", error);
      throw error;
    }
  };

  const onFinish = async (values) => {
    try {
      Swal.fire({
        title: 'Processing...',
        text: 'Please wait while we upload images and create pet.',
        allowOutsideClick: false,
        showConfirmButton: false,
        icon: 'info',
        willOpen: () => {
          Swal.showLoading();
        }
      });

      let uploadedUrl = '';
      if (fileList.length > 0) {
        uploadedUrl = await uploadImage(fileList[0].originFileObj);
      }

      console.log(values.type)
      console.log(values.gender)

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('type', values.type.value);
      formData.append('gender', values.gender.value);
      formData.append('age', values.age);
      formData.append('image', uploadedUrl);
      formData.append('description', values.description);
      formData.append('quantity', values.quantity);
      formData.append('is_purebred', 0);
      formData.append('status', 0);
      formData.append('breed_id', values.breed.value);

      await http.post('/aid-center/pets', formData)

      Swal.fire({
        title: 'Done',
        text: 'Pet created successfully!',
        icon: 'success',
      }).then(() => {
        navigate(0)
      })
    } catch (error) {
      console.log(error)
      Swal.fire({
        title: 'Error',
        text: 'Oops.. Please try again',
        icon: 'error',
      });
    }
  }

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo)
    toast.error('Please fill in all required fields', {
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

  const normFile = (e) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleFileListChange = ({ fileList }) => {
    // Only keep the latest file
    setFileList(fileList.slice(-1));
  };

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await http.get('/aid-center/breeds?target=all')
        console.log(response)
        setListBreeds(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchBreeds()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  return (
    <div className='flex flex-col w-full h-full items-start justify-start gap-4'>
      <div className='flex flex-row w-full items-start gap-6'>
        <div className='flex flex-col w-[58%] h-full items-start justify-start bg-white p-6 rounded-md'>
          <h1 className='text text-xl w-full text-start font-semibold border-b-2 p-2 border-neutral-400'>Basic Information</h1>
          <Form
            {...createPetFormLayout}
            className="w-full mt-2"
            form={form}
            layout='vertical'
            name="createPetForm"
            labelAlign='left'
            labelWrap='true'
            size='large'
            autoComplete='off'
          >
            <div className='flex flex-row items-center gap-4'>
              <Form.Item
                className='w-[50%]'
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Pet name is required!',
                  },
                ]}
                hasFeedback
              >
                <Input
                  placeholder='Type here...'
                  autoComplete='name'
                />
              </Form.Item>
              <Form.Item
                className='w-[50%]'
                label="Age"
                name="age"
                rules={[
                  {
                    required: true,
                    message: 'Age is required!',
                  },
                ]}
                hasFeedback
              >
                <InputNumber
                  className='w-full'
                  placeholder='Set age here...'
                  autoComplete='stock'
                />
              </Form.Item>
            </div>
            <div className='flex flex-row items-center gap-4'>
              <Form.Item
                className='w-[32%]'
                label="Type"
                name="type"
                rules={[
                  {
                    required: true,
                    message: 'Type is required!',
                  },
                ]}
                hasFeedback
              >
                <Select options={[
                  { value: 'Dog', label: <span>Dog</span> },
                  { value: 'Cat', label: <span>Cat</span> },
                ]}
              />
              </Form.Item>
              <Form.Item
                className='w-[32%]'
                label="Gender"
                name="gender"
                rules={[
                  {
                    required: true,
                    message: 'Gender is required!',
                  },
                ]}
                hasFeedback
              >
                <Select options={[
                  { value: 'male', label: <span>Male</span> },
                  { value: 'female', label: <span>Female</span> },
                ]}
              />
              </Form.Item>
              <Form.Item
                className='w-[32%]'
                label="Breed"
                name="breed"
                rules={[
                  {
                    required: true,
                    message: 'Breed is required!',
                  },
                ]}
                hasFeedback
              >
                <Select options={options} />
              </Form.Item>
            </div>
            <Form.Item
              className='flex-1'
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: 'Description is required!',
                },
              ]}
              hasFeedback
            >
              <TextArea
                placeholder='Type here...'
                autoComplete='description'
                rows={4}
              />
            </Form.Item>
          </Form>
        </div>
        <div className='flex flex-col w-[42%] h-full items-start justify-start bg-white p-6 rounded-md'>
          <h1 className='text text-xl w-full text-start font-semibold border-b-2 p-2 border-neutral-400'>Gallery</h1>
          <Form
            {...createPetFormLayout}
            className="w-full mt-2"
            form={form}
            layout='vertical'
            name="createPetForm"
            labelAlign='left'
            labelWrap='true'
            size='large'
            autoComplete='off'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              label="Upload"
              name="upload"
              valuePropName="fileList"
              getValueFromEvent={normFile}
            >
              <Upload
                name="logo"
                listType="picture-card"
                beforeUpload={() => false}
                onChange={handleFileListChange}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Form
        className="w-full mt-2"
        form={form}
        name="createPetForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <button className='flex flex-row items-center justify-center w-full gap-2 bg-blue-600 rounded-md px-4 py-3 hover:opacity-85 transition duration-300'>
          <FaCloudUploadAlt size={24} style={{ color: 'white' }} />
          <span className='text-white text-xl font-semibold'>Create Pet</span>
        </button>
      </Form>
    </div>
  )
}

export default PetCreate