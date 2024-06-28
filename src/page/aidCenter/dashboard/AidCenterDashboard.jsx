import React, { Fragment, useEffect, useState } from 'react';
import classNames from 'classnames';
import requestLogo from '../../../assets/images/request_logo.png'
import animalShelterLogo from '../../../assets/images/animal_shelter_logo.png'
import selledIcon from '../../../assets/images/selled.png'
import { HiOutlineTrendingDown, HiOutlineTrendingUp } from 'react-icons/hi';
import { IoBagHandle, IoPieChart, IoCart, IoStar } from 'react-icons/io5';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaClockRotateLeft, FaReplyAll } from "react-icons/fa6";
import AuthUser from '../../../utils/AuthUser';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Select } from 'antd';
import { Link } from 'react-router-dom';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { storage } from '../../../utils/firebase';
import { BeatLoader } from 'react-spinners';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import './AidCenterDashboard.scss';
import { getOrderStatus } from '../../../utils/statusLabel';
const { Option } = Select;

function BoxWrapper({
  children,
  className,
  menuPosition = 'bottom-0 right-4',
  isLastCard = false,
  banner,
  handleDateChange,
}) {
  return (
    <div className={`relative rounded-lg flex-1 flex items-center justify-between shadow-lg ${className}`}>
      {children}
      <Menu as="div" className={`absolute ${menuPosition}`}>
        <MenuButton className="inline-flex justify-center w-10 h-10 text-gray-500 hover:text-gray-700">
          {isLastCard ? (
            <></>
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
          <MenuItems className="absolute right-0 w-40 -mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
            <div className="py-1">
              <MenuItem>
                {({ focus }) => (
                  <button
                    className={`${focus ? 'bg-gray-100' : ''} flex items-center gap-2 p-2 text-sm text-gray-700 w-full`}
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
                    className={`${focus ? 'bg-gray-100' : ''} flex items-center gap-2 p-2 text-sm text-gray-700 w-full`}
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
                    className={`${focus ? 'bg-gray-100' : ''} flex items-center gap-2 p-2 text-sm text-gray-700 w-full`}
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
                    className={`${focus ? 'bg-gray-100' : ''} flex items-center gap-2 p-2 text-sm text-gray-700 w-full`}
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
const BANNER_ADOPT_REQUEST = 'Adopt Request'
const BANNER_NEW_PETS = 'New Pets'
const BANNER_ADOPTED_PETS = 'Adopted Pets'
const BANNER_UNADOPTED_PETS = 'Unadopted Pets'
const BANNER_ADOPT_REQUEST_LAST_WEEK = 'Adopt Request Last Week'

// --------------     FILTER OPTION     --------------
const FILTER_LAST_YEAR = 'Last year'
const FILTER_LAST_MONTH = 'Last month'
const FILTER_LAST_WEEK = 'Last week'
const FILTER_LAST_DAY = 'Last day'

const RADIAN = Math.PI / 180
const COLORS = ['#00C49F', '#0ba5e9', '#FF8042', '#FFBB28', '#D7107E']

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" className='font-semibold'>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

const AidCenterDashboard = () => {
  const { http } = AuthUser()
  const [loading, setLoading] = useState(true);

  const [adoptRequestOption, setAdoptRequestOption] = useState(FILTER_LAST_MONTH) // default option
  const [newPetsOption, setNewPetsOption] = useState(FILTER_LAST_MONTH) // default option
  const [adoptedPetOption, setAdoptedPetOption] = useState(FILTER_LAST_MONTH) // default option
  const [unadoptedPetOption, setUnadoptedPetOption] = useState(FILTER_LAST_MONTH) // default option

  const [adoptRequestBanner, setAdoptRequestBanner] = useState()
  const [newPetsBanner, setNewPetsBanner] = useState()
  const [adoptedPetBanner, setAdoptedPetBanner] = useState()
  const [unadoptedPetBanner, setUnadoptedPetBanner] = useState()
  const [adoptRequestLastWeek, setAdoptRequestLastWeek] = useState([])
  const [barAdoptRequest, setBarAdoptRequest] = useState([])
  const [barAdoptedPet, setBarAdoptedPet] = useState([])
  const [piePet, setPiePets] = useState([])
  const [recentAdoptRequest, setRecentAdoptRequests] = useState([])

  const [isFirstFetchAdoptRequest, setIsFirstFetchAdoptRequest] = useState(true);
  const [isFirstFetchNewPets, setIsFirstFetchNewPets] = useState(true);
  const [isFirstFetchAdoptedPet, setIsFirstFetchAdoptedPet] = useState(true);
  const [isFirstFetchUnadoptedPet, setIsFirstFetchUnadoptedPet] = useState(true);

  const currentYear = new Date().getFullYear();
  const barAdoptRequestYears = [currentYear, currentYear - 1, currentYear - 2];
  const barAdoptedPetYears = [currentYear, currentYear - 1, currentYear - 2];
  const [selectedBarAdoptRequestYear, setSelectedBarAdoptRequestYear] = useState(currentYear);
  const [selectedBarAdoptedPetYear, setSelectedBarAdoptedPetYear] = useState(currentYear);

  const handleDateChange = (banner, filterOption) => () => {
    console.log(banner, filterOption);
    // Thêm logic để cập nhật state tương ứng
    switch (banner) {
      case BANNER_ADOPT_REQUEST:
        setAdoptRequestOption(filterOption);
        break;
      case BANNER_NEW_PETS:
        setNewPetsOption(filterOption);
        break;
      case BANNER_ADOPTED_PETS:
        setAdoptedPetOption(filterOption);
        break;
      case BANNER_UNADOPTED_PETS:
        setUnadoptedPetOption(filterOption);
        break;
      default:
        break;
    }
  };

  const handleChangeBarAdoptRequestYear = (value) => {
    setSelectedBarAdoptRequestYear(value)
  };

  const handleChangeBarAdoptedPetYear = (value) => {
    setSelectedBarAdoptedPetYear(value)
  };

  // Get aid center address location
  useEffect(() => {
    const getCoords = async () => {
      try {
        const response = await http.get('/aid-center/profile/address')
        const address = response.data.data
        const results = await geocodeByAddress(address)
        const latLng = await getLatLng(results[0])

        localStorage.setItem('aidCenterAddress', address)
        localStorage.setItem('aidCenterCoords', JSON.stringify(latLng))
      } catch (error) {
        console.log(error)
        toast.error('Invalid address', {
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
    }

    getCoords()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // --------------------------     Fetch Firebase Image     --------------------------
  const fetchImages = (imagePath, callback) => {
    const fetchedImages = [];
    const imageRef = ref(storage, imagePath);
    listAll(imageRef)
      .then((response) => {
        const promises = response.items.map((item) =>
          getDownloadURL(item)
            .then((url) => {
              fetchedImages.push(url);
            })
            .catch((error) => {
              console.log(error);
            })
        );
        Promise.all(promises).then(() => {
          callback(fetchedImages);
        });
      })
      .catch((error) => {
        console.log(error);
        callback([]);
      });
  };

  // --------------------------     Fetch Banner Adopt Request API     --------------------------
  useEffect(() => {
    const fetchBannerAdoptRequest = async () => {
      try {
        const response = await http.get(`/aid-center/banner/adopt-request?option=${adoptRequestOption}`)
        setAdoptRequestBanner(response.data.data)
        if (!isFirstFetchAdoptRequest) {
          toast.success('Adopt request filter applied successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          })
        }
        setIsFirstFetchAdoptRequest(false);
      } catch (error) {
        console.log(error)
      }
    }

    fetchBannerAdoptRequest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adoptRequestOption])

  // --------------------------     Fetch Banner New Pet API     --------------------------
  useEffect(() => {
    const fetchNewPetsBanner = async () => {
      try {
        const response = await http.get(`/aid-center/banner/new-pets?option=${newPetsOption}`)
        setNewPetsBanner(response.data.data)
        if (!isFirstFetchNewPets) {
          toast.success('New pets filter applied successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          })
        }
        setIsFirstFetchNewPets(false);
      } catch (error) {
        console.log(error)
      }
    }

    fetchNewPetsBanner()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPetsOption])

  // --------------------------     Fetch Banner Adopted Pet API     --------------------------
  useEffect(() => {
    const fetchAdoptedPetBanner = async () => {
      try {
        const response = await http.get(`/aid-center/banner/adopted-pets?option=${adoptedPetOption}`)
        setAdoptedPetBanner(response.data.data)
        if (!isFirstFetchAdoptedPet) {
          toast.success('Adopted pets filter applied successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          })
        }
        setIsFirstFetchAdoptedPet(false);
      } catch (error) {
        console.log(error)
      }
    }

    fetchAdoptedPetBanner()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [adoptedPetOption])

  // --------------------------     Fetch Banner Unadopted Pet API     --------------------------
  useEffect(() => {
    const fetchUnadoptedPetBanner = async () => {
      try {
        const response = await http.get(`/aid-center/banner/unadopted-pets?option=${unadoptedPetOption}`)
        setUnadoptedPetBanner(response.data.data)
        if (!isFirstFetchUnadoptedPet) {
          toast.success('Unadopted pets filter applied successfully!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          })
        }
        setIsFirstFetchUnadoptedPet(false);
      } catch (error) {
        console.log(error)
      }
    }

    fetchUnadoptedPetBanner()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [unadoptedPetOption])

  // --------------------------     Fetch Banner Adopt Request Last Week API     --------------------------
  useEffect(() => {
    const fetchAdoptRequestLastWeek = async () => {
      try {
        const response = await http.get('/aid-center/banner/last-week-adopt-request')
        setAdoptRequestLastWeek(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchAdoptRequestLastWeek()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // --------------------------     Fetch Bar Adopt Request Count API     --------------------------
  useEffect(() => {
    const fetchBarAdoptRequest = async () => {
      try {
        const response = await http.get(`/aid-center/bar/adopt-request?year=${selectedBarAdoptRequestYear}`)
        setBarAdoptRequest(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchBarAdoptRequest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBarAdoptRequestYear])

  // --------------------------     Fetch Bar Adopted Pet Count API     --------------------------
  useEffect(() => {
    const fetchbarAdoptedPet = async () => {
      try {
        const response = await http.get(`/aid-center/bar/adopted-pets?year=${selectedBarAdoptedPetYear}`)
        setBarAdoptedPet(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchbarAdoptedPet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedBarAdoptedPetYear])

  // --------------------------     Fetch Pie Pets API     --------------------------
  useEffect(() => {
    const fetchPiePet = async () => {
      try {
        const response = await http.get('/aid-center/pie/pets')
        const data = response.data.data.map(item => ({
          name: item.type,
          value: item.total_quantity,
        }))
        setPiePets(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchPiePet()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchRecentAdoptRequest = async () => {
      try {
        const response = await http.get('/aid-center/adopt-request/pending?page_number=1&num_of_page=10')
        setRecentAdoptRequests(response.data.data)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    fetchRecentAdoptRequest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (loading) {
    return (
      <div className='h-full'>
        <BeatLoader className='relative top-1/2 transform -translate-y-1/2' color="#2463eb" size={36} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 flex-1">
          <BoxWrapper
            banner={BANNER_ADOPT_REQUEST}
            className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-white p-4"
            handleDateChange={handleDateChange}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-700">
                  <IoStar className="text-2xl text-white" />
                </div>
                <div className="pl-4 flex flex-col items-start">
                  <span className="text-sm font-light">Total Adopt Request</span>
                  <div className="flex items-center">
                    <strong className="text-2xl font-semibold">{adoptRequestBanner?.current_period_count}</strong>
                  </div>
                  <span className="text-sm">
                    {adoptRequestBanner?.percentage_change !== null && adoptRequestBanner?.percentage_change !== undefined
                      ? `${adoptRequestBanner.percentage_change.toFixed(0)}% ${adoptRequestOption}`
                      : 'N/A'}
                  </span>
                </div>
              </div>
              {(() => {
                if (adoptRequestBanner?.previous_period_count === undefined || adoptRequestBanner?.current_period_count === undefined) {
                  return null
                } else if (adoptRequestBanner.previous_period_count < adoptRequestBanner.current_period_count) {
                  return <HiOutlineTrendingUp className="text-yellow-900 opacity-50" size={100} />
                } else {
                  return <HiOutlineTrendingDown className="text-yellow-900 opacity-50" size={100} />
                }
              })()}
            </div>
          </BoxWrapper>
          <BoxWrapper
            banner={BANNER_NEW_PETS}
            className="bg-gradient-to-r from-green-600 to-green-400 text-white p-4"
            handleDateChange={handleDateChange}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-700">
                  <FaReplyAll className="text-2xl text-white" />
                </div>
                <div className="pl-4 flex flex-col items-start">
                  <span className="text-sm font-light">Total New Pets</span>
                  <div className="flex items-center">
                    <strong className="text-2xl font-semibold">{newPetsBanner?.current_period_count}</strong>
                  </div>
                  <span className="text-sm">
                    {newPetsBanner?.percentage_change !== null && newPetsBanner?.percentage_change !== undefined
                      ? `${newPetsBanner.percentage_change.toFixed(0)}% ${newPetsOption}`
                      : 'N/A'}
                  </span>
                </div>
              </div>
              {(() => {
                if (newPetsBanner?.previous_period_count === undefined || newPetsBanner?.current_period_count === undefined) {
                  return null
                } else if (newPetsBanner.previous_period_count < newPetsBanner.current_period_count) {
                  return <HiOutlineTrendingUp className="text-yellow-900 opacity-50" size={100} />
                } else {
                  return <HiOutlineTrendingDown className="text-yellow-900 opacity-50" size={100} />
                }
              })()}
            </div>
          </BoxWrapper>
          <BoxWrapper
            banner={BANNER_ADOPTED_PETS}
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4"
            handleDateChange={handleDateChange}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-blue-700">
                  <IoBagHandle className="text-2xl text-white" />
                </div>
                <div className="pl-4 flex flex-col items-start">
                  <span className="text-sm font-light">Total Adopted Pet</span>
                  <div className="flex items-center">
                    <strong className="text-2xl font-semibold">{adoptedPetBanner?.current_period_count}</strong>
                  </div>
                  <span className="text-sm">
                    {adoptedPetBanner?.percentage_change !== null && adoptedPetBanner?.percentage_change !== undefined
                      ? `${adoptedPetBanner.percentage_change.toFixed(0)}% ${adoptedPetOption}`
                      : 'N/A'}
                  </span>
                </div>
              </div>
              {(() => {
                if (adoptedPetBanner?.previous_period_count === undefined || adoptedPetBanner?.current_period_count === undefined) {
                  return null
                } else if (adoptedPetBanner.previous_period_count < adoptedPetBanner.current_period_count) {
                  return <HiOutlineTrendingUp className="text-yellow-900 opacity-50" size={100} />
                } else {
                  return <HiOutlineTrendingDown className="text-yellow-900 opacity-50" size={100} />
                }
              })()}
            </div>
          </BoxWrapper>
          <BoxWrapper
            banner={BANNER_UNADOPTED_PETS}
            className="bg-gradient-to-r from-pink-600 to-pink-400 text-white p-4"
            handleDateChange={handleDateChange}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-pink-700">
                  <IoCart className="text-2xl text-white" />
                </div>
                <div className="pl-4 flex flex-col items-start">
                  <span className="text-sm font-light">Total Unadopted Pet</span>
                  <div className="flex items-center">
                    <strong className="text-2xl font-semibold">{unadoptedPetBanner?.current_period_count}</strong>
                  </div>
                  <span className="text-sm">
                    {unadoptedPetBanner?.percentage_change !== null && unadoptedPetBanner?.percentage_change !== undefined
                      ? `${unadoptedPetBanner.percentage_change.toFixed(0)}% ${unadoptedPetOption}`
                      : 'N/A'}
                  </span>
                </div>
              </div>
              {(() => {
                if (unadoptedPetBanner?.previous_period_count === undefined || unadoptedPetBanner?.current_period_count === undefined) {
                  return null
                } else if (unadoptedPetBanner.previous_period_count < unadoptedPetBanner.current_period_count) {
                  return <HiOutlineTrendingUp className="text-yellow-900 opacity-50" size={100} />
                } else {
                  return <HiOutlineTrendingDown className="text-yellow-900 opacity-50" size={100} />
                }
              })()}
            </div>
          </BoxWrapper>
        </div>
        <div className="flex-1">
          <BoxWrapper
            banner={BANNER_ADOPT_REQUEST_LAST_WEEK}
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
                    <span className="text-sm font-light">Total Adopt Request Last Week</span>
                    <div className="flex items-center">
                      <strong className="text-2xl font-semibold">{adoptRequestLastWeek?.total_sales?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</strong>
                    </div>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250} className='p-2'>
                <AreaChart data={adoptRequestLastWeek?.data} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tick={{ fill: 'white', fontSize: 14 }} />
                  <YAxis axisLine={false} tick={{ fill: 'white', fontSize: 14 }} tickFormatter={(value) => value.toLocaleString('it-IT')} />
                  <CartesianGrid strokeDasharray="2 2" strokeOpacity={0.5} />
                  <Tooltip
                    labelFormatter={(label) => label}
                    contentStyle={{ backgroundColor: '#000000aa', color: '#ffffff' }}
                  />
                  <Area name='Adopt Request Count' type="monotone" dataKey="adopt_request_count" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </BoxWrapper>
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full">
        <div className="h-[26rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
          <div className='flex items-center justify-between'>
            <strong className="flex items-center gap-2 text-gray-700 font-bold text-xl">
              <img src={requestLogo} alt="" className='w-8 h-8' />
              Adopt Request Report
            </strong>
            <Select
              defaultValue={selectedBarAdoptRequestYear.toString()}
              style={{ width: 120 }}
              onChange={handleChangeBarAdoptRequestYear}
            >
              {barAdoptRequestYears.map((year) => (
                <Option key={year} value={year.toString()}>
                  {year}
                </Option>
              ))}
            </Select>
          </div>
          <div className="mt-3 w-full flex-1 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={barAdoptRequest}
                margin={{
                  top: 20,
                  right: 20,
                  left: 10,
                  bottom: 0
                }}
              >
                <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'black', fontSize: 11 }}
                />
                <YAxis
                  tick={{ fill: 'black', fontSize: 11 }}
                  tickFormatter={(value) => value.toLocaleString('it-IT')}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="adopt_request_count" fill="#8784d8" name="Adopt Request Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="h-[26rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
          <div className='flex items-center justify-between'>
            <strong className="flex items-center gap-2 text-gray-700 font-bold text-xl">
              <img src={animalShelterLogo} alt="selled-icon" className='w-8 h-8' />
              Adopted Pet Report
            </strong>
            <Select
              defaultValue={selectedBarAdoptedPetYear.toString()}
              style={{ width: 120 }}
              onChange={handleChangeBarAdoptedPetYear}
            >
              {barAdoptedPetYears.map((year) => (
                <Option key={year} value={year.toString()}>
                  {year}
                </Option>
              ))}
            </Select>
          </div>
          <div className="mt-3 w-full flex-1 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={barAdoptedPet}
                margin={{
                  top: 20,
                  right: 30,
                  left: 0,
                  bottom: 0
                }}
              >
                <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
                <XAxis
                  dataKey="name"
                  tick={{ fill: 'black', fontSize: 11 }}
                />
                <YAxis
                  tick={{ fill: 'black', fontSize: 11 }}
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="adopted_count" fill="#81ca9c" name="Adopted Pet Count" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="w-[20rem] h-[26rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col">
          <strong className="text-gray-700 font-medium">Pie Pets</strong>
          <div className="mt-3 w-full flex-1 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={400} height={300}>
                <Pie
                  data={piePet}
                  cx="50%"
                  cy="45%"
                  labelLine={true}
                  label={renderCustomizedLabel}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {piePet.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full">
        <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1 dashboard-container">
          <strong className="text-gray-700 font-medium">Recent Pending Adopt Request</strong>
          <div className="border-x border-gray-200 rounded-sm mt-3">
            <table className="w-full text-gray-700">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Pet Name</th>
                  <th>Customer Name</th>
                  <th>Email</th>
                  <th>Request Date</th>
                </tr>
              </thead>
              <tbody>
                {recentAdoptRequest.map((adoptRequest) => (
                  <tr key={adoptRequest?.id}>
                    <td>
                      <Link to={`/adopt-request/${adoptRequest?.id}`}>#{adoptRequest?.id}</Link>
                    </td>
                    <td>
                      <Link to={`/dashboard/pet-view/${adoptRequest?.pet_id}`}>{adoptRequest?.pet.pet_name}</Link>
                    </td>
                    <td>{adoptRequest?.customer.full_name}</td>
                    <td>{adoptRequest?.customer.email}</td>
                    <td>{format(new Date(adoptRequest?.created_at), 'dd MMM yyyy')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AidCenterDashboard