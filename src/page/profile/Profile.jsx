import {
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  TimePicker,
  Upload,
} from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { UploadOutlined } from "@ant-design/icons";
import { toast } from "react-toastify";
import {
  uploadBytes,
  getDownloadURL,
  ref,
  deleteObject,
  listAll,
} from "firebase/storage";
import { storage, firebaseConfig } from "../../utils/firebase";
import { useNavigate } from "react-router-dom";
import Map from "../../components/Map";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import Swal from "sweetalert2";
import AuthUser from "../../utils/AuthUser";
import moment from "moment";
import "./Profile.scss";
import { useDispatch } from "react-redux";
import { addAvatar } from "../../redux/actions";
import { BeatLoader } from "react-spinners";
import { MdOutlineSecurity } from "react-icons/md";

const Profile = () => {
  const { http } = AuthUser();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const editFormLayout = {
    labelCol: {
      span: 16,
    },
    wrapperCol: {
      span: 24,
    },
  };

  const [editProfileMode, setEditProfileMode] = useState(true);
  const [changePasswordMode, setChangePasswordMode] = useState(false);

  const [loading, setLoading] = useState(true);

  const [form] = Form.useForm();
  const [locationForm] = Form.useForm();
  const [changePasswordForm] = Form.useForm();

  const [shopProfile, setShopProfile] = useState({});

  const [galleries, setGalleries] = useState([]);
  const [avatar, setAvatar] = useState([]);
  const [certification, setCertification] = useState([]);
  const [currentGalleriesUrls, setCurrentGalleriesUrls] = useState([]);
  const [currentAvatarUrls, setCurrentAvatarUrls] = useState([]);
  const [currentCertificationUrls, setCurrentCertificationUrls] = useState([]);

  const [location, setLocation] = useState(() => {
    const storedAddress = localStorage.getItem("shopAddress");
    console.log(typeof storedAddress);
    return storedAddress ?? "";
  });

  const [coords, setCoords] = useState(() => {
    const storedCoords = localStorage.getItem("shopCoords");
    return storedCoords ? JSON.parse(storedCoords) : { lat: 0, lng: 0 };
  });

  const handleEditProfile = () => {
    setEditProfileMode(true);
    setChangePasswordMode(false);
  };

  const handleChangePassword = () => {
    setEditProfileMode(false);
    setChangePasswordMode(true);
  };

  const submitLocation = (values) => {
    console.log(values);
    setLocation(values.address);
  };

  const submitLocationFailed = (errorInfo) => {
    console.log(errorInfo);
    setLocation(errorInfo.values.address);
    toast.error("Please fill in the address field", {
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

  // Function to create folder URL
  const createFolderUrl = (folderId) => {
    const baseUrl = `gs://${firebaseConfig.storageBucket}/shops/${folderId}/`;
    return baseUrl;
  };

  // Function to upload galleries
  const uploadGalleries = async (file, shopId) => {
    const filePath = `shops/${shopId}/${file.name}`;
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, file);
  };

  // Function to upload avatar
  const uploadAvatar = async (file) => {
    const filePath = `avatars/shop/${file.name}`;
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, file);
    const gsUrl = `gs://${firebaseConfig.storageBucket}/${filePath}`;
    const httpsUrl = await getDownloadURL(storageRef);
    return { gsUrl, httpsUrl };
  };

  // Function to upload certification
  const uploadCertificate = async (file) => {
    const filePath = `certifications/shop/${file.name}`;
    const storageRef = ref(storage, filePath);
    await uploadBytes(storageRef, file);
    const gsUrl = `gs://${firebaseConfig.storageBucket}/${filePath}`;
    return gsUrl;
  };

  // Function to delete image
  const deleteImage = async (url) => {
    const fileRef = ref(storage, url);
    await deleteObject(fileRef);
  };

  const onFinish = async (values) => {
    console.log(values);

    if (!location || location.length === 0) {
      Swal.fire({
        title: "Error",
        text: "Please fill in the address field",
        icon: "error",
      });
    } else {
      try {
        await validateTimes();

        Swal.fire({
          title: "Processing...",
          text: "Please wait while we update information",
          allowOutsideClick: false,
          showConfirmButton: false,
          icon: "info",
          willOpen: () => {
            Swal.showLoading();
          },
        });

        const defaultAvatar =
          "gs://petshop-3d4ae.appspot.com/avatars/shop/default-user-image.png";
        const defaultAvatarPath = "avatars/shop/default-user-image.png";

        const shopId = shopProfile.id;
        const folderUrl = createFolderUrl(shopId);

        const startTime = values.startTime.format("hh:mm A");
        const endTime = values.endTime.format("hh:mm A");
        const workTime = `${startTime} : ${endTime}`;

        // Handle new galleries
        const newGalleriesFiles = galleries.filter(
          (file) => !currentGalleriesUrls.includes(file.url)
        );
        await Promise.all(
          newGalleriesFiles.map((file) =>
            uploadGalleries(file.originFileObj, shopId)
          )
        );

        // Handle deleted galleries
        const deletedGalleries = currentGalleriesUrls.filter(
          (url) => !galleries.some((file) => file.url === url)
        );
        await Promise.all(deletedGalleries.map((url) => deleteImage(url)));

        // Handle new avatar
        const newAvatarFiles = avatar.filter(
          (file) => !currentAvatarUrls.includes(file.url)
        );
        const newAvatarUrl = await Promise.all(
          newAvatarFiles.map((file) => uploadAvatar(file.originFileObj))
        );

        let avatarUrl = "";

        if (shopProfile.avatar === defaultAvatar) {
          // Avatar là mặc định
          if (newAvatarFiles.length > 0) {
            // Avatar mới thay thế avatar cũ
            const { gsUrl, httpsUrl } = newAvatarUrl[0];
            avatarUrl = gsUrl;
            dispatch(addAvatar(httpsUrl));
          } else {
            // Không có ảnh mới, giữ nguyên avatar mặc định
            avatarUrl = defaultAvatar;
          }
        } else {
          // Avatar không phải là mặc định
          const deletedAvatar = currentAvatarUrls.filter(
            (url) => !avatar.some((file) => file.url === url)
          );
          await Promise.all(deletedAvatar.map((url) => deleteImage(url)));

          if (deletedAvatar.length === 0) {
            avatarUrl = shopProfile.avatar;
          } else {
            // Xoá ảnh cũ và ko up ảnh mới
            if (deletedAvatar.length !== 0 && newAvatarFiles.length === 0) {
              const storageRef = ref(storage, defaultAvatarPath);
              const defaultUrl = await getDownloadURL(storageRef);
              avatarUrl = defaultAvatar;
              dispatch(addAvatar(defaultUrl));
            } else {
              const { gsUrl, httpsUrl } = newAvatarUrl[0];
              avatarUrl = gsUrl;
              dispatch(addAvatar(httpsUrl));
            }
          }
        }

        // Handle new certification
        const newCertificationFiles = certification.filter(
          (file) => !currentCertificationUrls.includes(file.url)
        );
        const newCertificationUrl = await Promise.all(
          newCertificationFiles.map((file) =>
            uploadCertificate(file.originFileObj)
          )
        );

        // Handle deleted certification
        const deletedCertification = currentCertificationUrls.filter(
          (url) => !certification.some((file) => file.url === url)
        );
        await Promise.all(deletedCertification.map((url) => deleteImage(url)));

        let certificateUrl = "";
        if (newCertificationFiles.length === 0) {
          certificateUrl = shopProfile.certificate ?? "";
        } else {
          if (
            deletedCertification.length !== 0 &&
            newCertificationFiles.length === 0
          ) {
            certificateUrl = "";
          } else {
            certificateUrl = newCertificationUrl[0];
          }
        }

        const urlEncodedData = new URLSearchParams();
        urlEncodedData.append("name", values.name);
        urlEncodedData.append("description", values.description);
        urlEncodedData.append("image", folderUrl);
        urlEncodedData.append("phone", values.phone);
        urlEncodedData.append("address", location);
        urlEncodedData.append("website", values.website);
        urlEncodedData.append("fanpage", values.fanpage);
        urlEncodedData.append("work_time", workTime);
        urlEncodedData.append("establish_year", values.establishYear);
        urlEncodedData.append("username", values.username);
        urlEncodedData.append("email", values.email);
        urlEncodedData.append("avatar", avatarUrl);
        urlEncodedData.append("certificate", certificateUrl);

        await http.put("/shop/profile", urlEncodedData, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        });

        Swal.fire({
          title: "Done",
          text: "Successfully updated shop!",
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

  const updatePassword = async (values) => {
    console.log(values);
    try {
      const urlEncodedData = new URLSearchParams();
      urlEncodedData.append("current_password", values.currentPassword);
      urlEncodedData.append("new_password", values.newPassword);
      urlEncodedData.append("confirm_password", values.confirmPassword);

      await http.patch("/auth/change-password", urlEncodedData, {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      });

      Swal.fire({
        title: "Done",
        text: "Successfully changed password",
        icon: "success",
      });
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error",
        text: `${error.response.data.message}`,
        icon: "error",
      });
    }
  };

  const updatePasswordFailed = (errorInfo) => {
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

  const handleGalleriesChange = (newFileList) => {
    setGalleries(newFileList);
  };

  const handleAvatarChange = (newFileList) => {
    setAvatar(newFileList);
  };

  const handleCertificationChange = (newFileList) => {
    setCertification(newFileList);
  };

  const handleRemoveGallery = (file) => {
    setGalleries((prevFileList) =>
      prevFileList.filter((item) => item.uid !== file.uid)
    );
  };

  const handleRemoveAvatar = (file) => {
    setAvatar((prevFileList) =>
      prevFileList.filter((item) => item.uid !== file.uid)
    );
  };

  const handleRemoveCertification = (file) => {
    setCertification((prevFileList) =>
      prevFileList.filter((item) => item.uid !== file.uid)
    );
  };

  // Function to disable minutes
  const disabledTime = () => {
    return {
      disabledMinutes: () =>
        [...Array(60).keys()].filter((minute) => minute !== 0 && minute !== 30),
    };
  };

  const validateTimes = () => {
    return new Promise((resolve, reject) => {
      form
        .validateFields(["startTime", "endTime"])
        .then((values) => {
          const start = values.startTime.format("A");
          const end = values.endTime.format("A");

          if (start !== "AM" || end !== "PM") {
            reject(
              "Start time must be in the morning (AM) and end time must be in the evening (PM)."
            );
          } else {
            resolve();
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  };

  // Fetch shop profile from API
  useEffect(() => {
    const fetchShopProfile = async () => {
      try {
        const response = await http.get("/shop/profile");
        const shopProfile = response.data.data;
        console.log(shopProfile);

        setShopProfile(shopProfile);
        setLocation(shopProfile.address);

        // Fetch images from Firebase Storage
        if (shopProfile.image) {
          const galleriesRef = ref(storage, shopProfile.image);
          const galleriesList = await listAll(galleriesRef);
          const galleriesUrls = await Promise.all(
            galleriesList.items.map((itemRef) => getDownloadURL(itemRef))
          );

          const galleries = galleriesUrls.map((url) => ({
            uid: url, // UID phải duy nhất, có thể sử dụng url
            name: url.split("/").pop(),
            status: "done",
            url: url, // URL của file
          }));

          setGalleries(galleries);
          setCurrentGalleriesUrls(galleriesUrls);
        }

        // Fetch avatar from Firebase Storage
        if (shopProfile.avatar) {
          const avatarRef = ref(storage, shopProfile.avatar);
          const avatarUrl = await getDownloadURL(avatarRef);

          const avatar = [
            {
              uid: avatarUrl, // UID phải duy nhất, có thể sử dụng url
              name: avatarUrl.split("/").pop(),
              status: "done",
              url: avatarUrl, // URL của file
            },
          ];

          setAvatar(avatar);
          setCurrentAvatarUrls([avatarUrl]);
        }

        // Fetch certificate from Firebase Storage
        if (shopProfile.certificate) {
          const certificateRef = ref(storage, shopProfile.certificate);
          const certificateUrl = await getDownloadURL(certificateRef);

          const certificate = [
            {
              uid: certificateUrl, // UID phải duy nhất, có thể sử dụng url
              name: certificateUrl.split("/").pop(),
              status: "done",
              url: certificateUrl, // URL của file
            },
          ];

          setCertification(certificate);
          setCurrentCertificationUrls([certificateUrl]);
        }

        form.setFieldsValue({
          name: shopProfile.name,
          username: shopProfile.username,
          accountId: shopProfile.account_id,
          email: shopProfile.email,
          description: shopProfile.description,
          phone: shopProfile.phone,
          fanpage: shopProfile.fanpage,
          website: shopProfile.website,
          establishYear: shopProfile.establish_year,
        });

        locationForm.setFieldsValue({
          address: shopProfile.address,
        });

        setLoading(false);
      } catch (error) {
        console.error(error);
      }
    };

    fetchShopProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Get shop address location
  useEffect(() => {
    const getCoords = async () => {
      if (!loading) {
        try {
          console.log(location);
          const results = await geocodeByAddress(location);
          console.log(results);
          const latLng = await getLatLng(results[0]);
          setCoords(latLng);
        } catch (error) {
          console.log(error);
          toast.error("Invalid address", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
        }
      }
    };

    getCoords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  useEffect(() => {
    if (shopProfile && shopProfile.work_time) {
      const [startTime, endTime] = shopProfile.work_time.split(" : ");

      form.setFieldsValue({
        startTime: moment(startTime, "hh:mm A"),
        endTime: moment(endTime, "hh:mm A"),
      });
    }
  }, [shopProfile, form]);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-row items-center justify-center">
        <BeatLoader
          className="relative top-1/2 transform -translate-y-1/2"
          color="#2463eb"
          size={36}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full items-start justify-between">
      <div className="bg-white w-full p-6 rounded-md">
        <div className="flex justify-start items-center gap-3">
          <button
            className={`py-3 px-6 rounded-md font-semibold transition duration-500 ${
              editProfileMode
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white"
            }`}
            onClick={handleEditProfile}
          >
            Edit Profile
          </button>
          <button
            className={`py-3 px-6 rounded-md font-semibold transition duration-500 ${
              changePasswordMode
                ? "bg-blue-600 text-white"
                : "bg-white text-blue-600 border border-blue-600 hover:bg-blue-600 hover:text-white"
            }`}
            onClick={handleChangePassword}
          >
            Change Password
          </button>
        </div>
        {editProfileMode ? (
          <Divider orientation="left" orientationMargin={0}>
            <span className="text-gray-800 font-bold text-md">
              Edit Profile
            </span>
          </Divider>
        ) : (
          <Divider orientation="left" orientationMargin={0}>
            <span className="text-gray-800 font-bold text-md">
              Change Password
            </span>
          </Divider>
        )}
        {editProfileMode ? (
          <>
            <div className="flex w-full items-start gap-12">
              <div className="flex flex-col w-[42%] h-full items-start justify-start bg-white rounded-md">
                {/* Upload Galleries */}
                <h1 className="text text-xl w-full text-start font-semibold border-b-2 p-2 border-neutral-400">
                  Galleries
                </h1>
                <Form
                  {...editFormLayout}
                  className="w-full mt-2 flex"
                  form={form}
                  layout="vertical"
                  name="uploadGalleriesForm"
                  labelAlign="left"
                  labelWrap="true"
                  size="large"
                  autoComplete="off"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                >
                  <Upload
                    className="my-0 mx-auto mt-2"
                    listType="picture-card"
                    beforeUpload={() => false}
                    onChange={({ fileList: newFileList }) =>
                      handleGalleriesChange(newFileList)
                    }
                    onRemove={(file) => handleRemoveGallery(file)}
                    fileList={galleries}
                  >
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                  </Upload>
                </Form>
                {/* Upload Avatar */}
                <h1 className="text text-xl w-full text-start font-semibold border-b-2 p-2 border-neutral-400">
                  Avatar
                </h1>
                <Form
                  {...editFormLayout}
                  className="w-full mt-2 flex"
                  form={form}
                  layout="vertical"
                  name="uploadAvatarForm"
                  labelAlign="left"
                  labelWrap="true"
                  size="large"
                  autoComplete="off"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                >
                  <Upload
                    className="my-0 mx-auto mt-2"
                    listType="picture-circle"
                    beforeUpload={() => false}
                    onChange={({ fileList: newFileList }) =>
                      handleAvatarChange(newFileList)
                    }
                    onRemove={(file) => handleRemoveAvatar(file)}
                    fileList={avatar}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                  </Upload>
                </Form>
                {/* Upload Certification */}
                <h1 className="text text-xl w-full text-start font-semibold border-b-2 p-2 border-neutral-400">
                  Certification
                </h1>
                <Form
                  {...editFormLayout}
                  className="w-full mt-2 flex"
                  form={form}
                  layout="vertical"
                  name="uploadCertificationForm"
                  labelAlign="left"
                  labelWrap="true"
                  size="large"
                  autoComplete="off"
                  onFinish={onFinish}
                  onFinishFailed={onFinishFailed}
                >
                  <Upload
                    className="my-0 mx-auto mt-2"
                    listType="picture-card"
                    beforeUpload={() => false}
                    onChange={({ fileList: newFileList }) =>
                      handleCertificationChange(newFileList)
                    }
                    onRemove={(file) => handleRemoveCertification(file)}
                    fileList={certification}
                    maxCount={1}
                  >
                    <Button icon={<UploadOutlined />}>Click to upload</Button>
                  </Upload>
                </Form>
              </div>
              <div className="flex flex-col w-[58%] h-full items-start justify-start bg-white rounded-md">
                <h1 className="text text-xl w-full text-start font-semibold border-b-2 p-2 border-neutral-400">
                  Shop Information
                </h1>
                <Form
                  {...editFormLayout}
                  className="w-full mt-2"
                  form={form}
                  layout="vertical"
                  name="editInformationForm"
                  labelAlign="left"
                  labelWrap="true"
                  size="large"
                  autoComplete="off"
                >
                  <div className="flex items-center w-full justify-between">
                    <Form.Item
                      className="w-[42%]"
                      label="Name"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Shop name is required!",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input placeholder="Type here..." autoComplete="name" />
                    </Form.Item>
                    <Form.Item
                      className="w-[22%]"
                      label="Username"
                      name="username"
                      rules={[
                        {
                          required: true,
                          message: "Username is required!",
                        },
                        {
                          max: 20,
                          message: "Username cannot exceed 20 characters!",
                        },
                      ]}
                      hasFeedback
                    >
                      <Input
                        placeholder="Type here..."
                        autoComplete="username"
                      />
                    </Form.Item>
                    <Form.Item
                      className="w-[32%]"
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
                      <Input placeholder="Type here..." autoComplete="name" />
                    </Form.Item>
                  </div>
                  <Form.Item label="Description" name="description">
                    <TextArea
                      placeholder="Type here..."
                      autoComplete="description"
                      rows={4}
                    />
                  </Form.Item>
                  <div className="flex items-center justify-between">
                    <div className="w-[70%]">
                      <div className="flex items-center gap-4">
                        <Form.Item
                          className="w-[50%]"
                          label="Phone"
                          name="phone"
                          rules={[
                            {
                              required: true,
                              message: "Phone is required!",
                            },
                          ]}
                          hasFeedback
                        >
                          <Input
                            className="w-full"
                            placeholder="Set phone here..."
                            autoComplete="phone"
                          />
                        </Form.Item>
                        <Form.Item
                          className="w-[50%]"
                          label="Establish Year"
                          name="establishYear"
                          rules={[
                            {
                              required: true,
                              message: "Establish year is required!",
                            },
                          ]}
                          hasFeedback
                        >
                          <InputNumber
                            className="w-full"
                            placeholder="Set establish year here..."
                            autoComplete="establishYear"
                          />
                        </Form.Item>
                      </div>
                      <div className="flex items-center gap-4">
                        <Form.Item
                          className="w-[50%]"
                          label="Fanpage"
                          name="fanpage"
                        >
                          <Input
                            className="w-full"
                            placeholder="Set fanpage here..."
                            autoComplete="fanpage"
                          />
                        </Form.Item>
                        <Form.Item
                          className="w-[50%]"
                          label="Website"
                          name="website"
                        >
                          <InputNumber
                            className="w-full"
                            placeholder="Set website here..."
                            autoComplete="website"
                          />
                        </Form.Item>
                      </div>
                    </div>
                    <div className="w-[26%]">
                      <Form.Item
                        name="startTime"
                        label="Start Time"
                        rules={[
                          {
                            required: true,
                            message: "Please select start time!",
                          },
                        ]}
                      >
                        <TimePicker
                          use12Hours
                          format="h:mm A"
                          disabledTime={disabledTime}
                        />
                      </Form.Item>
                      <Form.Item
                        name="endTime"
                        label="End Time"
                        rules={[
                          {
                            required: true,
                            message: "Please select end time!",
                          },
                        ]}
                      >
                        <TimePicker
                          use12Hours
                          format="h:mm A"
                          disabledTime={disabledTime}
                        />
                      </Form.Item>
                    </div>
                  </div>
                  <div className="flex flex-col w-full items-start justify-start">
                    <Form
                      className="w-full flex items-end gap-4"
                      form={locationForm}
                      layout="vertical"
                      name="locationForm"
                      onFinish={submitLocation}
                      onFinishFailed={submitLocationFailed}
                    >
                      <Form.Item
                        className="flex-1"
                        label="Address"
                        name="address"
                        rules={[
                          {
                            required: true,
                            message: "Address is required!",
                          },
                        ]}
                        hasFeedback
                      >
                        <Input
                          className="w-full"
                          placeholder="Set address here..."
                          autoComplete="address"
                        />
                      </Form.Item>
                      <Form.Item>
                        <Button
                          type="primary"
                          onClick={() => locationForm.submit()}
                        >
                          Submit
                        </Button>
                      </Form.Item>
                    </Form>
                    <Map address={location} coords={coords} />
                  </div>
                </Form>
              </div>
            </div>
            <Form
              className="w-full mt-8"
              form={form}
              name="submitButton"
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
            >
              <button className="flex items-center justify-center w-full gap-2 bg-blue-600 rounded-md px-4 py-3 hover:opacity-85 transition duration-300">
                <FaEdit size={24} style={{ color: "white" }} />
                <span className="text-white text-xl font-semibold">
                  Update Information
                </span>
              </button>
            </Form>
          </>
        ) : (
          <div className="w-full mt-4 flex flex-col">
            <Form
              {...editFormLayout}
              form={changePasswordForm}
              className="w-full px-10"
              layout="vertical"
              name="changePasswordForm"
              labelAlign="left"
              labelWrap="true"
              size="large"
              autoComplete="off"
              onFinish={updatePassword}
              onFinishFailed={updatePasswordFailed}
            >
              <Form.Item
                label="Current Password"
                name="currentPassword"
                rules={[
                  {
                    required: true,
                    message: "Current password is required!",
                  },
                ]}
                hasFeedback
              >
                <Input.Password
                  placeholder="******"
                  autoComplete="currentPassword"
                />
              </Form.Item>
              <div className="flex items-center gap-8">
                <Form.Item
                  label="New Password"
                  name="newPassword"
                  className="w-1/2"
                  rules={[
                    {
                      required: true,
                      message: "New password is required!",
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    placeholder="******"
                    autoComplete="newPassword"
                  />
                </Form.Item>
                <Form.Item
                  label="Confirm Password"
                  name="confirmPassword"
                  className="w-1/2"
                  dependencies={["password"]}
                  hasFeedback
                  rules={[
                    {
                      required: true,
                      message: "Please confirm your password!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("newPassword") === value) {
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
                    autoComplete="confirmPassword"
                  />
                </Form.Item>
              </div>
              <button className="flex items-center justify-center w-full mt-4 gap-2 bg-blue-600 rounded-md px-4 py-3 hover:opacity-85 transition duration-300">
                <MdOutlineSecurity size={24} style={{ color: "white" }} />
                <span className="text-white text-xl font-semibold">
                  Change Password
                </span>
              </button>
            </Form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
