import { Button, Form, Input, InputNumber, Upload, DatePicker } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useState } from "react";
import { FaCloudUploadAlt } from "react-icons/fa";
import { InboxOutlined, UploadOutlined } from "@ant-design/icons";
import Select from "react-select";
import AuthUser from "../../../../utils/AuthUser";
import { toast } from "react-toastify";
import { uploadBytes, getDownloadURL, ref } from "firebase/storage";
import { storage, firebaseConfig } from "../../../../utils/firebase";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import PlaceAutocompleteInput from "../../../../components/PlaceAutoCompleteInput";
import moment from "moment";

const DoctorCreate = () => {
  const { http } = AuthUser();
  const navigate = useNavigate();

  const createProductFormLayout = {
    labelCol: {
      span: 16,
    },
    wrapperCol: {
      span: 24,
    },
  };

  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);

  const uploadImage = async (file, latestProductId) => {
    const storageRef = ref(storage, `doctors/${latestProductId}/${file.name}`);
    const snapshot = await uploadBytes(storageRef, file);
    const url = await getDownloadURL(snapshot.ref);
    return url;
  };

  // Function to create folder URL
  const createFolderUrl = (folderId) => {
    const baseUrl = `gs://${firebaseConfig.storageBucket}/doctors/${folderId}/`;
    return baseUrl;
  };

  const onFinish = async (values) => {
    try {
      Swal.fire({
        title: "Processing...",
        text: "Please wait while we upload your images and create the product.",
        allowOutsideClick: false,
        showConfirmButton: false,
        icon: "info",
        willOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await http.get("/medical-center/doctors");
      const latestProductId = response.data.data;

      const newProductId = latestProductId + 1;
      const folderUrl = createFolderUrl(newProductId);

      const uploadPromises = fileList.map((file) =>
        uploadImage(file.originFileObj, newProductId)
      );
      const uploadedUrls = await Promise.all(uploadPromises);

      console.log("Upload urls", uploadedUrls);
      console.log("Folder url:", folderUrl);

      const formData = new FormData();
      formData.append("full_name", values.full_name);
      formData.append("description", values.description);
      formData.append("address", values.address);
      formData.append("image", folderUrl);
      formData.append("gender", values.gender);
      formData.append("CMND", values.cmnd); // Selling true
      formData.append("phone", values.phone);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("birthdate", values.birthdate);

      await http.post("/shop/products", formData);

      Swal.fire({
        title: "Done",
        text: "Product created successfully!",
        icon: "success",
      }).then(() => {
        navigate(0);
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: "Oops.. Please try again",
        icon: "error",
      });
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log(errorInfo);
    toast.error("Please fill in all required fields", {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const normFile = (e) => {
    console.log("Upload event:", e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleFileListChange = (newFileList) => {
    const uniqueFileList = [];
    const fileMap = new Map();

    // Add previous files to the map
    fileList.forEach((file) => fileMap.set(file.uid, file));
    // Add new files to the map
    newFileList.forEach((file) => fileMap.set(file.uid, file));

    fileMap.forEach((file) => uniqueFileList.push(file));

    setFileList(uniqueFileList);
  };

  return (
    <div className="flex flex-col w-full h-full items-start justify-start gap-4">
      <div className="flex flex-row w-full items-start gap-6">
        <div className="flex flex-col w-[58%] h-full items-start justify-start bg-white p-6 rounded-md">
          <h1 className="text text-xl w-full text-start font-semibold border-b-2 p-2 border-neutral-400">
            Basic Information
          </h1>
          <Form
            {...createProductFormLayout}
            className="w-full mt-2"
            form={form}
            layout="vertical"
            name="createProductForm"
            labelAlign="left"
            labelWrap="true"
            size="large"
            autoComplete="off"
          >
            <div className="flex flex-row items-center gap-4">
              <Form.Item
                className="w-[50%]"
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
                  className="w-full"
                  placeholder="john.doe@gmail.com"
                  autoComplete="email"
                />
              </Form.Item>
              <Form.Item
                className="w-[50%]"
                label="Password"
                name="password"
                rules={[
                  {
                    required: true,
                    message: "Password is required!",
                  },
                ]}
                hasFeedback
              >
                <Input
                  className="w-full"
                  placeholder="*******"
                  autoComplete="password"
                />
              </Form.Item>
            </div>
            <div className="flex flex-row items-center gap-4">
              <Form.Item
                className="w-[50%]"
                label="Full Name"
                name="full_name"
                rules={[
                  {
                    required: true,
                    message: "Doctor name is required!",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Enter name..." autoComplete="full_name" />
              </Form.Item>
              <Form.Item
                className="w-[50%]"
                label="Username"
                name="username"
                rules={[
                  {
                    required: true,
                    message: "Doctor name is required!",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Enter username" autoComplete="username" />
              </Form.Item>
            </div>
            <div className="flex flex-row items-center gap-4">
              <Form.Item
                className="w-[50%]"
                label="Phone Number"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Email is required!",
                  },
                ]}
                hasFeedback
              >
                <InputNumber
                  className="w-full"
                  placeholder="Enter phone number"
                  autoComplete="phone"
                />
              </Form.Item>
              <Form.Item
                className="w-[50%]"
                label="Social Number"
                name="cmnd"
                rules={[
                  {
                    required: true,
                    message: "Social Number is required!",
                  },
                  {
                    pattern: /^\d{12}$/,
                    message: "Social Number must be exactly 12 digits",
                  },
                ]}
                hasFeedback
              >
                <InputNumber
                  className="w-full"
                  placeholder="Enter social number"
                  autoComplete="cmnd"
                  min={100000000000}
                  max={999999999999}
                  controls={false}
                />
              </Form.Item>
            </div>
            <div className="flex flex-row items-center gap-4">
              <Form.Item
                className="w-[50%]"
                label="Birthdate"
                name="birthdate"
                rules={[
                  {
                    required: true,
                    message: "Birthdate is required!",
                  },
                  // You can add more rules here if needed
                ]}
                hasFeedback
              >
                <DatePicker
                  className="w-full"
                  placeholder="Select birthdate"
                  disabledDate={(current) => {
                    // Calculate the dates for 18 and 80 years ago
                    const eighteenYearsAgo = moment().subtract(18, "years");
                    const eightyYearsAgo = moment().subtract(80, "years");
                    // Disable dates in the future or before 80 years ago or after 18 years ago
                    return (
                      current > eighteenYearsAgo || current < eightyYearsAgo
                    );
                  }}
                />
              </Form.Item>
              <Form.Item
                className="w-[50%]"
                label="Gender"
                name="gender"
                rules={[
                  {
                    required: true,
                    message: "Doctor gender is required!",
                  },
                ]}
                hasFeedback
              >
                <Select
                  options={[
                    { value: "male", label: "Male" },
                    { value: "female", label: "Female" },
                  ]}
                  placeholder="Select gender" // Improves user experience
                />
              </Form.Item>
            </div>
            <PlaceAutocompleteInput form={form} />
            <Form.Item
              className="flex-1"
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Description is required!",
                },
              ]}
              hasFeedback
            >
              <TextArea
                placeholder="Type here..."
                autoComplete="description"
                rows={4}
              />
            </Form.Item>
          </Form>
        </div>
        <div className="flex flex-col w-[42%] h-full items-start justify-start bg-white p-6 rounded-md">
          <h1 className="text text-xl w-full text-start font-semibold border-b-2 p-2 border-neutral-400">
            Galleries
          </h1>
          <Form
            {...createProductFormLayout}
            className="w-full mt-2"
            form={form}
            layout="vertical"
            name="createProductForm"
            labelAlign="left"
            labelWrap="true"
            size="large"
            autoComplete="off"
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
              <Form.Item
                name="dragger"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                noStyle
              >
                <Upload.Dragger
                  name="files"
                  listType="text"
                  beforeUpload={() => false}
                  onChange={({ fileList }) => handleFileListChange(fileList)}
                >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">
                    Click or drag file to this area to upload
                  </p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload.
                  </p>
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
        <button className="flex flex-row items-center justify-center w-full gap-2 bg-blue-600 rounded-md px-4 py-3 hover:opacity-85 transition duration-300">
          <FaCloudUploadAlt size={24} style={{ color: "white" }} />
          <span className="text-white text-xl font-semibold">
            Create Account
          </span>
        </button>
      </Form>
    </div>
  );
};

export default DoctorCreate;
