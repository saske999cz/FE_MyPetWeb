/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useState } from "react";
import { HiOutlineTrendingDown, HiOutlineTrendingUp } from "react-icons/hi";
import { IoBagHandle, IoPieChart, IoCart, IoStar } from "react-icons/io5";
import { LazyLoadImage } from "react-lazy-load-image-component";
import loadingImg from "../../../assets/images/loading.png";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { HiOutlineDotsVertical } from "react-icons/hi";
import {
  FaClockRotateLeft,
  FaReplyAll,
  FaProductHunt,
  FaStar,
} from "react-icons/fa6";
import { AiFillLike } from "react-icons/ai";
import AuthUser from "../../../utils/AuthUser";

import { toast } from "react-toastify";
import Column from "antd/es/table/Column";
import { FaEye } from "react-icons/fa";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Divider, Input, Button, Table, Modal, Popconfirm } from "antd";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../utils/firebase";
import { BeatLoader } from "react-spinners";
import { geocodeByAddress, getLatLng } from "react-google-places-autocomplete";
import "./MedicalCenterDashboard.scss";

function BoxWrapper({
  children,
  className,
  menuPosition = "bottom-0 right-4",
  isLastCard = false,
  banner,
  handleDateChange,
}) {
  return (
    <div
      className={`relative rounded-lg flex-1 flex items-center justify-between shadow-lg ${className}`}
    >
      {children}
      <Menu as="div" className={`absolute ${menuPosition}`}>
        <MenuButton className="inline-flex justify-center w-10 h-10 text-gray-500 hover:text-gray-700">
          {isLastCard ? <></> : <HiOutlineDotsVertical className="w-6 h-6" />}
        </MenuButton>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <MenuItems className="absolute right-0 w-40 -mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            <div className="py-1">
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={`${
                      focus ? "bg-gray-100" : ""
                    } flex items-center gap-2 p-2 text-sm text-gray-700 w-full`}
                    onClick={handleDateChange(banner, FILTER_LAST_DAY)}
                  >
                    <FaClockRotateLeft />
                    Last day
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={`${
                      focus ? "bg-gray-100" : ""
                    } flex items-center gap-2 p-2 text-sm text-gray-700 w-full`}
                    onClick={handleDateChange(banner, FILTER_LAST_WEEK)}
                  >
                    <FaClockRotateLeft />
                    Last week
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={`${
                      focus ? "bg-gray-100" : ""
                    } flex items-center gap-2 p-2 text-sm text-gray-700 w-full`}
                    onClick={handleDateChange(banner, FILTER_LAST_MONTH)}
                  >
                    <FaClockRotateLeft />
                    Last month
                  </button>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={`${
                      focus ? "bg-gray-100" : ""
                    } flex items-center gap-2 p-2 text-sm text-gray-700 w-full`}
                    onClick={handleDateChange(banner, FILTER_LAST_YEAR)}
                  >
                    <FaClockRotateLeft />
                    Last year
                  </button>
                )}
              </MenuItem>
            </div>
          </MenuItems>
        </Transition>
      </Menu>
    </div>
  );
}

// --------------     BANNER     --------------
const BANNER_REVIEW = "Review";
const BANNER_REPLY = "Reply";
const BANNER_DOCTOR = "Doctor";
const BANNER_APPOINTMENT = "Appointment";
const BANNER_SALE = "Appointment";

// --------------     FILTER OPTION     --------------
const FILTER_LAST_YEAR = "Last year";
const FILTER_LAST_MONTH = "Last month";
const FILTER_LAST_WEEK = "Last week";
const FILTER_LAST_DAY = "Last day";

