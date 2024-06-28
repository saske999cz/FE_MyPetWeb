import React, { Fragment, useEffect, useState } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import {
  FaClockRotateLeft,
  FaPlus,
  FaProductHunt,
  FaStar,
  FaUserDoctor,
} from "react-icons/fa6";
import { Button, Divider, Table, Tooltip, Modal } from "antd";
import { FaEye, FaSearch, FaTrash, FaTrashRestore } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Search from "antd/es/input/Search";
import "./DoctorList.scss";
import { toast } from "react-toastify";
import AuthUser from "../../../../utils/AuthUser";
import Column from "antd/es/table/Column";
import Swal from "sweetalert2";
import { BeatLoader } from "react-spinners";
import { storage } from "../../../../utils/firebase";
import { getDownloadURL, listAll, ref } from "firebase/storage";
import { LazyLoadImage } from "react-lazy-load-image-component";
import loadingImg from "../../../../assets/images/loading.png";
import { useAuth } from "../../../../utils/AuthContext";
import moment from "moment";

function BoxWrapper({
  children,
  className,
  menuPosition = "bottom-0 right-4",
  isLastCard = false,
}) {
  return (
    <div
      className={`relative rounded-lg p-4 flex-1 flex items-center justify-between shadow-lg ${className}`}
    >
      {children}
      <Menu as="div" className={`absolute ${menuPosition}`}>
        <MenuButton className="inline-flex justify-center w-10 h-10 text-gray-500 hover:text-gray-700">
          {isLastCard ? (
            <HiOutlineDotsHorizontal className="w-6 h-6" />
          ) : (
            <HiOutlineDotsVertical className="w-6 h-6" />
          )}
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
          <MenuItems className="absolute right-0 w-44 -mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            <div className="py-1">
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={`${
                      focus ? "bg-gray-100" : ""
                    } flex items-center gap-2 p-2 text-sm text-gray-700 w-full`}
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

const DoctorList = () => {
  const { http } = AuthUser();
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const TOOLTIP_MESSAGE = "Need to combine with other * to search";

  const [loading, setLoading] = useState(true);
  const [searchDoctorInput, setSearchDoctorInput] = useState("");
  const [searchDeletedDoctorInput, setSearchDeletedDoctorInput] = useState("");

  const handleClickCreateButton = () => {
    navigate("/dashboard/doctor-create");
  };

  // --------------     PAGINATION STATE     --------------
  const DEFAULT_CURRENT_PAGE_NUMBER = 1;
  const DEFAULT_PAGE_SIZE_NUMBER = 10;
  const allPageSize = [10, 20, 30];

  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE_NUMBER);
  const [currentPageDeleted, setCurrentPageDeleted] = useState(
    DEFAULT_CURRENT_PAGE_NUMBER
  );
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE_NUMBER);
  const [pageSizeDeleted, setPageSizeDeleted] = useState(
    DEFAULT_PAGE_SIZE_NUMBER
  );

  const [listDoctors, setListDoctors] = useState([]);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [listDeletedDoctors, setListDeletedDoctors] = useState([]);
  const [totalDeletedDoctors, setTotalDeletedDoctors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleCloseDetailModal = () => {
    setIsModalOpen(false);
    setCurrentDoctor(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteDoctor = async () => {
    setIsDeleteModalOpen(false);
    try {
      const response = await http.delete(
        `/medical-center/doctors/${currentDoctor.doctor_id}`
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: response.data.message,
        }).then(() => {
          navigate(0);
        });
        setListDeletedDoctors([...listDeletedDoctors, currentDoctor]);
        setListDoctors(
          listDoctors.filter((doctor) => doctor.id !== currentDoctor.id)
        );
        setCurrentDoctor(null);
      }
    } catch (error) {
      console.log(error);
    }
  };
  // --------------     SEARCH PRODUCT     --------------
  const handleSearchDoctor = (e) => {
    setSearchDoctorInput(e.target.value);
  };

  const handleSearchDeletedDoctor = (e) => {
    setSearchDeletedDoctorInput(e.target.value);
  };

  const onSearch = async () => {
    setCurrentPage(DEFAULT_CURRENT_PAGE_NUMBER);
    setPageSize(DEFAULT_PAGE_SIZE_NUMBER);
    try {
      const response = await http.get(
        `/medical-center/doctors/search?page_number=${DEFAULT_CURRENT_PAGE_NUMBER}&num_of_page=${DEFAULT_PAGE_SIZE_NUMBER}search_term=${searchDoctorInput}`
      );
      const doctortData = response.data.data;
      const doctorsImagesPromises = doctortData.map(async (doctor) => {
        const url = await fetchImages(doctor.image); // This will either be the URL or null
        return { ...doctor, image_url: url };
      });

      const doctorWithImages = await Promise.all(doctorsImagesPromises);
      setListDoctors(doctorWithImages);
    } catch (error) {
      console.log(error);
    }
  };

  const onSearchDeleted = async () => {
    setCurrentPage(DEFAULT_CURRENT_PAGE_NUMBER);
    setPageSize(DEFAULT_PAGE_SIZE_NUMBER);
    try {
      const response = await http.get(
        `/medical-center/doctors/search-deleted?page_number=${DEFAULT_CURRENT_PAGE_NUMBER}&num_of_page=${DEFAULT_PAGE_SIZE_NUMBER}search_term=${searchDoctorInput}`
      );
      const doctortData = response.data.data;
      const doctorsImagesPromises = doctortData.map(async (doctor) => {
        const url = await fetchImages(doctor.image); // This will either be the URL or null
        return { ...doctor, image_url: url };
      });

      const doctorWithImages = await Promise.all(doctorsImagesPromises);
      setListDeletedDoctors(doctorWithImages);
    } catch (error) {
      console.log(error);
    }
  };

  // --------------     ACTION HANDLER     --------------
  const handleViewProduct = (record) => {
    navigate(`/dashboard/product-view/${record.id}`);
  };

  const handleRestoreDoctor = (record) => {
    const doctorId = record.doctor_id;
    Swal.fire({
      title: "Restore",
      text: "Want to restore this doctor account?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#3085d6",
      cancelButtonText: "Cancel",
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        http
          .put(`/medical-center/doctors/${doctorId}/restore`)
          .then((resolve) => {
            if (resolve.status === 404) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: resolve.data.message,
              });
            } else if (resolve.status === 200) {
              Swal.fire({
                icon: "success",
                title: resolve.data.message,
                text: `Please check at doctors table`,
              }).then(() => {
                navigate(0);
              });
            }
          })
          .catch((reject) => {
            console.log(reject);
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong. Try again",
            });
          });
      }
    });
  };

  // --------------------------     Paginate     --------------------------
  const handleClickPaginate = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  };

  const handleShowSizeChange = (currentPage, pageSize) => {
    setCurrentPage(currentPage);
    setPageSize(pageSize);
  };

  // DELETED PRODUCTS
  const handleClickPaginateDeleted = (page, pageSize) => {
    setCurrentPageDeleted(page);
    setPageSizeDeleted(pageSize);
  };

  const handleShowSizeChangeDeleted = (currentPage, pageSize) => {
    setCurrentPageDeleted(currentPage);
    setPageSizeDeleted(pageSize);
  };

  // --------------------------     Fetch API     ----------------------------

  // --------------------------     Fetch Firebase Image     --------------------------
  const fetchImages = async (imagePath) => {
    try {
      const imageRef = ref(storage, imagePath);
      console.log("imagepath:", imagePath);
      const res = await listAll(imageRef);
      if (res.items.length > 0) {
        const url = await getDownloadURL(res.items[0]);
        return url;
      }
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // --------------------------     Fetch Filter API     --------------------------
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await http.get(
          `/medical-center/doctors/paging?page_number=${currentPage}&num_of_page=${pageSize}`
        );

        const doctortData = response.data.data;
        setTotalDoctors(response.data.total_doctors);

        const doctorsImagesPromises = doctortData.map(async (doctor) => {
          const url = await fetchImages(doctor.image); // This will either be the URL or null
          return { ...doctor, image_url: url };
        });

        const doctorWithImages = await Promise.all(doctorsImagesPromises);

        setListDoctors(doctorWithImages);
        setLoading(false);

        toast.success("Successfully fetched doctors", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: "colored",
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, accessToken]);

  // --------------------------     Fetch Deleted Products API     --------------------------
  useEffect(() => {
    const fetchDeletedDoctors = async () => {
      try {
        const response = await http.get(
          `/medical-center/doctors/deleted/paging?page_number=${currentPageDeleted}&num_of_page=${pageSizeDeleted}`
        );

        const doctortData = response.data.data;
        setTotalDeletedDoctors(response.data.total_doctors);

        const doctorsImagesPromises = doctortData.map(async (doctor) => {
          const url = await fetchImages(doctor.image); // This will either be the URL or null
          return { ...doctor, image_url: url };
        });

        const doctorWithImages = await Promise.all(doctorsImagesPromises);
        setListDeletedDoctors(doctorWithImages);
        setLoading(false);
        toast.success("Successfully fetched doctors", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: "colored",
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchDeletedDoctors();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageDeleted, pageSizeDeleted, accessToken]);

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
      <div className="flex flex-row justify-between items-center gap-10 mt-4">
        <BoxWrapper className="bg-gradient-to-t from-blue-600 to-blue-400 text-white">
          <div className="flex flex-col items-start justify-between w-full pl-2">
            <div className="flex items-center">
              <strong className="text-2xl font-bold">{totalDoctors}</strong>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-semibold">Total Doctors</span>
            </div>
          </div>
          <div className="absolute -top-6 right-5 text-blue-300">
            <FaUserDoctor size={50} />
          </div>
        </BoxWrapper>
      </div>
      <div className="flex flex-col items-start justify-between bg-white p-6 rounded-md">
        <div className="flex flex-row items-start justify-end w-full mb-6">
          <button
            onClick={handleClickCreateButton}
            className="flex flex-row items-center gap-2 px-4 py-2 bg-blue-600 rounded-md hover:opacity-80 transition duration-300"
          >
            <FaPlus size={18} style={{ color: "white" }} />
            <p className="text text-[16] text-white">Create</p>
          </button>
        </div>
        <Divider orientation="left">
          <div className="flex flex-row gap-2 items-center">
            <FaProductHunt />
            <span className="text-gray-800 font-bold text-md">Doctors</span>
          </div>
        </Divider>
        <div className="flex flex-row items-center w-full gap-6 mb-6">
          <div className="flex flex-col items-start w-full">
            <div className="flex flex-row items-center gap-1">
              <FaSearch />
              <Tooltip title={TOOLTIP_MESSAGE}>
                <p className="text-md font-semibold">
                  SEARCH BY <span className="text-red-600">*</span>
                </p>
              </Tooltip>
            </div>
            <Search
              className="mt-2"
              placeholder="Search Doctors"
              enterButton={
                <Button
                  type="primary"
                  disabled={searchDoctorInput.trim() === ""}
                >
                  Search
                </Button>
              }
              size="large"
              onSearch={onSearch}
              onChange={handleSearchDoctor}
              value={searchDoctorInput}
            />
          </div>
        </div>
        {/* PRODUCTS */}
        <div className="w-full">
          <Table
            bordered
            dataSource={listDoctors}
            pagination={{
              defaultCurrent: DEFAULT_CURRENT_PAGE_NUMBER,
              defaultPageSize: DEFAULT_PAGE_SIZE_NUMBER,
              hideOnSinglePage: true,
              current: currentPage,
              pageSizeOptions: allPageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              total: totalDoctors,
              showTotal: (totalProducts) => `Total ${totalProducts} products`,
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
              dataIndex="doctor_id"
              render={(text, _) => {
                return <span>#{text}</span>;
              }}
            />
            <Column
              align="left"
              title="Full Name"
              key="full_name"
              dataIndex="full_name"
              render={(text, record, index) => {
                return (
                  <div className="flex flex-row items-center gap-3">
                    <LazyLoadImage
                      key={index}
                      src={record.image_url}
                      alt={`Product ${index}`}
                      className="w-10 h-10 bg-white border-neutral-300 border-2 rounded-md p-1 object-cover"
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
              title="Gender"
              key="gender"
              dataIndex="gender"
              render={(text, record) =>
                record.gender.charAt(0).toUpperCase() + record.gender.slice(1)
              }
            />
            <Column
              align="left"
              title="Rating"
              key="rating"
              dataIndex="rating"
              width={110}
              render={(text, record) => {
                return (
                  <div className="flex flex-row gap-2 items-center">
                    <FaStar style={{ color: "#fadb14" }} />
                    <p className="text-sm font-bold">{record.rating}</p>
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
                      setCurrentDoctor(record);
                      setIsModalOpen(true);
                    }}
                    className="bg-purple-200 rounded-md p-1.5"
                  >
                    <FaEye size={18} className="text-purple-600" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentDoctor(record);
                      setIsDeleteModalOpen(true);
                    }}
                    className="bg-red-200 rounded-md p-1.5"
                  >
                    <FaTrash size={18} className="text-red-600" />
                  </button>
                </div>
              )}
            />
          </Table>
        </div>
        {/* DIVIDE LINE */}
        <Divider orientation="left">
          <div className="flex flex-row gap-2 items-center">
            <FaTrash />
            <span className="text-gray-800 font-bold text-md">
              Deleted Doctors
            </span>
          </div>
        </Divider>
        {/* DELETED PRODUCTS */}
        <div className="flex flex-row items-center w-full gap-6 mb-6">
          <div className="flex flex-col items-start w-full">
            <div className="flex flex-row items-center gap-1">
              <FaSearch />
              <Tooltip title={TOOLTIP_MESSAGE}>
                <p className="text-md font-semibold">
                  SEARCH BY <span className="text-red-600">*</span>
                </p>
              </Tooltip>
            </div>
            <Search
              className="mt-2"
              placeholder="Search Deleted Doctors"
              enterButton={
                <Button
                  type="primary"
                  disabled={searchDeletedDoctorInput.trim() === ""}
                >
                  Search
                </Button>
              }
              size="large"
              onSearch={onSearchDeleted}
              onChange={handleSearchDeletedDoctor}
              value={searchDeletedDoctorInput}
            />
          </div>
        </div>
        <div className="w-full">
          <Table
            bordered
            dataSource={listDeletedDoctors}
            pagination={{
              defaultCurrent: DEFAULT_CURRENT_PAGE_NUMBER,
              defaultPageSize: DEFAULT_PAGE_SIZE_NUMBER,
              hideOnSinglePage: true,
              current: currentPageDeleted,
              pageSizeOptions: allPageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              total: totalDeletedDoctors,
              showTotal: (totalDeletedProducts) =>
                `Total ${totalDeletedProducts} products`,
              onChange: handleClickPaginateDeleted,
              onShowSizeChange: handleShowSizeChangeDeleted,
            }}
          >
            <Column
              align="left"
              title="No."
              key="no."
              render={(text, record, index) => (
                <span className="font-semibold">
                  {currentPageDeleted * DEFAULT_PAGE_SIZE_NUMBER -
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
              dataIndex="id"
              render={(text, _) => {
                return (
                  <Link
                    to={`/dashboard/product-view/${text}`}
                    className="font-semibold text-blue-500"
                  >
                    <span>#{text}</span>
                  </Link>
                );
              }}
            />
            <Column
              align="left"
              title="Full Name"
              key="full_name"
              dataIndex="full_name"
              render={(text, record, index) => {
                return (
                  <div className="flex flex-row items-center gap-3">
                    <LazyLoadImage
                      key={index}
                      src={record.image_url}
                      alt={`Product Deleted ${index}`}
                      className="w-10 h-10 bg-white border-neutral-300 border-2 rounded-md p-1 object-cover"
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
              title="Gender"
              key="Gender"
              dataIndex="gender"
              render={(text, record) => record.gender}
            />
            <Column
              align="left"
              title="Rating"
              key="rating"
              dataIndex="rating"
              render={(text, record) => {
                return (
                  <div className="flex flex-row gap-2 items-center">
                    <FaStar style={{ color: "#fadb14" }} />
                    <p className="text-sm font-bold">{record?.rating}</p>
                  </div>
                );
              }}
            />
            <Column
              align="left"
              title="Deleted at"
              key="deleted_at"
              dataIndex="deleted_at"
              render={(text, record) => {
                return (
                  <span>
                    {moment(record.deleted_at).format("MMM D YYYY - h:mmA")}
                  </span>
                );
              }}
            />
            <Column
              align="center"
              title="Action"
              key="action"
              render={(_, record) => (
                <div className="flex flex-row items-center justify-evenly space-x-2 w-full my-1">
                  <button
                    onClick={() => handleViewProduct(record)}
                    className="bg-purple-200 rounded-md p-1.5"
                  >
                    <FaEye size={18} className="text-purple-600" />
                  </button>
                  <button
                    onClick={() => handleRestoreDoctor(record)}
                    className="bg-green-200 rounded-md p-1.5"
                  >
                    <FaTrashRestore size={18} className="text-green-600" />
                  </button>
                </div>
              )}
            />
          </Table>
        </div>
      </div>
      <Modal
        title="Doctor Detail"
        open={isModalOpen}
        footer={null}
        onCancel={handleCloseDetailModal}
      >
        <div className="w-full min-w-[470px] h-fit min-h-[200px]">
          <div className="w-full h-[40px] flex flex-row items-center justify-start px-[5px] mt-[20px]">
            <LazyLoadImage
              src={currentDoctor?.image_url}
              alt={`Reivew detail`}
              className="w-[40px] h-[40px] bg-white object-cover rounded-[10px]"
              effect="blur"
              placeholderSrc={loadingImg}
            />
            <div className="w-fit min-w-[400px] h-fit flex flex-col items-start justify-start ml-[20px]">
              <div className="w-fit min-w-[350px] h-fit flex flex-row items-center justify-between">
                <p className="text-[14px] font-semibold">
                  Dr.{" " + currentDoctor?.full_name}
                </p>
              </div>
              <div className="w-fit h-fit flex flex-row items-center justify-start">
                <FaStar style={{ color: "#fadb14" }} />
                <p className="text-[14px] ml-[5px]">{currentDoctor?.rating}</p>
              </div>
            </div>
          </div>
          <div className="w-full h-fit mt-[20px]">
            <p className="text-[14px] font-semibold mb-[5px]">Description:</p>
            <p className="text-[14px]">{currentDoctor?.description}</p>
          </div>
        </div>
      </Modal>
      <Modal
        title="Are you sure you want to delete this doctor?"
        open={isDeleteModalOpen}
        onCancel={handleCloseDeleteModal}
        onOk={handleDeleteDoctor}
        okText="Yes"
        cancelText="No"
        okType="danger"
      ></Modal>
    </div>
  );
};

export default DoctorList;
