/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { LazyLoadImage } from "react-lazy-load-image-component";
import loadingImg from "../../../assets/images/loading.png";
import { FaProductHunt, FaStar } from "react-icons/fa6";
import { AiFillLike } from "react-icons/ai";
import AuthUser from "../../../utils/AuthUser";
import { toast } from "react-toastify";
import Column from "antd/es/table/Column";
import { FaEye } from "react-icons/fa";
import { Divider, Input, Button, Table, Modal, Popconfirm } from "antd";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "../../../utils/firebase";
import { BeatLoader } from "react-spinners";

const DoctorDashboard = () => {
  const { http } = AuthUser();
  const [loading, setLoading] = useState(true);
  const { TextArea } = Input;

  const DEFAULT_CURRENT_PAGE_NUMBER = 1;
  const DEFAULT_PAGE_SIZE_NUMBER = 10;
  const allPageSize = [10, 20, 30];

  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE_NUMBER);

  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE_NUMBER);

  const [totalReviews, setTotalReviews] = useState(0); // Fetch total products state

  const [reviews, setReviews] = useState([]);
  const [currentReview, setCurrentReview] = useState();
  const [myReply, setMyReply] = useState("");

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
        `/doctor/ratings/${currentReview.rating_id}/reply`,
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
      const response = await http.put(
        `/doctor/ratings/${currentReview.rating_id}/reply`,
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
        `/doctor/ratings/${currentReview.rating_id}/reply`
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
      if (currentReview.likes.doctor_liked === false) {
        const response = await http.post(
          `/doctor/ratings/${currentReview.rating_id}/like`
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
              doctor_liked: true,
            },
          });
        }
      } else {
        const response = await http.post(
          `/doctor/ratings/${currentReview.rating_id}/unlike`
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
              doctor_liked: false,
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
          `/doctor/ratings/paging?page_number=${currentPage}&num_of_page=${pageSize}`
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
                      color: currentReview?.likes.doctor_liked
                        ? "#3b82f6"
                        : "#9ca3af",
                    }}
                  />
                  <p
                    className={`text-[14px] font-semibold ml-1 ${
                      currentReview?.likes.doctor_liked ? "text-blue-500" : ""
                    } `}
                  >
                    {currentReview?.likes.doctor_liked ? "Liked" : "Like"}
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

export default DoctorDashboard;
