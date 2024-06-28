import React, { Fragment, useEffect, useState, useContext } from "react";
import {
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Transition,
} from "@headlessui/react";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaClockRotateLeft, FaProductHunt } from "react-icons/fa6";
import { Divider, Table, Tooltip, Modal, DatePicker } from "antd";
import { MdOutlinePets } from "react-icons/md";
import {
  FaEye,
  FaClipboardList,
  FaCalendarAlt,
  FaTrash,
  FaStethoscope,
} from "react-icons/fa";
import { toast } from "react-toastify";
import AuthUser from "../../../utils/AuthUser";
import Column from "antd/es/table/Column";
import { BeatLoader } from "react-spinners";
import { storage } from "../../../utils/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { LazyLoadImage } from "react-lazy-load-image-component";
import loadingImg from "../../../assets/images/loading.png";
import moment from "moment";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../../context/DataProvider";

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

const AppointmentListOfDoctor = () => {
  const { http } = AuthUser();
  const TOOLTIP_MESSAGE = "Need to combine with other * to search";
  const listFilter = ["Waiting", "Done"];
  const [filter, setFilter] = useState("Waiting");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  // --------------     PAGINATION STATE     --------------
  const DEFAULT_CURRENT_PAGE_NUMBER = 1;
  const DEFAULT_PAGE_SIZE_NUMBER = 10;
  const allPageSize = [10, 20, 30];

  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE_NUMBER);

  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE_NUMBER);

  const [listAppointments, setListAppointments] = useState([]);
  const [totalAppointments, setTotalAppointments] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [appointmentToExecute, setAppointmentToExecute] = useState(null);
  const [appointmentToDelete, setAppointmentToDelete] = useState(null);
  const [currentDate, setCurrentDate] = useState(moment().format("YYYY-MM-DD"));
  const [isDetailFetching, setIsDetailFetching] = useState(false);
  const { setData } = useContext(DataContext);

  const handleCloseDetailModal = () => {
    setIsModalOpen(false);
    setCurrentAppointment(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  const handleDeleteAppointment = async () => {
    setIsDeleteModalOpen(false);
    try {
      const response = await http.delete(
        `/doctor/appointments/${appointmentToDelete.id}`
      );
      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: response.data.message,
        }).then(() => {
          navigate(0);
        });
        setListAppointments(
          listAppointments.filter(
            (appointment) => appointment.id !== appointmentToDelete.id
          )
        );
        setCurrentAppointment(null);
        setAppointmentToDelete(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const executeAppointment = async () => {
    const response = await http.get(
      `/doctor/appointments/${appointmentToExecute.id}`
    );
    const appointmentData = response.data.data;
    const pet_url = await fetchImages(appointmentData.pet.image);
    setData({
      ...appointmentData,
      pet: { ...appointmentData.pet, image_url: pet_url },
      customer: {
        ...appointmentToExecute.customer,
        account: {
          ...appointmentToExecute.customer.account,
          image_url: appointmentToExecute.customer.account.image_url,
        },
      },
    });
    navigate("/dashboard/execute-appointment");
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
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

  const handleDateChange = (date) => {
    if (date === null) setCurrentDate(moment().format("YYYY-MM-DD"));
    else setCurrentDate(date.format("YYYY-MM-DD"));
  };

  // --------------------------     Fetch API     ----------------------------

  // --------------------------     Fetch Firebase Image     --------------------------
  const fetchImages = async (imagePath) => {
    try {
      const imageRef = ref(storage, imagePath);
      console.log("imagepath:", imagePath);
      const url = await getDownloadURL(imageRef);
      return url;
    } catch (error) {
      console.log(error);
      return null;
    }
  };

  // --------------------------     Fetch Filter API     --------------------------
  useEffect(() => {
    const fetchAppointments = async () => {
      let endpoint = "";
      if (filter === "Waiting") {
        endpoint = `/doctor/appointments/waiting?page_number=${currentPage}&num_of_page=${pageSize}&date=${currentDate}`;
      } else if (filter === "Done") {
        endpoint = `/doctor/appointments/done?page_number=${currentPage}&num_of_page=${pageSize}&date=${currentDate}`;
      }
      try {
        const response = await http.get(endpoint);

        const appointmentData = response.data.data;
        setTotalAppointments(response.data.total_appointments);

        const doctorsImagesPromises = appointmentData.map(
          async (appointment) => {
            const url = await fetchImages(appointment.customer.account.avatar); // This will either be the URL or null
            return {
              ...appointment,
              customer: {
                ...appointment.customer,
                account: { ...appointment.customer.account, image_url: url },
              },
            };
          }
        );
        const appointmentDoctorWithImages = await Promise.all(
          doctorsImagesPromises
        );
        setListAppointments(appointmentDoctorWithImages);
        setLoading(false);

        toast.success("Successfully fetched appointments", {
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

    fetchAppointments();
  }, [currentPage, pageSize, filter, currentDate]);

  useEffect(() => {
    if (isDetailFetching === true) {
      const fetchAppointmentDetail = async () => {
        try {
          const response = await http.get(
            `/doctor/appointments/${currentAppointment.id}`
          );
          const appointmentData = response.data.data;
          const pet_url = await fetchImages(appointmentData.pet.image);
          setCurrentAppointment({
            ...appointmentData,
            pet: { ...appointmentData.pet, image_url: pet_url },
            customer: {
              ...currentAppointment.customer,
              account: {
                ...currentAppointment.customer.account,
                image_url: currentAppointment.customer.account.image_url,
              },
            },
          });
          setData({
            ...appointmentData,
            pet: { ...appointmentData.pet, image_url: pet_url },
            customer: {
              ...currentAppointment.customer,
              account: {
                ...currentAppointment.customer.account,
                image_url: currentAppointment.customer.account.image_url,
              },
            },
          });
          setIsDetailFetching(false);
        } catch (error) {
          console.log(error);
        }
      };
      fetchAppointmentDetail();
    }
  }, [isDetailFetching]);

  return loading ? (
    <div className="h-full">
      <BeatLoader
        className="relative top-1/2 transform -translate-y-1/2"
        color="#2463eb"
        size={36}
      />
    </div>
  ) : (
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between items-center gap-10 mt-4">
        <BoxWrapper className="bg-gradient-to-t from-blue-600 to-blue-400 text-white">
          <div className="flex flex-col items-start justify-between w-full pl-2">
            <div className="flex items-center">
              <strong className="text-2xl font-bold">
                {totalAppointments}
              </strong>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-semibold">Total Appointments</span>
            </div>
          </div>
          <div className="absolute -top-6 right-5 text-blue-300">
            <FaClipboardList size={50} />
          </div>
        </BoxWrapper>
      </div>
      <div className="flex flex-col items-start justify-between bg-white p-6 rounded-md">
        <Divider orientation="left">
          <div className="flex flex-row gap-2 items-center">
            <FaProductHunt />
            <span className="text-gray-800 font-bold text-md">
              Appointments
            </span>
          </div>
        </Divider>
        <div className="flex flex-row items-center w-full gap-6 mb-6">
          <div className="flex flex-col items-start">
            <div className="flex flex-row items-center gap-1">
              <MdOutlinePets />
              <Tooltip title={TOOLTIP_MESSAGE}>
                <p className="text-md font-semibold">
                  FILTER BY <span className="text-red-600">*</span>
                </p>
              </Tooltip>
            </div>
            <select
              className="minimal w-48 mt-2 h-10 px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:cursor-pointer hover:border-blue-500 transition duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none text-left"
              value={filter}
              onChange={handleFilterChange}
            >
              {listFilter.map((item, index) => (
                <option key={index} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col items-start h-full">
            <div className="flex flex-row items-center gap-1">
              <FaCalendarAlt />
              <Tooltip title="Filter by date">
                <p className="text-md font-semibold">
                  DATE <span className="text-red-600">*</span>
                </p>
              </Tooltip>
            </div>
            <DatePicker
              className="mt-2 h-10 w-60"
              onChange={handleDateChange}
            />
          </div>
        </div>
        {/* PRODUCTS */}
        <div className="w-full">
          <Table
            bordered
            dataSource={listAppointments}
            pagination={{
              defaultCurrent: DEFAULT_CURRENT_PAGE_NUMBER,
              defaultPageSize: DEFAULT_PAGE_SIZE_NUMBER,
              hideOnSinglePage: true,
              current: currentPage,
              pageSizeOptions: allPageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              total: totalAppointments,
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
              dataIndex="id"
              render={(text, _) => {
                return <span>#{text}</span>;
              }}
            />
            <Column
              align="center"
              title="Full Name"
              key="full_name"
              dataIndex="full_name"
              render={(text, record, index) => {
                return (
                  <div className="flex flex-row items-center gap-3 items-center justify-start">
                    <LazyLoadImage
                      key={index}
                      src={record.customer.account.image_url}
                      alt={`Product ${index}`}
                      className="w-10 h-10 bg-white border-neutral-300 border-2 rounded-md p-1 object-cover"
                      effect="blur"
                      placeholderSrc={loadingImg}
                    />
                    <span className="font-semibold">
                      {record.customer.full_name}
                    </span>
                  </div>
                );
              }}
            />
            <Column
              align="left"
              title="Gender"
              key="gender"
              dataIndex="gender"
              render={(text, record) => record.customer.gender}
            />
            <Column
              align="center"
              title="Date"
              key="date"
              dataIndex="start_time"
              width={200}
              render={(text, record) => {
                return (
                  <div className="flex flex-row gap-2 items-center justify-center">
                    <p className="text-sm">
                      {moment(record.start_time).format("MMM D YYYY - h:mmA")}
                    </p>
                  </div>
                );
              }}
            />
            <Column
              align="center"
              title="Status"
              key="done"
              dataIndex="done"
              width={110}
              render={(text, record) => {
                return (
                  <div
                    className={`flex flex-row gap-2 items-center justify-center rounded-md ${
                      record.done === 0 && record.deleted_at === null
                        ? "bg-green-400"
                        : record.done === 1
                        ? "bg-blue-400"
                        : "bg-red-400"
                    }`}
                  >
                    <p
                      className={`text-sm font-bold ${
                        record.done === 0 && record.deleted_at === null
                          ? "text-green-700"
                          : record.done === 1
                          ? "text-blue-700"
                          : "text-red-700"
                      }`}
                    >
                      {record.done === 0 && record.deleted_at === null
                        ? "Waiting"
                        : record.done === 1
                        ? "Done"
                        : "Cancelled"}
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
                      setCurrentAppointment(record);
                      setIsDetailFetching(true);
                      setIsModalOpen(true);
                    }}
                    className="bg-purple-200 rounded-md p-1.5"
                  >
                    <FaEye size={18} className="text-purple-600" />
                  </button>
                  <button
                    onClick={() => {
                      setAppointmentToExecute(record);
                      executeAppointment();
                    }}
                    className="bg-blue-200 rounded-md p-1.5"
                  >
                    <FaStethoscope size={18} className="text-blue-600" />
                  </button>
                  <button
                    onClick={() => {
                      setAppointmentToDelete(record);
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
      </div>
      <Modal
        title="Appointment Detail"
        open={isModalOpen}
        footer={null}
        onCancel={handleCloseDetailModal}
      >
        {isDetailFetching ? (
          <div className="h-[200px] mt-[50px]">
            <BeatLoader
              className="relative top-1/2 transform -translate-y-1/2"
              color="#2463eb"
              size={36}
            />
          </div>
        ) : (
          <div className="w-full min-w-[470px] h-fit min-h-[200px]">
            <div className="w-full h-[40px] flex flex-row items-center justify-start px-[5px] mt-[20px]">
              <LazyLoadImage
                src={currentAppointment?.customer.account.image_url}
                alt={`Customer detail`}
                className="w-[40px] h-[40px] bg-white object-cover rounded-[10px]"
                effect="blur"
                placeholderSrc={loadingImg}
                id="customer-detail"
              />
              <div className="w-fit min-w-[400px] h-fit flex flex-col items-start justify-start ml-[20px]">
                <div className="w-fit min-w-[350px] h-fit flex flex-row items-center justify-between">
                  <p className="text-[14px] font-semibold">
                    {currentAppointment?.customer.full_name}
                  </p>
                </div>
                <p>Phone: {currentAppointment?.customer.phone}</p>
              </div>
            </div>
            <div className="w-full h-fit mt-[20px]">
              <p className="text-[14px] font-semibold mb-[5px]">Pet info:</p>
              <p className="text-[14px]">
                Name: {currentAppointment?.pet.name}
              </p>
              <p className="text-[14px]">
                Breed: {currentAppointment?.pet.breed.name}
              </p>
              <p>Gender: {currentAppointment?.pet.gender}</p>
              <p>Age: {currentAppointment?.pet.age}</p>
              <LazyLoadImage
                src={currentAppointment?.pet.image_url}
                alt={`Reivew detail`}
                className="w-[490px] h-[380px] bg-white object-cover object-center rounded-[10px] mt-[20px]"
                effect="blur"
                placeholderSrc={loadingImg}
                id="pet-detail"
              />
            </div>
          </div>
        )}
      </Modal>
      <Modal
        title="Are you sure you want to cancel this appointment?"
        open={isDeleteModalOpen}
        onCancel={handleCloseDeleteModal}
        onOk={handleDeleteAppointment}
        okText="Yes"
        cancelText="No"
        okType="danger"
      ></Modal>
    </div>
  );
};

export default AppointmentListOfDoctor;
