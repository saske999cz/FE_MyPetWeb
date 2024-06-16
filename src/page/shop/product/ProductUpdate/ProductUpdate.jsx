import { Button, Form, Input, InputNumber, Upload } from 'antd'
import TextArea from 'antd/es/input/TextArea';
import React, { useEffect, useState } from 'react'
import { FaEdit } from 'react-icons/fa';
import { UploadOutlined } from '@ant-design/icons';
import Select from 'react-select'
import AuthUser from '../../../../utils/AuthUser';
import { useAuth } from '../../../../utils/AuthContext';
import { toast } from 'react-toastify';
import { uploadBytes, getDownloadURL, ref, listAll, deleteObject } from 'firebase/storage';
import { storage } from '../../../../utils/firebase';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

const ProductUpdate = () => {
  const { id } = useParams();

  const { http } = AuthUser()
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  const updateProductFormLayout = {
    labelCol: {
      span: 16
    },
    wrapperCol: {
      span: 24
    },
  };

  const [form] = Form.useForm();
  const [listCategories, setListCategories] = useState([])
  const [product, setProduct] = useState({})
  const [options, setOptions] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [currentImageUrls, setCurrentImageUrls] = useState([]);

  // Function to upload image
  const uploadImage = async (file, productId) => {
    const storageRef = ref(storage, `products/${productId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    console.log('Uploaded url:', url)
    return url;
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
        text: 'Please wait while we update information',
        allowOutsideClick: false,
        showConfirmButton: false,
        icon: 'info',
        willOpen: () => {
          Swal.showLoading();
        }
      });

      const productId = product.id;
      
      // Xử lý ảnh mới
      const newFiles = fileList.filter(file => !currentImageUrls.includes(file.url));
      await Promise.all(newFiles.map(file => uploadImage(file.originFileObj, productId)));
      
      // Xoá các ảnh đã bị xoá
      const deleteFiles = currentImageUrls.filter(url => !fileList.some(file => file.url === url));
      await Promise.all(deleteFiles.map(url => deleteImage(url)));

      // Tạo chuỗi URL encoded
      const urlEncodedData = new URLSearchParams();
      urlEncodedData.append('name', values.name);
      urlEncodedData.append('description', values.description);
      urlEncodedData.append('price', values.price);
      urlEncodedData.append('quantity', values.quantity);
      urlEncodedData.append('sold_quantity', values.soldQuantity);
      urlEncodedData.append('status', 1);
      urlEncodedData.append('product_category_id', values.category.value);

      await http.put(`/shop/products/${id}`, urlEncodedData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        }
      });

      Swal.fire({
        title: 'Done',
        text: 'Successfully updated product!',
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

  // useEffect để thiết lập options khi listCategories thay đổi
  useEffect(() => {
    const newOptions = listCategories.map(group => ({
      label: group.group,
      options: group.categories.map(category => ({
        value: category.id,
        label: category.name,
      })),
    }));

    setOptions(newOptions);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listCategories]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await http.get(`/shop/products/${id}`)
        const productData = response.data.data;
        console.log(productData);

        setProduct(productData);

        // Fetch images from Firebase Storage
        if (productData.image) {
          const imageRef = ref(storage, productData.image);
          const imageList = await listAll(imageRef);
          const imageUrls = await Promise.all(
            imageList.items.map(itemRef => getDownloadURL(itemRef))
          );

          const initialFileList = imageUrls.map(url => ({
            uid: url, // UID phải duy nhất, có thể sử dụng url
            name: url.split('/').pop(),
            status: 'done',
            url: url, // URL của file
          }));

          console.log('Initial filelist:', initialFileList)

          setFileList(initialFileList);
          setCurrentImageUrls(imageUrls);
        }

        // Chỉ tìm selectedCategory khi options đã được thiết lập
        if (options.length > 0) {
          const selectedCategory = options
            .flatMap(group => group.options)
            .find(option => option.value === productData.category.id);

          console.log(selectedCategory);

          form.setFieldsValue({
            name: productData.name,
            category: selectedCategory || null,
            price: productData.price,
            quantity: productData.quantity,
            soldQuantity: productData.sold_quantity,
            description: productData.description,
          });
        }
      } catch (error) {
        console.log(error)
      }
    }

    // Chỉ gọi fetchProduct khi options đã được thiết lập
    if (options.length > 0) {
      fetchProduct();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, options])

  return (
    <div className='flex flex-col w-full h-full items-start justify-start gap-4'>
      <div className='flex flex-row w-full items-start gap-6'>
        <div className='flex flex-col w-[58%] h-full items-start justify-start bg-white p-6 rounded-md'>
          <h1 className='text text-xl w-full text-start font-semibold border-b-2 p-2 border-neutral-400'>Basic Information</h1>
          <Form
            {...updateProductFormLayout}
            className="w-full mt-2"
            form={form}
            layout='vertical'
            name="updateProductForm"
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
                className='flex-1 z-10'
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
                <Select
                  options={options}
                  placeholder="Select a category"
                />
              </Form.Item>
            </div>
            <div className='flex flex-row items-center justify-between'>
              <Form.Item
                className='w-[30%]'
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
                className='w-[30%]'
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
              <Form.Item
                className='w-[30%]'
                label="Sold Quantity"
                name="soldQuantity"
                rules={[
                  {
                    required: true,
                    message: 'Sold quantity is required!',
                  },
                ]}
                hasFeedback
              >
                <InputNumber
                  className='w-full'
                  placeholder='Set sold quantity here...'
                  autoComplete='soldQuantity'
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
            {...updateProductFormLayout}
            className="w-full mt-6"
            form={form}
            layout='vertical'
            name="updateProductForm"
            labelAlign='left'
            labelWrap='true'
            size='large'
            autoComplete='off'
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Upload
              listType="picture-card"
              beforeUpload={() => false}
              onChange={({ fileList: newFileList }) => handleFileListChange(newFileList)}
              onRemove={(file) => handleRemove(file)}
              fileList={fileList}
            >
              <Button icon={<UploadOutlined />}>Click to upload</Button>
            </Upload>
          </Form>
        </div>
      </div>
      <Form
        className="w-full mt-2"
        form={form}
        name="updateProductForm"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <button className='flex flex-row items-center justify-center w-full gap-2 bg-blue-600 rounded-md px-4 py-3 hover:opacity-85 transition duration-300'>
          <FaEdit size={24} style={{ color: 'white' }} />
          <span className='text-white text-xl font-semibold'>Update Product</span>
        </button>
      </Form>
    </div>
  )
}

export default ProductUpdate