const MedicalCenterDashboard = () => {
  const { http } = AuthUser();
  const [loading, setLoading] = useState(true);
  const { TextArea } = Input;

  const DEFAULT_CURRENT_PAGE_NUMBER = 1;
  const DEFAULT_PAGE_SIZE_NUMBER = 10;
  const allPageSize = [10, 20, 30];

  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE_NUMBER);

  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE_NUMBER);

  const [totalReviews, setTotalReviews] = useState(0); // Fetch total products state

  const [reviewOption, setReviewOption] = useState(FILTER_LAST_MONTH); // default option
  const [replyOption, setReplyOption] = useState(FILTER_LAST_MONTH); // default option
  const [doctorOption, setDoctorOption] = useState(FILTER_LAST_MONTH); // default option
  const [appointmentOption, setAppointmentOption] = useState(FILTER_LAST_MONTH); // default option

  const [reviewBanner, setReviewBanner] = useState();
  const [replyBanner, setReplyBanner] = useState();
  const [doctorBanner, setDoctorBanner] = useState();
  const [appointmentBanner, setAppointmentBanner] = useState([]);
  const [saleBanner, setSaleBanner] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentReview, setCurrentReview] = useState();
  const [myReply, setMyReply] = useState("");

  const [isFirstFetchReview, setIsFirstFetchReview] = useState(true);
  const [isFirstFetchReply, setIsFirstFetchReply] = useState(true);
  const [isFirstFetchProduct, setIsFirstFetchProduct] = useState(true);
  const [isFirstFetchOrder, setIsFirstFetchOrder] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editable, setEditable] = useState(false);

  const handleClose = () => {
    setMyReply("");
    setEditable(false);
    setIsModalOpen(false);
  };

  const handleClickPaginate = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleShowSizeChange = (currentPage, pageSize) => {
    setCurrentPage(currentPage);
    setPageSize(pageSize);
  };

  const handleDateChange = (banner, filterOption) => () => {
    console.log(banner, filterOption);
    // Thêm logic để cập nhật state tương ứng
    switch (banner) {
      case BANNER_REVIEW:
        setReviewOption(filterOption);
        break;
      case BANNER_REPLY:
        setReplyOption(filterOption);
        break;
      case BANNER_DOCTOR:
        setDoctorOption(filterOption);
        break;
      case BANNER_APPOINTMENT:
        setAppointmentOption(filterOption);
        break;
      default:
        break;
    }
  };

  const handleReply = async () => {
    if (myReply === "" || myReply === null || myReply === undefined) {
      toast.error("Reply cannot be empty!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    try {
      const response = await http.post(
        `/medical-center/ratings/${currentReview.rating_id}/reply`,
        { reply: myReply }
      );
      if (response.status === 200) {
        toast.success("Reply successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        const updatedReviews = reviews.map((review) => {
          if (review.rating_id === currentReview.rating_id) {
            return {
              ...review,
              reply: myReply,
            };
          }
          return review;
        });
        setReviews(updatedReviews);
        setReplyBanner(...replyBanner, replyBanner?.current_period_count + 1);
        setIsModalOpen(false);
        setMyReply("");
      }
    } catch (error) {
      console.log(error);
      toast.error("Reply failed!", {
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
  };

  const handleEditReply = async () => {
    if (myReply === "" || myReply === null || myReply === undefined) {
      toast.error("Reply cannot be empty!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      return;
    }
    try {
      const params = new URLSearchParams();
      params.append("reply", myReply);

      const response = await http.put(
        `/medical-center/ratings/${currentReview.rating_id}/reply`,
        params,
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      if (response.status === 200) {
        toast.success("Reply successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        const updatedReviews = reviews.map((review) => {
          if (review.rating_id === currentReview.rating_id) {
            return {
              ...review,
              reply: myReply,
            };
          }
          return review;
        });
        setReviews(updatedReviews);
        setMyReply("");
        setEditable(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Reply failed!", {
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
  };

  const handleDeleteReply = async () => {
    try {
      const response = await http.delete(
        `/medical-center/ratings/${currentReview.rating_id}/reply`
      );
      if (response.status === 200) {
        toast.success("Reply deleted successfully!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
        const updatedReviews = reviews.map((review) => {
          if (review.rating_id === currentReview.rating_id) {
            return {
              ...review,
              reply: null,
            };
          }
          return review;
        });
        setReviews(updatedReviews);
        setMyReply("");
        setEditable(false);
        setIsModalOpen(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Reply delete failed!", {
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
  };

  const handleLikeReview = async () => {
    try {
      if (currentReview.likes.medical_center_liked === false) {
        const response = await http.post(
          `/medical-center/ratings/${currentReview.rating_id}/like`
        );
        if (response.status === 200) {
          toast.success("Like successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setCurrentReview({
            ...currentReview,
            likes: {
              ...currentReview.likes,
              medical_center_liked: true,
            },
          });
        }
      } else {
        const response = await http.post(
          `/medical-center/ratings/${currentReview.rating_id}/unlike`
        );
        if (response.status === 200) {
          toast.success("Unlike successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "colored",
          });
          setCurrentReview({
            ...currentReview,
            likes: {
              ...currentReview.likes,
              medical_center_liked: false,
            },
          });
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Like failed!", {
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
  };

  // --------------------------     Fetch Firebase Image     --------------------------

  useEffect(() => {
    const fetchReviewBanner = async () => {
      try {
        const response = await http.get(
          `/medical-center/banner/reviews?option=${reviewOption}`
        );
        setReviewBanner(response.data.data);
        if (!isFirstFetchReview) {
          toast.success("Review filter applied successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          });
        }
        setIsFirstFetchReview(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReviewBanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewOption]);

  useEffect(() => {
    const fetchReplyBanner = async () => {
      try {
        const response = await http.get(
          `/medical-center/banner/replies?option=${replyOption}`
        );
        setReplyBanner(response.data.data);
        if (!isFirstFetchReply) {
          toast.success("Reply filter applied successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          });
        }
        setIsFirstFetchReply(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReplyBanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replyOption]);

  useEffect(() => {
    const fetchDoctorBanner = async () => {
      try {
        const response = await http.get(
          `/medical-center/banner/doctors?option=${doctorOption}`
        );
        setDoctorBanner(response.data.data);
        if (!isFirstFetchProduct) {
          toast.success("Doctor filter applied successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          });
        }
        setIsFirstFetchProduct(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchDoctorBanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorOption]);

  useEffect(() => {
    const fetchAppointmentBanner = async () => {
      try {
        const response = await http.get(
          `/medical-center/banner/appointments?option=${appointmentOption}`
        );
        setAppointmentBanner(response.data.data);
        if (!isFirstFetchOrder) {
          toast.success("Appointment filter applied successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          });
        }
        setIsFirstFetchOrder(false);
      } catch (error) {
        console.log(error);
      }
    };

    fetchAppointmentBanner();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentOption]);

  useEffect(() => {
    const fetchLastWeekAppointments = async () => {
      try {
        const response = await http.get(
          "/medical-center/banner/last-week-appointments"
        );
        setSaleBanner(response.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchLastWeekAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchImages = async (imagePath) => {
    try {
      const imageRef = ref(storage, imagePath);
      console.log("imagepath:", imagePath);
      const url = await getDownloadURL(imageRef);
      console.log("url:", url);
      return url; // This will be the resolved value of the promise
    } catch (error) {
      console.log(error);
      return null; // Return null or a default image path in case of error
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await http.get(
          `/medical-center/ratings/paging?page_number=${currentPage}&num_of_page=${pageSize}`
        );
        const reviewData = response.data.data;
        setTotalReviews(response.data.total_ratings);

        const reviewDataWithImagesPromises = reviewData.map(async (review) => {
          const url = await fetchImages(review.customer_avatar); // This will either be the URL or null
          return { ...review, image_url: url };
        });

        const reviewWithImages = await Promise.all(
          reviewDataWithImagesPromises
        );
        console.log(reviewWithImages);
        setReviews(reviewWithImages);
      } catch (error) {
        console.error("Error fetching reviews", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
    // If currentPage and pageSize are expected to change and should trigger refetching, include them in the dependency array
  }, []); // Assuming currentPage and pageSize are state variables that could change

  if (loading) {
    return (
      <div className="h-full">
        <BeatLoader
          className="relative top-1/2 transform -translate-y-1/2"
          color="#2463eb"
          size={36}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 flex-1">
          <BoxWrapper
            banner={BANNER_REVIEW}
            className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-white p-4"
            handleDateChange={handleDateChange}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-700">
                  <IoStar className="text-2xl text-white" />
                </div>
                <div className="pl-4 flex flex-col items-start">
                  <span className="text-sm font-light">Total Reviews</span>
                  <div className="flex items-center">
                    <strong className="text-2xl font-semibold">
                      {reviewBanner?.current_period_count}
                    </strong>
                  </div>
                  <span className="text-sm">
                    {reviewBanner?.percentage_change !== null &&
                    reviewBanner?.percentage_change !== undefined
                      ? `${reviewBanner.percentage_change.toFixed(
                          0
                        )}% ${reviewOption}`
                      : "N/A"}
                  </span>
                </div>
              </div>
              {(() => {
                if (
                  reviewBanner?.previous_period_count === undefined ||
                  reviewBanner?.current_period_count === undefined
                ) {
                  return null;
                } else if (
                  reviewBanner.previous_period_count <
                  reviewBanner.current_period_count
                ) {
                  return (
                    <HiOutlineTrendingUp
                      className="text-yellow-900 opacity-50"
                      size={100}
                    />
                  );
                } else {
                  return (
                    <HiOutlineTrendingDown
                      className="text-yellow-900 opacity-50"
                      size={100}
                    />
                  );
                }
              })()}
            </div>
          </BoxWrapper>
          <BoxWrapper
            banner={BANNER_REPLY}
            className="bg-gradient-to-r from-green-600 to-green-400 text-white p-4"
            handleDateChange={handleDateChange}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-700">
                  <FaReplyAll className="text-2xl text-white" />
                </div>
                <div className="pl-4 flex flex-col items-start">
                  <span className="text-sm font-light">Total Replies</span>
                  <div className="flex items-center">
                    <strong className="text-2xl font-semibold">
                      {replyBanner?.current_period_count}
                    </strong>
                  </div>
                  <span className="text-sm">
                    {replyBanner?.percentage_change !== null &&
                    replyBanner?.percentage_change !== undefined
                      ? `${replyBanner.percentage_change.toFixed(
                          0
                        )}% ${replyOption}`
                      : "N/A"}
                  </span>
                </div>
              </div>
              {(() => {
                if (
                  replyBanner?.previous_period_count === undefined ||
                  replyBanner?.current_period_count === undefined
                ) {
                  return null;
                } else if (
                  replyBanner.previous_period_count <
                  replyBanner.current_period_count
                ) {
                  return (
                    <HiOutlineTrendingUp
                      className="text-yellow-900 opacity-50"
                      size={100}
                    />
                  );
                } else {
                  return (
                    <HiOutlineTrendingDown
                      className="text-yellow-900 opacity-50"
                      size={100}
                    />
                  );
                }
              })()}
            </div>
          </BoxWrapper>
          <BoxWrapper
            banner={BANNER_DOCTOR}
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4"
            handleDateChange={handleDateChange}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-blue-700">
                  <IoBagHandle className="text-2xl text-white" />
                </div>
                <div className="pl-4 flex flex-col items-start">
                  <span className="text-sm font-light">Total Doctors</span>
                  <div className="flex items-center">
                    <strong className="text-2xl font-semibold">
                      {doctorBanner?.current_period_count}
                    </strong>
                  </div>
                  <span className="text-sm">
                    {doctorBanner?.percentage_change !== null &&
                    doctorBanner?.percentage_change !== undefined
                      ? `${doctorBanner.percentage_change.toFixed(
                          0
                        )}% ${doctorOption}`
                      : "N/A"}
                  </span>
                </div>
              </div>
              {(() => {
                if (
                  doctorBanner?.previous_period_count === undefined ||
                  doctorBanner?.current_period_count === undefined
                ) {
                  return null;
                } else if (
                  doctorBanner.previous_period_count <
                  doctorBanner.current_period_count
                ) {
                  return (
                    <HiOutlineTrendingUp
                      className="text-yellow-900 opacity-50"
                      size={100}
                    />
                  );
                } else {
                  return (
                    <HiOutlineTrendingDown
                      className="text-yellow-900 opacity-50"
                      size={100}
                    />
                  );
                }
              })()}
            </div>
          </BoxWrapper>
          <BoxWrapper
            banner={BANNER_APPOINTMENT}
            className="bg-gradient-to-r from-pink-600 to-pink-400 text-white p-4"
            handleDateChange={handleDateChange}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-pink-700">
                  <IoCart className="text-2xl text-white" />
                </div>
                <div className="pl-4 flex flex-col items-start">
                  <span className="text-sm font-light">Total Appointments</span>
                  <div className="flex items-center">
                    <strong className="text-2xl font-semibold">
                      {appointmentBanner?.current_period_count}
                    </strong>
                  </div>
                  <span className="text-sm">
                    {appointmentBanner?.percentage_change !== null &&
                    appointmentBanner?.percentage_change !== undefined
                      ? `${appointmentBanner.percentage_change.toFixed(
                          0
                        )}% ${appointmentOption}`
                      : "N/A"}
                  </span>
                </div>
              </div>
              {(() => {
                if (
                  appointmentBanner?.previous_period_count === undefined ||
                  appointmentBanner?.current_period_count === undefined
                ) {
                  return null;
                } else if (
                  appointmentBanner.previous_period_count <
                  appointmentBanner.current_period_count
                ) {
                  return (
                    <HiOutlineTrendingUp
                      className="text-yellow-900 opacity-50"
                      size={100}
                    />
                  );
                } else {
                  return (
                    <HiOutlineTrendingDown
                      className="text-yellow-900 opacity-50"
                      size={100}
                    />
                  );
                }
              })()}
            </div>
          </BoxWrapper>
        </div>
        <div className="flex-1">
          <BoxWrapper
            banner={BANNER_SALE}
            className="bg-gradient-to-r from-blue-700 to-blue-500 text-white h-full"
            menuPosition="top-4 right-4"
            isLastCard={true}
            handleDateChange={handleDateChange}
          >
            <div className="flex flex-col justify-between h-full w-full">
              <div className="flex items-center justify-between w-full p-4">
                <div className="flex items-center">
                  <div className="rounded-full h-12 w-12 flex items-center justify-center bg-blue-800">
                    <IoPieChart className="text-2xl text-white" />
                  </div>
                  <div className="pl-4 flex flex-col items-start">
                    <span className="text-sm font-light">
                      Total Appointments Last Week
                    </span>
                    <div className="flex items-center">
                      <strong className="text-2xl font-semibold">
                        {saleBanner?.total_appointments?.toLocaleString(
                          "it-IT"
                        )}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250} className="p-2">
                <AreaChart
                  data={saleBanner?.data}
                  margin={{ top: 0, right: 30, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tick={{ fill: "white", fontSize: 14 }}
                  />
                  <YAxis
                    axisLine={false}
                    tick={{ fill: "white", fontSize: 14 }}
                    tickFormatter={(value) => value.toLocaleString("it-IT")}
                  />
                  <CartesianGrid strokeDasharray="2 2" strokeOpacity={0.5} />
                  <Tooltip
                    formatter={(value) => value.toLocaleString("it-IT")}
                    labelFormatter={(label) => label}
                    contentStyle={{
                      backgroundColor: "#000000aa",
                      color: "#ffffff",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="appointments"
                    stroke="#82ca9d"
                    fillOpacity={1}
                    fill="url(#colorPv)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </BoxWrapper>
        </div>
      </div>
      <div className="flex flex-row w-full">
        <div className="w-full flex flex-col items-start justify-between bg-white p-6 rounded-md">
          <Divider orientation="left">
            <div className="flex flex-row gap-2 items-center">
              <FaProductHunt />
              <span className="text-gray-800 font-bold text-md">Reviews</span>
            </div>
          </Divider>
          {/* REPLIES */}
          <div className="w-full">
            <Table
              bordered
              dataSource={reviews}
              pagination={{
                defaultCurrent: DEFAULT_CURRENT_PAGE_NUMBER,
                defaultPageSize: DEFAULT_PAGE_SIZE_NUMBER,
                hideOnSinglePage: true,
                current: currentPage,
                pageSizeOptions: allPageSize,
                showSizeChanger: true,
                showQuickJumper: true,
                total: totalReviews,
                showTotal: (totalReviews) => `Total ${totalReviews} products`,
                onChange: handleClickPaginate,
                onShowSizeChange: handleShowSizeChange,
              }}
            >
              <Column
                align="left"
                title="No."
                key="no."
                render={(text, record, index) => (
                  <span className="font-semibold">
                    {currentPage * DEFAULT_PAGE_SIZE_NUMBER -
                      DEFAULT_PAGE_SIZE_NUMBER +
                      index +
                      1}
                  </span>
                )}
              />
              <Column
                align="left"
                title="ID"
                key="index"
                dataIndex="rating_id"
                render={(text, _) => {
                  return <span>#{text}</span>;
                }}
              />
              <Column
                align="left"
                title="User"
                key="username"
                dataIndex="customer_username"
                render={(text, record, index) => {
                  return (
                    <div className="flex flex-row items-center gap-3 min-w-[200px]">
                      <LazyLoadImage
                        key={index}
                        src={record.image_url}
                        alt={`Reivew ${index}`}
                        className="w-10 h-10 bg-white object-cover rounded-[10px]"
                        effect="blur"
                        placeholderSrc={loadingImg}
                      />
                      <span className="font-semibold">{text}</span>
                    </div>
                  );
                }}
              />
              <Column
                align="left"
                title="Description"
                key="description"
                dataIndex="description"
                render={(text, record, _) => record.description} // Renderer of the table cell. The return value should be a ReactNode (function(text, record, index) {})
              />
              <Column
                align="left"
                title="Rating"
                key="rating"
                dataIndex="rating_score"
                width={110}
                render={(text, record) => {
                  const roundedRating = parseFloat(text).toFixed(1);
                  return (
                    <div className="flex flex-row gap-2 items-center">
                      <FaStar style={{ color: "#fadb14" }} />
                      <p className="text-sm font-bold">
                        {roundedRating}{" "}
                        <span className="font-normal">
                          ({record.rating_score})
                        </span>
                      </p>
                    </div>
                  );
                }}
              />
              <Column
                align="center"
                title="Replied"
                key="replu"
                dataIndex="reply"
                width={110}
                render={(text, record) => {
                  return (
                    <div
                      className={`flex flex-row items-center justify-center ${
                        record.reply ? "bg-green-500" : "bg-amber-500"
                      } rounded-md`}
                    >
                      <p
                        className={`font-semibold ${
                          record.reply ? "text-green-700" : "text-amber-900"
                        }`}
                      >
                        {record.reply ? "Yes" : "No"}
                      </p>
                    </div>
                  );
                }}
              />
              <Column
                align="center"
                title="Action"
                key="action"
                render={(text, record) => (
                  <div className="flex flex-row items-center justify-evenly space-x-2 w-full my-1">
                    <button
                      onClick={() => {
                        setCurrentReview(record);
                        setIsModalOpen(true);
                      }}
                      className="bg-purple-200 rounded-md p-1.5"
                    >
                      <FaEye size={18} className="text-purple-600" />
                    </button>
                  </div>
                )}
              />
            </Table>
          </div>
        </div>
      </div>
      <Modal
        title="Review Detail"
        open={isModalOpen}
        footer={null}
        onCancel={handleClose}
      >
        <div className="w-full min-w-[470px] h-fit min-h-[200px]">
          <div className="w-full h-[40px] flex flex-row items-center justify-start px-[5px] mt-[20px]">
            <LazyLoadImage
              src={currentReview?.image_url}
              alt={`Reivew detail`}
              className="w-[40px] h-[40px] bg-white object-cover rounded-[10px]"
              effect="blur"
              placeholderSrc={loadingImg}
            />
            <div className="w-fit min-w-[400px] h-fit flex flex-col items-start justify-start ml-[20px]">
              <div className="w-fit min-w-[350px] h-fit flex flex-row items-center justify-between">
                <p className="text-[14px] font-semibold">
                  {currentReview?.customer_username}
                </p>
                <button
                  className="w-[80px] h-fit flex flex-row items-center justify-center"
                  onClick={handleLikeReview}
                >
                  <AiFillLike
                    style={{
                      color: currentReview?.likes.medical_center_liked
                        ? "#3b82f6"
                        : "#9ca3af",
                    }}
                  />
                  <p
                    className={`text-[14px] font-semibold ml-1 ${
                      currentReview?.likes.medical_center_liked
                        ? "text-blue-500"
                        : ""
                    } `}
                  >
                    {currentReview?.likes.medical_center_liked
                      ? "Liked"
                      : "Like"}
                  </p>
                </button>
              </div>
              <div className="w-fit h-fit flex flex-row items-center justify-start">
                <FaStar style={{ color: "#fadb14" }} />
                <p className="text-[14px] ml-[5px]">
                  {currentReview?.rating_score.toFixed(1)}
                </p>
              </div>
            </div>
          </div>
          <div className="w-full h-fit mt-[20px]">
            <p className="text-[14px] font-semibold mb-[5px]">Description:</p>
            <p className="text-[14px]">{currentReview?.description}</p>
          </div>
          {currentReview?.reply ? (
            <div className="w-full h-fit py-[20px] border-t-2 border-solid border-gray-300 mt-[20px]">
              <div className="w-full h-fit flex flex-row items-center justify-between">
                <p className="text-[14px] font-semibold mb-[5px]">My reply:</p>
                <div className="w-[100px] h-fit flex flex-row items-center justify-between">
                  <button className="w-[50xp] h-[30px]">
                    <p
                      className="text-[13px] font-semibold"
                      onClick={() => {
                        setMyReply(currentReview.reply);
                        setEditable(true);
                      }}
                    >
                      Edit
                    </p>
                  </button>
                  <Popconfirm
                    title="Delete the reply"
                    description="Are you sure to delete this reply?"
                    onConfirm={handleDeleteReply}
                    okText="Yes"
                    cancelText="No"
                  >
                    <button className="w-[50xp] h-[30px]">
                      <p className="text-[13px] font-semibold text-red-500">
                        Delete
                      </p>
                    </button>
                  </Popconfirm>
                </div>
              </div>
              {editable ? (
                <TextArea
                  rows={5}
                  defaultValue={myReply}
                  onChange={(e) => setMyReply(e.target.value)}
                  className="mt-[10px]"
                />
              ) : (
                <p className="text-[14px mt-[10px]">{currentReview?.reply}</p>
              )}
              {editable ? (
                <div className="w-full h-fit flex flex-row items-center justify-end mt-[10px]">
                  <Button
                    type="primary"
                    onClick={handleEditReply}
                    disabled={myReply === ""}
                  >
                    Update
                  </Button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="w-full h-fit mt-[20px]">
              <div className="w-full h-fit flex flex-row items-center justify-start">
                <p className="text-[14px] font-semibold mb-[5px]">My reply:</p>
              </div>
              <TextArea rows={5} onChange={(e) => setMyReply(e.target.value)} />
              <div className="w-full h-fit flex flex-row items-center justify-end mt-[10px]">
                <Button
                  type="primary"
                  onClick={handleReply}
                  disabled={myReply === ""}
                >
                  Reply
                </Button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default MedicalCenterDashboard;
