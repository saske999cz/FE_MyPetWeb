import React, { Fragment, useEffect, useState } from 'react';
import classNames from 'classnames';
import revenueIcon from '../../../assets/images/revenue.png'
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
import getOrderStatus from '../../../utils/orderStatus';
import './Dashboard.scss';
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
const BANNER_REVIEW = 'Review'
const BANNER_REPLY = 'Reply'
const BANNER_PRODUCT = 'Product'
const BANNER_ORDER = 'Order'
const BANNER_SALE = 'Sale'

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

const Dashboard = () => {
  const { http } = AuthUser()
  const [loading, setLoading] = useState(true);

  const [reviewOption, setReviewOption] = useState(FILTER_LAST_MONTH) // default option
  const [replyOption, setReplyOption] = useState(FILTER_LAST_MONTH) // default option
  const [productOption, setProductOption] = useState(FILTER_LAST_MONTH) // default option
  const [orderOption, setOrderOption] = useState(FILTER_LAST_MONTH) // default option

  const [reviewBanner, setReviewBanner] = useState()
  const [replyBanner, setReplyBanner] = useState()
  const [productBanner, setProductBanner] = useState()
  const [orderBanner, setOrderBanner] = useState()
  const [saleBanner, setSaleBanner] = useState([])
  const [revenue, setRevenue] = useState([])
  const [selledProduct, setSelledProduct] = useState([])
  const [productCategories, setProductCategories] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [popularProducts, setPopularProducts] = useState([])

  const [isFirstFetchReview, setIsFirstFetchReview] = useState(true);
  const [isFirstFetchReply, setIsFirstFetchReply] = useState(true);
  const [isFirstFetchProduct, setIsFirstFetchProduct] = useState(true);
  const [isFirstFetchOrder, setIsFirstFetchOrder] = useState(true);

  const currentYear = new Date().getFullYear();
  const revenueYears = [currentYear, currentYear - 1, currentYear - 2];
  const selledYears = [currentYear, currentYear - 1, currentYear - 2];
  const [selectedRevenueYear, setSelectedRevenueYear] = useState(currentYear);
  const [selectedSelledYear, setSelectedSelledYear] = useState(currentYear);

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
      case BANNER_PRODUCT:
        setProductOption(filterOption);
        break;
      case BANNER_ORDER:
        setOrderOption(filterOption);
        break;
      default:
        break;
    }
  };

  const handleChangeRevenueYear = (value) => {
    setSelectedRevenueYear(value)
  };

  const handleChangeSelledYear = (value) => {
    setSelectedSelledYear(value)
  };

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

  useEffect(() => {
    const fetchReviewBanner = async () => {
      try {
        const response = await http.get(`/shop/banner/reviews?option=${reviewOption}`)
        setReviewBanner(response.data.data)
        if (!isFirstFetchReview) {
          toast.success('Review filter applied successfully!', {
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
        setIsFirstFetchReview(false);
      } catch (error) {
        console.log(error)
      }
    }

    fetchReviewBanner()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reviewOption])

  useEffect(() => {
    const fetchReplyBanner = async () => {
      try {
        const response = await http.get(`/shop/banner/replies?option=${replyOption}`)
        setReplyBanner(response.data.data)
        if (!isFirstFetchReply) {
          toast.success('Reply filter applied successfully!', {
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
        setIsFirstFetchReply(false);
      } catch (error) {
        console.log(error)
      }
    }

    fetchReplyBanner()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replyOption])

  useEffect(() => {
    const fetchProductBanner = async () => {
      try {
        const response = await http.get(`/shop/banner/products?option=${productOption}`)
        setProductBanner(response.data.data)
        if (!isFirstFetchProduct) {
          toast.success('Product filter applied successfully!', {
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
        setIsFirstFetchProduct(false);
      } catch (error) {
        console.log(error)
      }
    }

    fetchProductBanner()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productOption])

  useEffect(() => {
    const fetchOrderBanner = async () => {
      try {
        const response = await http.get(`/shop/banner/orders?option=${orderOption}`)
        setOrderBanner(response.data.data)
        if (!isFirstFetchOrder) {
          toast.success('Order filter applied successfully!', {
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
        setIsFirstFetchOrder(false);
      } catch (error) {
        console.log(error)
      }
    }

    fetchOrderBanner()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderOption])

  useEffect(() => {
    const fetchSales = async () => {
      try {
        const response = await http.get('/shop/banner/sales')
        setSaleBanner(response.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchSales()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await http.get(`/shop/bar/revenue?year=${selectedRevenueYear}`)
        setRevenue(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchRevenue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedRevenueYear])

  useEffect(() => {
    const fetchSelledProduct = async () => {
      try {
        const response = await http.get(`/shop/bar/selled?year=${selectedSelledYear}`)
        setSelledProduct(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchSelledProduct()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSelledYear])

  useEffect(() => {
    const fetchProductCategories = async () => {
      try {
        const response = await http.get('/shop/pie/product-category')
        const data = response.data.data.map(item => ({
          name: item.type,
          value: item.total_quantity,
        }))
        setProductCategories(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchProductCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await http.get('/shop/recent-orders')
        setRecentOrders(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchRecentOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchPopularProduct = async () => {
      try {
        const response = await http.get('/shop/popular-products')
        const popularProductData = response.data.data

        const popularProductsWithImagesPromises = popularProductData.map((product) => {
          return new Promise((resolve) => {
            fetchImages(product.image, (fetchedImages) => {
              resolve({ ...product, image_url: fetchedImages[0] || '' });
            });
          });
        });

        Promise.all(popularProductsWithImagesPromises).then((productsWithImages) => {
          console.log(productsWithImages)
          setPopularProducts(productsWithImages)

          setLoading(false)
        });
      } catch (error) {
        console.log(error)
      }
    }

    fetchPopularProduct()
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
                    <strong className="text-2xl font-semibold">{reviewBanner?.current_period_count}</strong>
                  </div>
                  <span className="text-sm">
                    {reviewBanner?.percentage_change !== null && reviewBanner?.percentage_change !== undefined
                      ? `${reviewBanner.percentage_change.toFixed(0)}% ${reviewOption}`
                      : 'N/A'}
                  </span>
                </div>
              </div>
              {(() => {
                if (reviewBanner?.previous_period_count === undefined || reviewBanner?.current_period_count === undefined) {
                  return null
                } else if (reviewBanner.previous_period_count < reviewBanner.current_period_count) {
                  return <HiOutlineTrendingUp className="text-yellow-900 opacity-50" size={100} />
                } else {
                  return <HiOutlineTrendingDown className="text-yellow-900 opacity-50" size={100} />
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
                    <strong className="text-2xl font-semibold">{replyBanner?.current_period_count}</strong>
                  </div>
                  <span className="text-sm">
                    {replyBanner?.percentage_change !== null && replyBanner?.percentage_change !== undefined
                      ? `${replyBanner.percentage_change.toFixed(0)}% ${replyOption}`
                      : 'N/A'}
                  </span>
                </div>
              </div>
              {(() => {
                if (replyBanner?.previous_period_count === undefined || replyBanner?.current_period_count === undefined) {
                  return null
                } else if (replyBanner.previous_period_count < replyBanner.current_period_count) {
                  return <HiOutlineTrendingUp className="text-yellow-900 opacity-50" size={100} />
                } else {
                  return <HiOutlineTrendingDown className="text-yellow-900 opacity-50" size={100} />
                }
              })()}
            </div>
          </BoxWrapper>
          <BoxWrapper
            banner={BANNER_PRODUCT}
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white p-4"
            handleDateChange={handleDateChange}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-blue-700">
                  <IoBagHandle className="text-2xl text-white" />
                </div>
                <div className="pl-4 flex flex-col items-start">
                  <span className="text-sm font-light">Total Products</span>
                  <div className="flex items-center">
                    <strong className="text-2xl font-semibold">{productBanner?.current_period_count}</strong>
                  </div>
                  <span className="text-sm">
                    {productBanner?.percentage_change !== null && productBanner?.percentage_change !== undefined
                      ? `${productBanner.percentage_change.toFixed(0)}% ${productOption}`
                      : 'N/A'}
                  </span>
                </div>
              </div>
              {(() => {
                if (productBanner?.previous_period_count === undefined || productBanner?.current_period_count === undefined) {
                  return null
                } else if (productBanner.previous_period_count < productBanner.current_period_count) {
                  return <HiOutlineTrendingUp className="text-yellow-900 opacity-50" size={100} />
                } else {
                  return <HiOutlineTrendingDown className="text-yellow-900 opacity-50" size={100} />
                }
              })()}
            </div>
          </BoxWrapper>
          <BoxWrapper
            banner={BANNER_ORDER}
            className="bg-gradient-to-r from-pink-600 to-pink-400 text-white p-4"
            handleDateChange={handleDateChange}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center">
                <div className="rounded-full h-12 w-12 flex items-center justify-center bg-pink-700">
                  <IoCart className="text-2xl text-white" />
                </div>
                <div className="pl-4 flex flex-col items-start">
                  <span className="text-sm font-light">Total Orders</span>
                  <div className="flex items-center">
                    <strong className="text-2xl font-semibold">{orderBanner?.current_period_count}</strong>
                  </div>
                  <span className="text-sm">
                    {orderBanner?.percentage_change !== null && orderBanner?.percentage_change !== undefined
                      ? `${orderBanner.percentage_change.toFixed(0)}% ${orderOption}`
                      : 'N/A'}
                  </span>
                </div>
              </div>
              {(() => {
                if (orderBanner?.previous_period_count === undefined || orderBanner?.current_period_count === undefined) {
                  return null
                } else if (orderBanner.previous_period_count < orderBanner.current_period_count) {
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
                    <span className="text-sm font-light">Total Sales Last Week</span>
                    <div className="flex items-center">
                      <strong className="text-2xl font-semibold">{saleBanner?.total_sales?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</strong>
                    </div>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={250} className='p-2'>
                <AreaChart data={saleBanner?.data} margin={{ top: 0, right: 30, left: 0, bottom: 0 }}>
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
                    formatter={(value) => value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                    labelFormatter={(label) => label}
                    contentStyle={{ backgroundColor: '#000000aa', color: '#ffffff' }}
                  />
                  <Area type="monotone" dataKey="sale" stroke="#82ca9d" fillOpacity={1} fill="url(#colorPv)" />
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
              <img src={revenueIcon} alt="" className='w-8 h-8' />
              Revenue Report
            </strong>
            <Select
              defaultValue={selectedRevenueYear.toString()}
              style={{ width: 120 }}
              onChange={handleChangeRevenueYear}
            >
              {revenueYears.map((year) => (
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
                data={revenue}
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
                <Tooltip
                  formatter={(value) => value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                />
                <Legend />
                <Bar dataKey="revenue" fill="#8784d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="h-[26rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
          <div className='flex items-center justify-between'>
            <strong className="flex items-center gap-2 text-gray-700 font-bold text-xl">
              <img src={selledIcon} alt="selled-icon" className='w-8 h-8' />
              Selled Report
            </strong>
            <Select
              defaultValue={selectedSelledYear.toString()}
              style={{ width: 120 }}
              onChange={handleChangeSelledYear}
            >
              {selledYears.map((year) => (
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
                data={selledProduct}
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
                <Bar dataKey="sold" fill="#81ca9c" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="w-[20rem] h-[26rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col">
          <strong className="text-gray-700 font-medium">Product Categories</strong>
          <div className="mt-3 w-full flex-1 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={400} height={300}>
                <Pie
                  data={productCategories}
                  cx="50%"
                  cy="45%"
                  labelLine={true}
                  label={renderCustomizedLabel}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {productCategories.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full dashboard-container">
        <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1">
          <strong className="text-gray-700 font-medium">Recent Orders</strong>
          <div className="border-x border-gray-200 rounded-sm mt-3">
            <table className="w-full text-gray-700">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer Name</th>
                  <th>Order Date</th>
                  <th>Order Total</th>
                  <th>Shipping Address</th>
                  <th>Order Status</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <Link to={`/order/${order.id}`}>#{order.id}</Link>
                    </td>
                    <td>
                      <Link to={`/dashboard/customer/${order.customer_id}`}>{order.customer_username}</Link>
                    </td>
                    <td>{format(new Date(order.created_at), 'dd MMM yyyy')}</td>
                    <td>{order.sub_total_prices.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</td>
                    <td>{order.address}</td>
                    <td>{getOrderStatus(order.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="w-[20rem] bg-white p-4 rounded-sm border border-gray-200">
          <strong className="text-gray-700 font-medium">Top 10 Best-selling Products</strong>
          <div className="mt-4 flex flex-col gap-3">
            {popularProducts.map((product) => (
              <Link
                key={product.id}
                to={`/dashboard/product-view/${product.id}`}
                className="flex items-start hover:no-underline"
              >
                <div className="w-10 h-10 min-w-[2.5rem] bg-gray-200 rounded-sm">
                  <img
                    className="w-full h-full object-cover rounded-sm"
                    src={product.image_url}
                    alt={product.name}
                  />
                </div>
                <div className="ml-4 flex-1">
                  <p className="text-sm text-gray-800">{product.name}</p>
                  <span
                    className={classNames(
                      product.quantity === 0
                        ? 'text-red-500'
                        : product.quantity > 50
                          ? 'text-green-500'
                          : 'text-orange-500',
                      'text-xs font-medium'
                    )}
                  >
                    {product.quantity === 0 ? 'Out of Stock' : product.quantity + ' in Stock'}
                  </span>
                </div>
                <div className="text-xs text-gray-400 pl-1.5">{product.price?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard