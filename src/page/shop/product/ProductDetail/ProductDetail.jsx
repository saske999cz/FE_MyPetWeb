import React, { useEffect, useState } from 'react';
import { Divider, Flex, Select, Pagination, Progress, Rate } from 'antd';
import { BiSolidCategoryAlt, BiSolidCommentDetail } from "react-icons/bi";
import { MdOutlineProductionQuantityLimits, MdPublishedWithChanges, MdSell, MdOutlineUpdate } from "react-icons/md";
import { GrCurrency } from "react-icons/gr";
import CustomerReview from '../../../../components/CustomerReview/CustomerReview';
import './ProductDetail.scss';
import revenueIcon from '../../../../assets/images/revenue.png'
import selledIcon from '../../../../assets/images/selled.png'
import { useParams } from 'react-router-dom';
import AuthUser from '../../../../utils/AuthUser';
import currency from '../../../../utils/currency';
import { format } from 'date-fns';
import { BeatLoader } from 'react-spinners'
import { getDownloadURL, listAll, ref } from 'firebase/storage';
import { storage } from '../../../../utils/firebase';
import { useAuth } from '../../../../utils/AuthContext';
import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
const { Option } = Select;

const ProductDetail = () => {
  const { id } = useParams();

  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const { http } = AuthUser();
  const { accessToken } = useAuth();
  // Fetch list image state
  const [imageList, setImageList] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");

  const desc = ['terrible', 'bad', 'normal', 'good', 'wonderful'];
  const [fiveStarCount, setFiveStarCount] = useState(0)
  const [fourStarCount, setFourStarCount] = useState(0)
  const [threeStarCount, setThreeStarCount] = useState(0)
  const [twoStarCount, setTwoStarCount] = useState(0)
  const [oneStarCount, setOneStarCount] = useState(0)

  const currentYear = new Date().getFullYear();
  const revenueYears = [currentYear, currentYear - 1, currentYear - 2];
  const selledYears = [currentYear, currentYear - 1, currentYear - 2];
  const [selectedRevenueYear, setSelectedRevenueYear] = useState(currentYear);
  const [selectedSelledYear, setSelectedSelledYear] = useState(currentYear);

  const [revenue, setRevenue] = useState([])
  const [selling, setSelling] = useState([])

  const handleChangeRevenueYear = (value) => {
    setSelectedRevenueYear(value)
  };

  const handleChangeSelledYear = (value) => {
    setSelectedSelledYear(value)
  };

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

  // --------------------------     Fetch Product Detail API     --------------------------
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await http.get(`shop/products/${id}`)
        const productData = response.data.data
        setProduct(productData)
        return productData.image
      } catch (error) {
        console.log(error)
      }
    }

    const fetchProductImages = async (imagePath) => {
      let fetchedImages = []
      try {
        const imageRef = ref(storage, imagePath)
        const response = await listAll(imageRef)
        const promises = response.items.map(async (item) => {
          try {
            const url = await getDownloadURL(item);
            fetchedImages.push(url);
          } catch (error) {
            console.log(error);
          }
        })
        await Promise.all(promises)
        setImageList(fetchedImages);
        setSelectedImage(fetchedImages[0]);

        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    const loadData = async () => {
      setLoading(true)
      const productImage = await fetchProduct()
      if (productImage) {
        await fetchProductImages(productImage);
      }
    }

    loadData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

  // --------------------------     Fetch Rating API     --------------------------
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const response = await http.get(`shop/ratings/product/${id}?page_number=${currentPage}&num_of_page=${pageSize}`);
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

  // --------------------------     Fetch Revenue API     --------------------------
  useEffect(() => {
    const fetchRevenue = async () => {
      try {
        const response = await http.get(`shop/orders/revenue/${id}?year=${selectedRevenueYear}`)
        setRevenue(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchRevenue()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, selectedRevenueYear])

  // --------------------------     Fetch Selling API     --------------------------
  useEffect(() => {
    const fetchSelling = async () => {
      try {
        const response = await http.get(`shop/orders/selling/${id}?year=${selectedSelledYear}`)
        setSelling(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchSelling()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, selectedSelledYear])

  // --------------------------     Fetch Rating Detail API     --------------------------
  useEffect(() => {
    const fetchRatingDetails = async () => {
      try {
        const response = await http.get(`shop/ratings/product/${id}/detail`)
        const ratingDetailData = response.data.data
        console.log(ratingDetailData)
        setFiveStarCount(ratingDetailData.five_star)
        setFourStarCount(ratingDetailData.four_star)
        setThreeStarCount(ratingDetailData.three_star)
        setTwoStarCount(ratingDetailData.two_star)
        setOneStarCount(ratingDetailData.one_star)
      } catch (error) {
        console.log(error)
      }
    }

    fetchRatingDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken])

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
            <span className='text-gray-800 font-bold text-md'>Product Gallery</span>
          </Divider>
          <div>
            <img
              className='w-96 h-96 p-2 border-2 border-gray-300 border-dashed bg-cover rounded-md transition-all duration-300 ease-in-out object-cover'
              src={selectedImage}
              alt="product"
            />
          </div>
          <div className='flex flex-row flex-wrap items-center justify-start w-full gap-3'>
            {imageList.map((image, index) => (
              <img
                key={index}
                className={`w-20 h-20 p-1 border-2 ${selectedImage === image ? 'border-blue-500' : 'border-gray-300'} border-dashed bg-cover rounded-md cursor-pointer transition-colors duration-200 ease-in-out object-cover hover:border-blue-400`}
                src={image}
                alt={`product-${index + 1}`}
                onClick={() => setSelectedImage(image)}
              />
            ))}
          </div>
        </div>
        {/* Right Item */}
        <div className='flex flex-col flex-1 items-start'>
          <Divider style={{ color: 'red' }} orientation='left' orientationMargin={0}>
            <span className='text-gray-800 font-bold text-md'>Product Details</span>
          </Divider>
          <div className='flex flex-col gap-2 w-full'>
            <p className='text-gray-800 text-2xl my-4 ml-4 mr-8 text-start font-semibold'>{product.name}</p>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <BiSolidCategoryAlt />
                <p className='text-gray-800 text-md font-semibold'>Category</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{product.category.name}</p>
              </div>
            </div>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <GrCurrency />
                <p className='text-gray-800 text-md font-semibold'>Price</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{currency(product.price)}</p>
              </div>
            </div>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <MdOutlineProductionQuantityLimits />
                <p className='text-gray-800 text-md font-semibold'>Stock</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{product.quantity} pieces</p>
              </div>
            </div>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <MdSell />
                <p className='text-gray-800 text-md font-semibold'>Sold</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{product.sold_quantity} sold</p>
              </div>
            </div>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <BiSolidCommentDetail />
                <p className='text-gray-800 text-md font-semibold'>Review</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{product.rating_count} Reviews</p>
              </div>
            </div>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <MdPublishedWithChanges />
                <p className='text-gray-800 text-md font-semibold'>Published</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{format(new Date(product.created_at), 'dd-MM-yyyy')}</p>
              </div>
            </div>
            <div className='flex flex-row justify-start my-1 ml-4 mr-8'>
              <div className='flex flex-row gap-3 items-center w-40'>
                <MdOutlineUpdate />
                <p className='text-gray-800 text-md font-semibold text-start'>Last Updated</p>
              </div>
              <div className='text-gray-800 text-md font-semibold'>:</div>
              <div className='ml-8 text-gray-600 text-md font-normal'>
                <p>{format(new Date(product.updated_at), 'dd-MM-yyyy')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className='mt-4'>
        <Divider orientation='left' orientationMargin={0}>
          <span className='text-gray-800 font-bold text-md'>Product Description</span>
        </Divider>
        <p className='text-gray-600 m-6 text-justify'>{product.description}</p>
      </div>
      <div className='mt-2'>
        <Divider orientation='left' orientationMargin={0}>
          <span className='text-gray-800 font-bold text-md'>Rating Analytics</span>
        </Divider>
        <div className='flex flex-row gap-20 justify-center items-center w-full'>
          <Flex className='flex flex-col items-start justify-center gap-2' gap="small" vertical style={{ width: 500 }}>
            <div className='flex flex-row items-center justify-between gap-2 w-full'>
              <span className='text-gray-800 text-md w-20'>5 Star</span>
              <Progress className='flex-1' percent={parseInt(fiveStarCount) / product.rating_count * 100} showInfo={false} />
              <span className='w-20'>({fiveStarCount})</span>
            </div>
            <div className='flex flex-row items-center justify-between gap-2 w-full'>
              <span className='text-gray-800 text-md w-20'>4 Star</span>
              <Progress className='flex-1' percent={parseInt(fourStarCount) / product.rating_count * 100} showInfo={false} />
              <span className='w-20'>({fourStarCount})</span>
            </div>
            <div className='flex flex-row items-center justify-between gap-2 w-full'>
              <span className='text-gray-800 text-md w-20'>3 Star</span>
              <Progress className='flex-1' percent={parseInt(threeStarCount) / product.rating_count * 100} showInfo={false} />
              <span className='w-20'>({threeStarCount})</span>
            </div>
            <div className='flex flex-row items-center justify-between gap-2 w-full'>
              <span className='text-gray-800 text-md w-20'>2 Star</span>
              <Progress className='flex-1' percent={parseInt(twoStarCount) / product.rating_count * 100} showInfo={false} />
              <span className='w-20'>({twoStarCount})</span>
            </div>
            <div className='flex flex-row items-center justify-between gap-2 w-full'>
              <span className='text-gray-800 text-md w-20'>1 Star</span>
              <Progress className='flex-1' percent={parseInt(oneStarCount) / product.rating_count * 100} showInfo={false} />
              <span className='w-20'>({oneStarCount})</span>
            </div>
          </Flex>
          <div className='flex flex-col justify-center items-start'>
            <span className='text-gray-800 font-bold'>Total Review ({product.rating_count})</span>
            <span className='text-gray-800 font-extrabold' style={{ fontSize: 86 }}>{parseFloat(product.rating).toFixed(1)}</span>
            <Flex gap="middle" vertical>
              <Rate disabled allowHalf tooltips={desc} defaultValue={parseFloat(product.rating).toFixed(1)} />
            </Flex>
          </div>
        </div>
      </div>
      <div className='mt-4'>
        <Divider orientation='left' orientationMargin={0}>
          <span className='text-gray-800 font-bold text-md'>Revenue and Selling</span>
        </Divider>
        <div className='flex items-center gap-10 w-full'>
          <div className='flex flex-col gap-10 justify-start w-1/2'>
            <div className='w-full flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <img src={revenueIcon} alt="revenue-icon" width={46} height={46} />
                <h1 className='font-semibold'>Revenue Report</h1>
              </div>
              <Select
                className='mr-[10%]'
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
              <ResponsiveContainer width="80%" height='100%' className="mt-3 w-full flex items-center justify-center">
                <BarChart 
                  width={700}
                  height={400}
                  data={revenue}
                >
                  <CartesianGrid strokeDasharray="3 3" />
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
                  <Bar dataKey="revenue" fill="#82ca9d" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className='flex flex-col gap-10 justify-start w-1/2'>
            <div className='w-full flex items-center justify-between'>
              <div className='flex items-center gap-4'>
                <img src={selledIcon} alt="selling-icon" width={46} height={46} />
                <h1 className='font-semibold'>Selling Report</h1>
              </div>
              <Select
                className='mr-[10%]'
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
            <div className="mt-3 w-full flex items-center justify-center" style={{ height: '400px' }}>
              <ResponsiveContainer width="80%" height='100%' className="mt-3 w-full flex items-center justify-center">
                <BarChart data={selling}>
                  <CartesianGrid strokeDasharray="3 3" />
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
                  <Bar dataKey="selled" fill="#8884d8" />
                </BarChart>
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
          <CustomerReview rating={rating} ratingIndex={index + 1} />
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
  );
}

export default ProductDetail;
