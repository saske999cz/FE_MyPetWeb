import { Button, Form, Input, InputNumber, Upload } from 'antd'
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa';
import { UploadOutlined } from '@ant-design/icons';
import Select from 'react-select'
import AuthUser from '../../../../utils/AuthUser';
import { useAuth } from '../../../../utils/AuthContext';
import { toast } from 'react-toastify';
import { uploadBytes, getDownloadURL, ref, deleteObject } from 'firebase/storage';
import { storage, firebaseConfig } from '../../../../utils/firebase';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

const PetUpdate = () => {
  const { id } = useParams()
  const { http } = AuthUser()
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  const updatePetFormLayout = {
    labelCol: {
      span: 16
    },
    wrapperCol: {
      span: 24
    },
  };

  const [form] = Form.useForm();
  const [pet, setPet] = useState({})
  const [listBreeds, setListBreeds] = useState([])
  const [options, setOptions] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [currentImageUrls, setCurrentImageUrls] = useState([]);

  // Function to upload image
  const uploadImage = async (file) => {
    try {
      const filePath = `pets/${file.name}`;
      const storageRef = ref(storage, filePath);
      await uploadBytes(storageRef, file);
      const gsUrl = `gs://${firebaseConfig.storageBucket}/${filePath}`;
      const httpsUrl = await getDownloadURL(storageRef);
      return gsUrl;
    } catch (error) {
      console.error("Error uploading image: ", error);
      throw error;
    }
  };

  // Function to delete image
  const deleteImage = async (url) => {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  };

  const onFinish = async (values) => {
    try {
      Swal.fire({
        title: 'Processing...',
        text: 'Please wait while we update pet.',
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

      // Handle new image
      const newImages = fileList.filter(file => !currentImageUrls.includes(file.url));
      await Promise.all(newImages.map(file => uploadImage(file.originFileObj)));

      // Handle deleted image
      const deletedImage = currentImageUrls.filter(url => !fileList.some(file => file.url === url));
      await Promise.all(deletedImage.map(url => deleteImage(url)));

      const urlEncodedData = new URLSearchParams();
      urlEncodedData.append('name', values.name);
      urlEncodedData.append('type', values.type.value);
      urlEncodedData.append('gender', values.gender.value);
      urlEncodedData.append('age', values.age);
      urlEncodedData.append('image', uploadedUrl);
      urlEncodedData.append('description', values.description);
      urlEncodedData.append('quantity', values.quantity);
      urlEncodedData.append('is_purebred', 0);
      urlEncodedData.append('status', 0);
      urlEncodedData.append('breed_id', values.breed.value);

      await http.put(`/aid-center/pets/${pet.id}`, urlEncodedData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      Swal.fire({
        title: 'Done',
        text: 'Pet updated successfully!',
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

  const handleFileListChange = (newFileList) => {
    setFileList(newFileList);
  };

  const handleRemove = (file) => {
    setFileList((prevFileList) => prevFileList.filter(item => item.uid !== file.uid));
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

  // useEffect để thiết lập options khi listBreeds thay đổi
  useEffect(() => {
    const newOptions = listBreeds.map(group => ({
      label: group.type,
      options: group.breed.map(breedDetail => ({
        value: breedDetail.id,
        label: breedDetail.name,
      })),
    }));

    setOptions(newOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listBreeds]);

  useEffect(() => {
    const typeOptions = [
      { value: 'dog', label: 'Dog' },
      { value: 'cat', label: 'Cat' },
    ];

    const genderOptions = [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' },
    ];

    const fetchPet = async () => {
      try {
        const response = await http.get(`/aid-center/pets/${id}`)
        const petData = response.data.data
        console.log(petData)

        setPet(petData)

        // Fetch images from Firebase Storage
        if (petData.image) {
          const imageRef = ref(storage, petData.image);
          const imageUrl = await getDownloadURL(imageRef);

          const initialFileList = [{
            uid: imageUrl, // UID phải duy nhất, có thể sử dụng url
            name: imageUrl.split('/').pop(),
            status: 'done',
            url: imageUrl, // URL của file
          }]
          console.log(initialFileList)

          setFileList(initialFileList)
          setCurrentImageUrls([imageUrl])
        }

        // Chỉ tìm selectedCategory khi options đã được thiết lập
        if (options.length > 0) {
          // Find selected breed
          const selectedBreed = options
            .flatMap(group => group.options)
            .find(option => option.value === petData.breed.breed_id);

          console.log(selectedBreed)

          // Find selected type option
          const selectedTypeOption = typeOptions.find(option => option.value === petData.type);

          // Find selected gender option
          const selectedGenderOption = genderOptions.find(option => option.value === petData.gender);

          form.setFieldsValue({
            name: petData.name,
            age: petData.age,
            gender: selectedGenderOption,
            breed: selectedBreed, // Ensure this matches the option structure
            description: petData.description,
            type: selectedTypeOption,
          })
        }
      } catch (error) {
        console.log(error)
      }
    }

    // Chỉ gọi fetchProduct khi options đã được thiết lập
    if (options.length > 0) {
      fetchPet();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, options])

  return (
    <div className='flex flex-col w-full h-full items-start justify-start gap-4'>
      <div className='flex flex-row w-full items-start gap-6'>
        <div className='flex flex-col w-[58%] h-full items-start justify-start bg-white p-6 rounded-md'>
          <h1 className='text text-xl w-full text-start font-semibold border-b-2 p-2 border-neutral-400'>Basic Information</h1>
          <Form
            {...updatePetFormLayout}
            className="w-full mt-2"
            form={form}
            layout='vertical'
            name="updatePetForm"
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
                  autoComplete='age'
                />
              </Form.Item>
            </div>
            <div className='flex flex-row items-center gap-4'>
              <Form.Item
                className='w-[32%] z-10'
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
                className='w-[32%] z-10'
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
                className='w-[32%] z-10'
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
            {...updatePetFormLayout}
            className="w-full mt-2"
            form={form}
            layout='vertical'
            name="updatePetForm"
            labelAlign='left'
            labelWrap='true'
            size='large'
            autoComplete='off'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Upload
              name="logo"
              listType="picture-card"
              beforeUpload={() => false}
              onChange={({ fileList: newFileList }) => handleFileListChange(newFileList)}
              onRemove={(file) => handleRemove(file)}
              fileList={fileList}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form>
        </div>
      </div>
      <Form
        className="w-full mt-2"
        form={form}
        name="updatePetForm"
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

export default PetUpdate