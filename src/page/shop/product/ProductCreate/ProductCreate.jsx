import { Button, Form, Input, InputNumber, Upload } from 'antd'
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react'
import { FaCloudUploadAlt } from 'react-icons/fa';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import Select from 'react-select'
import AuthUser from '../../../../utils/AuthUser';
import { useAuth } from '../../../../utils/AuthContext';
import { toast } from 'react-toastify';
import { uploadBytes, getDownloadURL, ref } from 'firebase/storage';
import { storage, firebaseConfig } from '../../../../utils/firebase';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const ProductCreate = () => {
  const { http } = AuthUser()
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  const createProductFormLayout = {
    labelCol: {
      span: 16
    },
    wrapperCol: {
      span: 24
    },
  };

  const [form] = Form.useForm();
  const [listCategories, setListCategories] = useState([])
  const [fileList, setFileList] = useState([]);

  // Chuyển đổi dữ liệu để phù hợp với định dạng của react-select
  const options = listCategories.map(group => ({
    label: group.group,
    options: group.categories.map(category => ({
      value: category.id,
      label: category.name,
    })),
  }));

  const uploadImage = async (file, latestProductId) => {
    const storageRef = ref(storage, `products/${latestProductId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  };

  // Function to create folder URL
  const createFolderUrl = (folderId) => {
    const baseUrl = `gs://${firebaseConfig.storageBucket}/products/${folderId}/`;
    return baseUrl;
  };

  const onFinish = async (values) => {
    try {
      Swal.fire({
        title: 'Processing...',
        text: 'Please wait while we upload your images and create the product.',
        allowOutsideClick: false,
        showConfirmButton: false,
        icon: 'info',
        willOpen: () => {
          Swal.showLoading();
        }
      });

      const response = await http.get('/shop/products/latest-id');
      const latestProductId = response.data.data;

      const newProductId = latestProductId + 1;
      const folderUrl = createFolderUrl(newProductId);

      const uploadPromises = fileList.map(file => uploadImage(file.originFileObj, newProductId));
      const uploadedUrls = await Promise.all(uploadPromises);

      console.log('Upload urls', uploadedUrls)
      console.log('Folder url:', folderUrl)

      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('description', values.description);
      formData.append('price', values.price);
      formData.append('image', folderUrl);
      formData.append('quantity', values.quantity);
      formData.append('status', 1); // Selling true
      formData.append('product_category_id', values.category.value);

      await http.post('/shop/products', formData)

      Swal.fire({
        title: 'Done',
        text: 'Product created successfully!',
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

  const handleFileListChange = (newFileList) => {
    const uniqueFileList = [];
    const fileMap = new Map();

    // Add previous files to the map
    fileList.forEach(file => fileMap.set(file.uid, file));
    // Add new files to the map
    newFileList.forEach(file => fileMap.set(file.uid, file));

    // Convert the map back to an array
    fileMap.forEach(file => uniqueFileList.push(file));

    setFileList(uniqueFileList);
  };


  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        const response = await http.get('/shop/product-categories')
        setListCategories(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchProductCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  return (
    <div className='flex flex-col w-full h-full items-start justify-start gap-4'>
      <div className='flex flex-row w-full items-start gap-6'>
        <div className='flex flex-col w-[58%] h-full items-start justify-start bg-white p-6 rounded-md'>
          <h1 className='text text-xl w-full text-start font-semibold border-b-2 p-2 border-neutral-400'>Basic Information</h1>
          <Form
            {...createProductFormLayout}
            className="w-full mt-2"
            form={form}
            layout='vertical'
            name="createProductForm"
            labelAlign='left'
            labelWrap='true'
            size='large'
            autoComplete='off'
          >
            <div className='flex flex-row items-center gap-4'>
              <Form.Item
                className='flex-1'
                label="Name"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Product name is required!',
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
                className='flex-1'
                label="Category"
                name="category"
                rules={[
                  {
                    required: true,
                    message: 'Product category is required!',
                  },
                ]}
                hasFeedback
              >
                <Select options={options} />
              </Form.Item>
            </div>
            <div className='flex flex-row items-center gap-4'>
              <Form.Item
                className='flex-1'
                label="Price"
                name="price"
                rules={[
                  {
                    required: true,
                    message: 'Price is required!',
                  },
                ]}
                hasFeedback
              >
                <InputNumber
                  className='w-full'
                  placeholder='Set price here...'
                  autoComplete='price'
                />
              </Form.Item>
              <Form.Item
                className='flex-1'
                label="Stock"
                name="quantity"
                rules={[
                  {
                    required: true,
                    message: 'Stock is required!',
                  },
                ]}
                hasFeedback
              >
                <InputNumber
                  className='w-full'
                  placeholder='Set stock here...'
                  autoComplete='stock'

                />
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
          <h1 className='text text-xl w-full text-start font-semibold border-b-2 p-2 border-neutral-400'>Galleries</h1>
          <Form
            {...createProductFormLayout}
            className="w-full mt-2"
            form={form}
            layout='vertical'
            name="createProductForm"
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
                onChange={({ fileList }) => handleFileListChange(fileList)}
              >
                <Button icon={<UploadOutlined />}>Click to upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item label="Dragger">
              <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={normFile} noStyle>
                <Upload.Dragger
                  name="files"
                  listType='text'
                  beforeUpload={() => false}
                  onChange={({ fileList }) => handleFileListChange(fileList)}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">Support for a single or bulk upload.</p>
                </Upload.Dragger>
              </Form.Item>
            </Form.Item>
          </Form>
        </div>
      </div>
      <Form
        className="w-full mt-2"
        form={form}
        name="createProductForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <button className='flex flex-row items-center justify-center w-full gap-2 bg-blue-600 rounded-md px-4 py-3 hover:opacity-85 transition duration-300'>
          <FaCloudUploadAlt size={24} style={{ color: 'white' }} />
          <span className='text-white text-xl font-semibold'>Create Product</span>
        </button>
      </Form>
    </div>
  )
}

export default ProductCreate