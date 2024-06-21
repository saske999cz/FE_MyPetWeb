import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom';
import AuthUser from '../../../../utils/AuthUser';
import { useAuth } from '../../../../utils/AuthContext';
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { storage } from '../../../../utils/firebase';
import { BeatLoader } from 'react-spinners';
import { Divider, Progress, Rate, Flex, Select, Pagination } from 'antd';
import { BiSolidCommentDetail } from 'react-icons/bi';
import { FaLink, FaPhone, FaUser } from 'react-icons/fa6';
import { format } from 'date-fns';
import { MdEmail, MdLocationPin, MdOutlineUpdate } from 'react-icons/md';
import { IoTime } from 'react-icons/io5';
import { IoIosBusiness } from "react-icons/io";
import { AiOutlineGlobal } from 'react-icons/ai';
import revenueIcon from '../../../../assets/images/revenue.png'
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { geocodeByAddress, getLatLng } from 'react-google-places-autocomplete';
import CustomerReview from '../../../../components/CustomerReview/CustomerReview';
import Map from '../../../../components/Map';
const { Option } = Select;

const AdminShopDetail = () => {
  const { http } = AuthUser();
  const { id } = useParams();
  const { accessToken } = useAuth();

  const [shop, setShop] = useState({})
  const [loading, setLoading] = useState(true)

  // Fetch list image state
  const [imageList, setImageList] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");

  const [location, setLocation] = useState('');

  const [coords, setCoords] = useState({ lat: 0, lng: 0 })

  const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  const [fiveStarCount, setFiveStarCount] = useState(0)
  const [fourStarCount, setFourStarCount] = useState(0)
  const [threeStarCount, setThreeStarCount] = useState(0)
  const [twoStarCount, setTwoStarCount] = useState(0)
  const [oneStarCount, setOneStarCount] = useState(0)

  const currentYear = new Date().getFullYear();
  const revenueYears = [currentYear, currentYear - 1, currentYear - 2];
  const [selectedRevenueYear, setSelectedRevenueYear] = useState(currentYear);

  const [revenue, setRevenue] = useState([])

  // Pagination state
  const pageSizeOptions = [5, 10, 15];
  const DEFAULT_CURRENT_PAGE_NUMBER = 1;
  const DEFAULT_PAGE_SIZE_NUMBER = 5;
  const [listRatings, setListRatings] = useState([]); // Fetch list ratings state
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE_NUMBER);
  const [totalRatings, setTotalRatings] = useState(0);

  // --------------------------     Paginate     --------------------------
  const handleClickPaginate = (page, pageSize) => {
    setCurrentPage(page);
    setPageSize(pageSize);
  }

  const handleShowSizeChange = (currentPage, pageSize) => {
    setCurrentPage(currentPage);
    setPageSize(pageSize);
  }

  const handleChangeRevenueYear = (value) => {
    setSelectedRevenueYear(value)
  };

  const formatNumber = (value) => {
    if (value >= 1000000000) {
      return (value / 1000000000).toFixed(1) + 'B';
    } else if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M';
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K';
    }
    return value.toLocaleString('it-IT');
  };

  // Get shop address location
  useEffect(() => {
    const getCoords = async () => {
      if (loading) {
        try {
          console.log(location);
          const results = await geocodeByAddress(location);
          console.log(results);
          const latLng = await getLatLng(results[0]);
          setCoords(latLng);
        } catch (error) {
          console.log(error);
        }
      }
    };

    getCoords();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  // --------------------------     Get Shop Detail     --------------------------
  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await http.get(`/admin/shops/${id}`)
        const shopData = response.data.data
        setShop(shopData)
        setLocation(shopData.address)

        if (shopData.certificate) {
          const certificateRef = ref(storage, shopData.certificate)
          const certificateUrl = await getDownloadURL(certificateRef)
          setShop({
            ...shopData,
            certificate_url: certificateUrl
          })
        }

        return shopData.image
      } catch (error) {
        console.log(error)
      }
    }

    const fetchShopImages = async (imagePath) => {
      let fetchedImages = []
      try {
        const imageRef = ref(storage, imagePath)
        const response = await listAll(imageRef)
        const promises = response.items.map(async (item) => {
          try {
            const url = await getDownloadURL(item)
            fetchedImages.push(url)
          } catch (error) {
            console.log(error)
          }
        })

        await Promise.all(promises)
        setImageList(fetchedImages)
        setSelectedImage(fetchedImages[0])

        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    const loadData = async () => {
      setLoading(true)
      const shopImage = await fetchShop()
      if (shopImage) {
        await fetchShopImages(shopImage)
      }
    }

    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  // --------------------------     Fetch Rating Detail API     --------------------------
  useEffect(() => {
    const fetchRatingDetails = async () => {
      try {
        const response = await http.get(`admin/ratings/shop/${id}/detail`)
        const ratingShopData = response.data.data
        console.log(ratingShopData)
        setFiveStarCount(ratingShopData.five_star)
        setFourStarCount(ratingShopData.four_star)
        setThreeStarCount(ratingShopData.three_star)
        setTwoStarCount(ratingShopData.two_star)
        setOneStarCount(ratingShopData.one_star)
      } catch (error) {
        console.log(error)
      }
    }

    fetchRatingDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  // --------------------------     Fetch Revenue API     --------------------------
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await http.get(`admin/shops/revenue/${id}?year=${selectedRevenueYear}`)
        setRevenue(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchRevenue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, selectedRevenueYear])

  // --------------------------     Fetch Rating API     --------------------------
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await http.get(`admin/shops/rating/${id}?page_number=${currentPage}&num_of_page=${pageSize}`);
        const ratingData = response.data.data;

        // Fetch images for each rating
        const ratingsWithImages = await Promise.all(
          ratingData.map(async (rating) => {
            const imagePath = rating.customer_avatar;
            let avatarUrl = null;
            try {
              avatarUrl = await getDownloadURL(ref(storage, imagePath));
            } catch (error) {
              console.log(error);
            }
            return {
              ...rating,
              avatar_url: avatarUrl,
            };
          })
        );

        setListRatings(ratingsWithImages);
        setTotalRatings(response.data.total_ratings);
      } catch (error) {
        console.log(error);
      }
    };

    fetchRatings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, accessToken]);

  if (loading) {
    return (
      <div className='h-full'>
        <BeatLoader className='relative top-1/2 transform -translate-y-1/2' color="#2463eb" size={36} />
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4 justify-center p-4' style={{ background: '#fbfbfb' }}>
      <div className='flex flex-row items-start gap-8'>
        {/* Left Item */}
        <div className='flex flex-col items-start gap-4 max-w-[27%]'>
          <Divider orientation='left' orientationMargin={0}>
            <span className='text-gray-800 font-bold text-md'>Shop Galleries</span>
          </Divider>
          <div>
            <img
              className='w-96 h-96 p-2 border-2 border-gray-300 border-dashed bg-cover rounded-md transition-all duration-300 ease-in-out object-cover'
              src={selectedImage}
              alt="shop"
            />
          </div>
          <div className='flex flex-row flex-wrap items-center justify-start w-full gap-3'>
            {imageList.map((image, index) => (
              <img
                key={index}
                className={`w-20 h-20 p-1 border-2 ${selectedImage === image ? 'border-blue-500' : 'border-gray-300'} border-dashed bg-cover rounded-md cursor-pointer transition-colors duration-200 ease-in-out object-cover hover:border-blue-400`}
                src={image}
                alt={`shop-${index + 1}`}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
        </div>
        {/* Middle Item */}
        <div className='flex flex-col flex-1 items-start'>
          <Divider style={{ color: 'red' }} orientation='left' orientationMargin={0}>
            <span className='text-gray-800 font-bold text-md'>Shop Details</span>
          </Divider>
          <div className='flex flex-col gap-2 w-full'>
            <p className='text-gray-800 text-2xl my-4 ml-4 mr-8 text-start font-semibold'>{shop.name}</p>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <FaUser />
                <p className='text-gray-800 text-md font-semibold'>Username</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{shop.username}</p>
              </div>
            </div>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <MdEmail />
                <p className='text-gray-800 text-md font-semibold'>Email</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{shop.email}</p>
              </div>
            </div>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <FaPhone />
                <p className='text-gray-800 text-md font-semibold'>Phone</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{shop.phone}</p>
              </div>
            </div>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <MdLocationPin />
                <p className='text-gray-800 text-md font-semibold'>Address</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{shop.address}</p>
              </div>
            </div>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <IoTime />
                <p className='text-gray-800 text-md font-semibold'>Work Time</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{shop.work_time}</p>
              </div>
            </div>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <IoIosBusiness />
                <p className='text-gray-800 text-md font-semibold'>Established Year</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{shop.establish_year}</p>
              </div>
            </div>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <BiSolidCommentDetail />
                <p className='text-gray-800 text-md font-semibold'>Review</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{shop.rating_count} Reviews</p>
              </div>
            </div>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <MdOutlineUpdate />
                <p className='text-gray-800 text-md font-semibold text-start'>Join Dated</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{format(new Date(shop.created_at), 'dd-MM-yyyy')}</p>
              </div>
            </div>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              {(() => {
                if (shop.website && shop.fanpage) {
                  return (
                    <>
                      <div className='flex flex-row gap-3 items-center w-40'>
                        <AiOutlineGlobal />
                        <Link to={shop.website} className='text-gray-800 text-md font-semibold transition duration-300 hover:text-blue-500'>Website</Link>
                      </div>
                      <div className='flex flex-row gap-3 items-center w-40'>
                        <FaLink />
                        <Link to={shop.fanpage} className='text-gray-800 text-md font-semibold transition duration-300 hover:text-blue-500'>Fanpage</Link>
                      </div>
                    </>
                  )
                } else if (shop.website) {
                  return (
                    <div className='flex flex-row gap-3 items-center w-40'>
                      <AiOutlineGlobal />
                      <Link to={shop.website} className='text-gray-800 text-md font-semibold transition duration-300 hover:text-blue-500'>Website</Link>
                    </div>
                  )
                } else {
                  return (
                    <div className='flex flex-row gap-3 items-center w-40'>
                      <FaLink />
                      <Link to={shop.fanpage} className='text-gray-800 text-md font-semibold transition duration-300 hover:text-blue-500'>Fanpage</Link>
                    </div>
                  )
                }
              })()}
            </div>
          </div>
        </div>
        {/* Right Item */}
        <div className='flex flex-col flex-1 items-start'>
          <Divider style={{ color: 'red' }} orientation='left' orientationMargin={0}>
            <span className='text-gray-800 font-bold text-md'>Map</span>
          </Divider>
          <div className='w-full mt-4'>
            <Map address={location} coords={coords} />
          </div>
        </div>
      </div>
      <div className='mt-4'>
        {shop?.certificate ? (
          <div className='w-full flex flex-row gap-10'>
            <div className='flex flex-col flex-1'>
              <Divider orientation='left' orientationMargin={0}>
                <span className='text-gray-800 font-bold text-md'>Shop Description</span>
              </Divider>
              <p className='text-gray-600 m-6 text-justify'>{shop.description}</p>
            </div>
            <div className='flex flex-col flex-1'>
              <Divider style={{ color: 'red' }} orientation='left' orientationMargin={0}>
                <span className='text-gray-800 font-bold text-md'>Certification</span>
              </Divider>
              <div className='flex mx-auto'>
                <img
                  className='w-60 h-60 p-2 border-2 border-gray-300 border-dashed bg-cover rounded-md transition-all duration-300 ease-in-out object-cover'
                  src={shop.certificate_url}
                  alt="certificate"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className='w-full'>
            <Divider orientation='left' orientationMargin={0}>
              <span className='text-gray-800 font-bold text-md'>Shop Description</span>
            </Divider>
            <p className='text-gray-600 m-6 text-justify'>{shop.description}</p>
          </div>
        )}
      </div>
      <div className='mt-2'>
        <Divider orientation='left' orientationMargin={0}>
          <span className='text-gray-800 font-bold text-md'>Rating Analytics</span>
        </Divider>
        <div className='flex flex-row gap-20 justify-center items-center w-full'>
          <Flex className='flex flex-col items-start justify-center gap-2' gap="small" vertical style={{ width: 500 }}>
            <div className='flex flex-row items-center justify-between gap-2 w-full'>
              <span className='text-gray-800 text-md w-20'>5 Star</span>
              <Progress className='flex-1' percent={parseInt(fiveStarCount) / shop.rating_count * 100} showInfo={false} />
              <span className='w-20'>({fiveStarCount})</span>
            </div>
            <div className='flex flex-row items-center justify-between gap-2 w-full'>
              <span className='text-gray-800 text-md w-20'>4 Star</span>
              <Progress className='flex-1' percent={parseInt(fourStarCount) / shop.rating_count * 100} showInfo={false} />
              <span className='w-20'>({fourStarCount})</span>
            </div>
            <div className='flex flex-row items-center justify-between gap-2 w-full'>
              <span className='text-gray-800 text-md w-20'>3 Star</span>
              <Progress className='flex-1' percent={parseInt(threeStarCount) / shop.rating_count * 100} showInfo={false} />
              <span className='w-20'>({threeStarCount})</span>
            </div>
            <div className='flex flex-row items-center justify-between gap-2 w-full'>
              <span className='text-gray-800 text-md w-20'>2 Star</span>
              <Progress className='flex-1' percent={parseInt(twoStarCount) / shop.rating_count * 100} showInfo={false} />
              <span className='w-20'>({twoStarCount})</span>
            </div>
            <div className='flex flex-row items-center justify-between gap-2 w-full'>
              <span className='text-gray-800 text-md w-20'>1 Star</span>
              <Progress className='flex-1' percent={parseInt(oneStarCount) / shop.rating_count * 100} showInfo={false} />
              <span className='w-20'>({oneStarCount})</span>
            </div>
          </Flex>
          <div className='flex flex-col justify-center items-start'>
            <span className='text-gray-800 font-bold'>Total Review ({shop.rating_count})</span>
            <span className='text-gray-800 font-extrabold' style={{ fontSize: 86 }}>{parseFloat(shop.rating).toFixed(1)}</span>
            <Flex gap="middle" vertical>
              <Rate disabled allowHalf tooltips={desc} defaultValue={parseFloat(shop.rating).toFixed(1)} />
            </Flex>
          </div>
        </div>
      </div>
      <div className='mt-4'>
        <Divider orientation='left' orientationMargin={0}>
          <span className='text-gray-800 font-bold text-md'>Revenue Analytics</span>
        </Divider>
        <div className='flex items-center gap-10 w-full'>
          <div className='flex flex-col gap-10 justify-start w-full'>
            <div className='w-full flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <img src={revenueIcon} alt="revenue-icon" width={46} height={46} />
                <h1 className='font-semibold'>Revenue Report</h1>
              </div>
              <Select
                className='mr-[4%]'
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
            <div className="mt-3 w-full flex items-center justify-center" style={{ height: '400px' }}>
              <ResponsiveContainer width="94%" height='100%' className="mt-3 w-full flex items-center justify-center">
                <AreaChart
                  width={730}
                  height={250}
                  data={revenue}
                  className='px-4'
                  margin={{ top: 0, right: 20, left: 20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="name"
                    tick={{ fill: 'black', fontSize: 14 }}
                  />
                  <YAxis
                    tick={{ fill: 'black', fontSize: 14 }}
                    tickFormatter={formatNumber}
                  />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip
                    formatter={(value) => value.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#8884d8" fillOpacity={1} fill="url(#colorRevenue)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-2'>
        <Divider orientation='left' orientationMargin={0}>
          <span className='text-gray-800 font-bold text-md'>Customer Reviews</span>
        </Divider>
      </div>
      {listRatings.map((rating, index) => {
        return (
          <CustomerReview isAdmin={true} rating={rating} ratingIndex={index + 1} />
        )
      })}
      <div className='flex flex-row items-center justify-end mb-6'>
        <Pagination
          current={currentPage}
          defaultCurrent={DEFAULT_CURRENT_PAGE_NUMBER}
          defaultPageSize={DEFAULT_PAGE_SIZE_NUMBER}
          hideOnSinglePage
          total={totalRatings}
          pageSizeOptions={pageSizeOptions}
          showTotal={(totalRatings) => totalRatings <= 1 ? `Total ${totalRatings} rating` : `Total ${totalRatings} ratings`}
          showQuickJumper
          showSizeChanger
          onChange={handleClickPaginate}
          onShowSizeChange={handleShowSizeChange}
        />
      </div>
    </div>
  )
}

export default AdminShopDetail