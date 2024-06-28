import React, { useEffect, useState } from 'react'
import { Button, DatePicker, Divider, Table, Tooltip } from 'antd'
import Search from 'antd/es/input/Search'
import { FaCalendarAlt, FaSearch, FaTrashRestore, FaWindowClose } from 'react-icons/fa'
import { FaCheck, FaEye, FaStar } from 'react-icons/fa6'
import { MdNewLabel } from 'react-icons/md'
import Column from 'antd/es/table/Column';
import { LazyLoadImage } from 'react-lazy-load-image-component'
import loadingImg from '../../../../assets/images/loading.png'
import { Link, useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import AuthUser from '../../../../utils/AuthUser'
import { toast } from 'react-toastify'
import { BeatLoader } from 'react-spinners'
import { getDownloadURL, ref } from 'firebase/storage'
import { storage } from '../../../../utils/firebase'
import { useAuth } from '../../../../utils/AuthContext'
import { IoClose } from 'react-icons/io5'
import { format } from 'date-fns'
import Swal from 'sweetalert2'


const AdminShopList = () => {
  const { http } = AuthUser()
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  const TOOLTIP_MESSAGE = "Working with other * to search"

  const [loading, setLoading] = useState(true);
  const [searchShopInput, setSearchShopInput] = useState('')
  const [searchShopWaitingApproveInput, setSearchShopWaitingApproveInput] = useState('')
  const [searchShopBlockedInput, setSearchShopBlockedInput] = useState('')

  // --------------     PAGINATION STATE     --------------
  const DEFAULT_CURRENT_PAGE_NUMBER = 1;
  const DEFAULT_PAGE_SIZE_NUMBER = 10;
  const allPageSize = [10, 20, 30];
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE_NUMBER);
  const [currentPageWaitingApprove, setCurrentPageWaitingApprove] = useState(DEFAULT_CURRENT_PAGE_NUMBER);
  const [pageSizeWaitingApprove, setPageSizeWaitingApprove] = useState(DEFAULT_PAGE_SIZE_NUMBER);
  const [currentPageBlocked, setCurrentPageBlocked] = useState(DEFAULT_CURRENT_PAGE_NUMBER);
  const [pageSizeBlocked, setPageSizeBlocked] = useState(DEFAULT_PAGE_SIZE_NUMBER);

  const [listShops, setListShops] = useState([]);
  const [totalShops, setTotalShops] = useState(0);
  const [listWaitingApproveShops, setListWaitingApproveShops] = useState([]);
  const [totalWaitingApproveShops, setTotalWaitingApproveShops] = useState(0);
  const [listBlockedShops, setListBlockedShops] = useState([]);
  const [totalBlockedShops, setTotalBlockedShops] = useState(0);

  const [startDate, setStartDate] = useState(() => dayjs().startOf('year'))
  const [endDate, setEndDate] = useState(() => dayjs())
  const [formattedStartDate, setFormattedStartDate] = useState(() => dayjs().startOf('year').format('YYYY-MM-DD'))
  const [formattedEndDate, setFormattedEndDate] = useState(() => dayjs().format('YYYY-MM-DD'))
  // -------------------------------------------------------
  const [startDateWaitingApprove, setStartDateWaitingApprove] = useState(() => dayjs().startOf('year'))
  const [endDateWaitingApprove, setEndDateWaitingApprove] = useState(() => dayjs())
  const [formattedStartDateWaitingApprove, setFormattedStartDateWaitingApprove] = useState(() => dayjs().startOf('year').format('YYYY-MM-DD'))
  const [formattedEndDateWaitingApprove, setFormattedEndDateWaitingApprove] = useState(() => dayjs().format('YYYY-MM-DD'))
  // -------------------------------------------------------
  const [startDateBlocked, setStartDateBlocked] = useState(() => dayjs().startOf('year'))
  const [endDateBlocked, setEndDateBlocked] = useState(() => dayjs())
  const [formattedStartDateBlocked, setFormattedStartDateBlocked] = useState(() => dayjs().startOf('year').format('YYYY-MM-DD'))
  const [formattedEndDateBlocked, setFormattedEndDateBlocked] = useState(() => dayjs().format('YYYY-MM-DD'))

  const onChangeStartDate = (date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setStartDate(startDate)
    setFormattedStartDate(formattedDate)
  }

  const onChangeEndDate = (date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setEndDate(date)
    setFormattedEndDate(formattedDate)
  }

  const onChangeStartDateWaitingApprove = (date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setStartDateWaitingApprove(startDate)
    setFormattedStartDateWaitingApprove(formattedDate)
  }

  const onChangeEndDateWaitingApprove = (date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setEndDateWaitingApprove(date)
    setFormattedEndDateWaitingApprove(formattedDate)
  }

  const onChangeStartDateBlocked = (date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setStartDateBlocked(startDate)
    setFormattedStartDateBlocked(formattedDate)
  }

  const onChangeEndDateBlocked = (date) => {
    const formattedDate = date ? dayjs(date).format('YYYY-MM-DD') : '';
    setEndDateBlocked(date)
    setFormattedEndDateBlocked(formattedDate)
  }

  const disabledDate = (current) => {
    // Can not select days after today
    return current && current > dayjs().endOf('day');
  };

  const onSearch = async () => {
    try {
      const fetchUrl = `admin/shops?page_number=${currentPage}&num_of_page=${pageSize}&start_date=${formattedStartDate}&end_date=${formattedEndDate}&search_term=${searchShopInput}`
      const response = await http.get(fetchUrl)
      const shopData = response.data.data

      if (shopData.length === 0) {
        toast.info('No shop founded', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: "colored",
        })
      } else {
        const shopWithAvatarPromises = shopData.map(async (shop) => {
          const avatarRef = ref(storage, shop.avatar)
          const avatarUrl = await getDownloadURL(avatarRef)
          return {
            ...shop,
            avatar_url: avatarUrl
          }
        })

        const shopWithAvatars = await Promise.all(shopWithAvatarPromises);
        setListShops(shopWithAvatars);
        setTotalShops(response.data.total_shops)

        toast.success('Successfully search shop', {
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
    } catch (error) {
      console.log(error)
    }
  }

  const onSearchWaitingApprove = async () => {
    try {
      const fetchUrl = `admin/shops/waiting-approve?page_number=${currentPageWaitingApprove}&num_of_page=${pageSizeWaitingApprove}&start_date=${formattedStartDateWaitingApprove}&end_date=${formattedEndDateWaitingApprove}&search_term=${searchShopWaitingApproveInput}`
      const response = await http.get(fetchUrl)
      const shopData = response.data.data

      if (shopData.length === 0) {
        toast.info('No shop founded', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: "colored",
        })
      } else {
        setListWaitingApproveShops(shopData);
        setTotalWaitingApproveShops(response.data.total_shops)

        toast.success('Successfully search waiting approve shop', {
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
    } catch (error) {
      console.log(error)
    }
  }

  const onSearchBlocked = async () => {
    try {
      const fetchUrl = `admin/shops/blocked?page_number=${currentPageBlocked}&num_of_page=${pageSizeBlocked}&start_date=${formattedStartDateBlocked}&end_date=${formattedEndDateBlocked}&search_term=${searchShopBlockedInput}`
      const response = await http.get(fetchUrl)
      const shopData = response.data.data

      if (shopData.length === 0) {
        toast.info('No shop founded', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: "colored",
        })
      } else {
        setListBlockedShops(shopData);
        setTotalBlockedShops(response.data.total_shops)

        toast.success('Successfully search blocked shop', {
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
    } catch (error) {
      console.log(error)
    }
  }

  const handleViewShop = (record) => {
    navigate(`/dashboard/shop-view/${record.id}`)
  }

  const handleApprovedAccount = (record) => {
    Swal.fire({
      title: 'Approve this shop?',
      text: 'You are about to make this account active',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#3fc2ed',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        http.patch(`admin/shops/approve/${record.account_id}`)
          .then((resolve) => {
            Swal.fire({
              icon: "success",
              title: resolve.data.message,
              text: `Request will be sent to the user`,
            }).then(() => {
              navigate(0)
            })
          })
          .catch((error) => {
            console.log(error)
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong. Try again",
            })
          })
      }
    });
  }

  const handleBlock = (record) => {
    Swal.fire({
      title: 'Block this shop?',
      text: 'You are about to make this account inactive',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        http.patch(`admin/shops/block/${record.account_id}`)
          .then((resolve) => {
            Swal.fire({
              icon: "success",
              title: resolve.data.message,
            }).then(() => {
              navigate(0)
            })
          })
          .catch((error) => {
            console.log(error)
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong. Try again",
            })
          })
      }
    });
  }

  const handleRestore = (record) => {
    console.log(record.account_id)
    Swal.fire({
      title: 'Restore this shop?',
      text: 'You are about to make this account active again',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        http.patch(`admin/shops/restore/${record.account_id}`)
          .then((resolve) => {
            Swal.fire({
              icon: "success",
              title: resolve.data.message,
            }).then(() => {
              navigate(0)
            })
          })
          .catch((error) => {
            console.log(error)
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong. Try again",
            })
          })
      }
    });
  }

  // --------------     SEARCH SHOP INPUT     --------------
  const handleSearchShop = (e) => {
    setSearchShopInput(e.target.value)
  }

  const handleSearchShopWaitingApprove = (e) => {
    setSearchShopWaitingApproveInput(e.target.value)
  }

  const handleSearchShopBlocked = (e) => {
    setSearchShopBlockedInput(e.target.value)
  }

  // --------------------------     Paginate     --------------------------
  const handleClickPaginate = (page, pageSize) => {
    setCurrentPage(page)
    setPageSize(pageSize)
  }

  const handleShowSizeChange = (currentPage, pageSize) => {
    setCurrentPage(currentPage);
    setPageSize(pageSize)
  }

  const handleClickPaginateWaitingApprove = (page, pageSize) => {
    setCurrentPageWaitingApprove(page)
    setPageSizeWaitingApprove(pageSize)
  }

  const handleShowSizeChangeWaitingApprove = (currentPage, pageSize) => {
    setCurrentPageWaitingApprove(currentPage);
    setPageSizeWaitingApprove(pageSize)
  }

  const handleClickPaginateBlocked = (page, pageSize) => {
    setCurrentPageBlocked(page)
    setPageSizeBlocked(pageSize)
  }

  const handleShowSizeChangeBlocked = (currentPage, pageSize) => {
    setCurrentPageBlocked(currentPage);
    setPageSizeBlocked(pageSize)
  }

  // --------------------------     Fetch Shop API     --------------------------
  useEffect(() => {
    const fetchShops = async () => {
      try {
        const fetchUrl = `admin/shops?page_number=${currentPage}&num_of_page=${pageSize}&start_date=${formattedStartDate}&end_date=${formattedEndDate}`
        const response = await http.get(fetchUrl)
        const shopData = response.data.data
        console.log(response)

        if (shopData.length === 0 && !loading) {
          toast.info('No shop founded', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          })
          setLoading(false)
        } else {
          const shopWithAvatarPromises = shopData.map(async (shop) => {
            const avatarRef = ref(storage, shop.avatar)
            const avatarUrl = await getDownloadURL(avatarRef)
            return {
              ...shop,
              avatar_url: avatarUrl
            }
          })

          const shopWithAvatar = await Promise.all(shopWithAvatarPromises)
          setListShops(shopWithAvatar)
          setTotalShops(response.data.total_shops)

          if (loading) {
            setLoading(false)
          } else {
            toast.success('Successfully retrieved shop', {
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
        }
      } catch (error) {
        console.error(error)
        toast.error(error.response.data.message, {
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
    }

    fetchShops()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, formattedStartDate, formattedEndDate])

  // --------------------------     Fetch Waiting Approve Shop API     --------------------------
  useEffect(() => {
    const fetchWaitingApproveShops = async () => {
      try {
        const fetchUrl = `admin/shops/waiting-approve?page_number=${currentPageWaitingApprove}&num_of_page=${pageSizeWaitingApprove}&start_date=${formattedStartDateWaitingApprove}&end_date=${formattedEndDateWaitingApprove}`
        const response = await http.get(fetchUrl)
        const shopData = response.data.data
        console.log(response)

        if (shopData.length === 0 && !loading) {
          toast.info('No shop founded', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          })
          setLoading(false)
        } else {
          setListWaitingApproveShops(shopData)
          setTotalWaitingApproveShops(response.data.total_shops)

          if (loading) {
            setLoading(false)
          } else {
            toast.success('Successfully retrieved waiting approve shop', {
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
        }
      } catch (error) {
        console.error(error)
        toast.error(error.response.data.message, {
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
    }

    fetchWaitingApproveShops()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageWaitingApprove, pageSizeWaitingApprove, formattedStartDateWaitingApprove, formattedEndDateWaitingApprove])

  // --------------------------     Fetch Blocked Shop API     --------------------------
  useEffect(() => {
    const fetchBlockedShops = async () => {
      try {
        const fetchUrl = `admin/shops/blocked?page_number=${currentPageBlocked}&num_of_page=${pageSizeBlocked}&start_date=${formattedStartDateBlocked}&end_date=${formattedEndDateBlocked}`
        const response = await http.get(fetchUrl)
        const shopData = response.data.data
        console.log(response)

        if (shopData.length === 0 && !loading) {
          toast.info('No shop founded', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: 0,
            theme: "colored",
          })
          setLoading(false)
        } else {
          setListBlockedShops(shopData)
          setTotalBlockedShops(response.data.total_shops)

          if (loading) {
            setLoading(false)
          } else {
            toast.success('Successfully retrieved blocked shop', {
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
        }
      } catch (error) {
        console.error(error)
        toast.error(error.response.data.message, {
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
    }

    fetchBlockedShops()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageBlocked, pageSizeBlocked, formattedStartDateBlocked, formattedEndDateBlocked])

  if (loading) {
    return (
      <div className='h-full'>
        <BeatLoader className='relative top-1/2 transform -translate-y-1/2' color="#2463eb" size={36} />
      </div>
    )
  }

  return (
    <div className='flex flex-col items-start justify-between bg-white p-6 rounded-md'>
      <Divider orientation='left'>
        <div className='flex flex-row gap-2 items-center'>
          <FaCheck size={20} />
          <span className='text-gray-800 font-bold text-md'>Active</span>
        </div>
      </Divider>
      <div className='flex flex-col items-center w-full gap-6 mb-6'>
        <div className='flex flex-row items-center justify-between gap-6 w-full'>
          <div className='flex flex-col items-start'>
            <div className='flex flex-row items-center gap-1 mb-2'>
              <FaCalendarAlt />
              <Tooltip title={TOOLTIP_MESSAGE}>
                <span className='text-md font-semibold'>START DATE <span className='text-red-600'>*</span></span>
              </Tooltip>
            </div>
            <DatePicker
              className='w-52 h-10'
              picker='date'
              defaultValue={startDate}
              onChange={onChangeStartDate}
              disabledDate={disabledDate}
            />
          </div>
          <div className='flex flex-col items-start'>
            <div className='flex flex-row items-center gap-1 mb-2'>
              <FaCalendarAlt />
              <Tooltip title={TOOLTIP_MESSAGE}>
                <span className='text-md font-semibold'>END DATE <span className='text-red-600'>*</span></span>
              </Tooltip>
            </div>
            <DatePicker
              className='w-52 h-10'
              picker='date'
              defaultValue={endDate}
              onChange={onChangeEndDate}
              disabledDate={disabledDate}
            />
          </div>
          <div className='flex flex-col items-start w-full'>
            <div className='flex flex-row items-center gap-1'>
              <FaSearch />
              <Tooltip title={TOOLTIP_MESSAGE}>
                <p className='text-md font-semibold'>SEARCH BY <span className='text-red-600'>*</span></p>
              </Tooltip>
            </div>
            <Search
              className='mt-2'
              placeholder="Shop name / email / phone"
              enterButton={
                <Button type="primary" disabled={searchShopInput.trim() === ''}>
                  Search
                </Button>
              }
              size="large"
              onSearch={onSearch}
              onChange={handleSearchShop}
              value={searchShopInput}
            />
          </div>
        </div>
        {/* APPROVED SHOP */}
        <div className='w-full'>
          <Table
            bordered
            dataSource={listShops}
            pagination={{
              defaultCurrent: DEFAULT_CURRENT_PAGE_NUMBER,
              defaultPageSize: DEFAULT_PAGE_SIZE_NUMBER,
              hideOnSinglePage: true,
              current: currentPage,
              pageSizeOptions: allPageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              total: totalShops,
              showTotal: (totalShops) => `Total ${totalShops} shops`,
              onChange: handleClickPaginate,
              onShowSizeChange: handleShowSizeChange
            }}
          >
            <Column
              align='left'
              title='No.'
              key='no.'
              render={(text, record, index) => (
                <span className='font-semibold'>{currentPage * DEFAULT_PAGE_SIZE_NUMBER - DEFAULT_PAGE_SIZE_NUMBER + index + 1}</span>
              )}
            />
            <Column
              align='left'
              title='ID'
              key='index'
              dataIndex='id'
              render={(text, record) => {
                return (
                  <Link to={`/dashboard/shop-view/${text}`} className='font-semibold text-blue-500'>
                    <span>#{text}</span>
                  </Link>
                )
              }}
            />
            <Column
              align='left'
              title='Shop Name'
              key='name'
              dataIndex='name'
              render={(text, record, index) => {
                return (
                  <div className='flex flex-row items-center gap-3'>
                    <LazyLoadImage
                      key={index}
                      src={record.avatar_url}
                      alt={`Product ${index}`}
                      className='w-10 h-10 bg-white border-neutral-300 border-2 rounded-md p-1 object-cover'
                      effect='blur'
                      placeholderSrc={loadingImg}
                    />
                    <span className='font-semibold'>{text}</span>
                  </div>
                )
              }}
            />
            <Column
              align='left'
              title='Username'
              key='username'
              dataIndex='username'
              render={(text, _) => (<span className='font-semibold'>{text}</span>)}
            />
            <Column
              align='left'
              title='Email'
              key='email'
              dataIndex='email'
              render={(text, _) => (<span className='font-semibold'>{text}</span>)}
            />
            <Column
              align='left'
              title='Phone'
              key='phone'
              dataIndex='phone'
              render={(text, _) => (<span className='font-semibold'>{text}</span>)}
            />
            <Column
              align='left'
              title='Established Year'
              key='establish_year'
              dataIndex='establish_year'
              render={(text, _) => {
                return (
                  <span>{text}</span>
                )
              }}
            />
            <Column
              align='left'
              title='Rating'
              key='rating'
              dataIndex='rating'
              width={110}
              render={(text, record) => {
                const roundedRating = parseFloat(text).toFixed(1);

                return (
                  <div className='flex flex-row gap-2 items-center'>
                    <FaStar style={{ color: '#fadb14' }} />
                    <p className='text-sm font-bold'>{roundedRating} <span className='font-normal'>({record.rating_count})</span></p>
                  </div>
                )
              }}
            />
            <Column
              align='center'
              title='Action'
              key='action'
              render={(text, record) => (
                <div className="flex flex-row items-center justify-evenly space-x-2 w-full my-1">
                  <button onClick={() => handleViewShop(record)} className='bg-purple-200 rounded-md p-1.5'>
                    <FaEye size={18} className='text-purple-600' />
                  </button>
                  <button onClick={() => handleBlock(record)} className='bg-red-200 rounded-md p-1.5'>
                    <FaWindowClose size={18} className='text-red-600' />
                  </button>
                </div>
              )}
            />
          </Table>
        </div>
      </div>
      <Divider orientation='left'>
        <div className='flex flex-row gap-2 items-center'>
          <MdNewLabel size={20} />
          <span className='text-gray-800 font-bold text-md'>Waiting Approve</span>
        </div>
      </Divider>
      <div className='flex flex-col items-center w-full gap-6 mb-6'>
        <div className='flex flex-row items-center justify-between gap-6 w-full'>
          <div className='flex flex-col items-start'>
            <div className='flex flex-row items-center gap-1 mb-2'>
              <FaCalendarAlt />
              <Tooltip title={TOOLTIP_MESSAGE}>
                <span className='text-md font-semibold'>START DATE <span className='text-red-600'>*</span></span>
              </Tooltip>
            </div>
            <DatePicker
              className='w-52 h-10'
              picker='date'
              defaultValue={startDateWaitingApprove}
              onChange={onChangeStartDateWaitingApprove}
              disabledDate={disabledDate}
            />
          </div>
          <div className='flex flex-col items-start'>
            <div className='flex flex-row items-center gap-1 mb-2'>
              <FaCalendarAlt />
              <Tooltip title={TOOLTIP_MESSAGE}>
                <span className='text-md font-semibold'>END DATE <span className='text-red-600'>*</span></span>
              </Tooltip>
            </div>
            <DatePicker
              className='w-52 h-10'
              picker='date'
              defaultValue={endDateWaitingApprove}
              onChange={onChangeEndDateWaitingApprove}
              disabledDate={disabledDate}
            />
          </div>
          <div className='flex flex-col items-start w-full'>
            <div className='flex flex-row items-center gap-1'>
              <FaSearch />
              <Tooltip title={TOOLTIP_MESSAGE}>
                <p className='text-md font-semibold'>SEARCH BY <span className='text-red-600'>*</span></p>
              </Tooltip>
            </div>
            <Search
              className='mt-2'
              placeholder="Shop name / email / phone"
              enterButton={
                <Button type="primary" disabled={searchShopWaitingApproveInput.trim() === ''}>
                  Search
                </Button>
              }
              size="large"
              onSearch={onSearchWaitingApprove}
              onChange={handleSearchShopWaitingApprove}
              value={searchShopWaitingApproveInput}
            />
          </div>
        </div>
        {/* WAITING APPROVE SHOP */}
        <div className='w-full'>
          <Table
            bordered
            dataSource={listWaitingApproveShops}
            pagination={{
              defaultCurrent: DEFAULT_CURRENT_PAGE_NUMBER,
              defaultPageSize: DEFAULT_PAGE_SIZE_NUMBER,
              hideOnSinglePage: true,
              current: currentPageWaitingApprove,
              pageSizeOptions: allPageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              total: totalWaitingApproveShops,
              showTotal: (totalWaitingApproveShops) => `Total ${totalWaitingApproveShops} waiting approve shops`,
              onChange: handleClickPaginateWaitingApprove,
              onShowSizeChange: handleShowSizeChangeWaitingApprove
            }}
          >
            <Column
              align='left'
              title='No.'
              key='no.'
              render={(text, record, index) => (
                <span className='font-semibold'>{currentPageWaitingApprove * DEFAULT_PAGE_SIZE_NUMBER - DEFAULT_PAGE_SIZE_NUMBER + index + 1}</span>
              )}
            />
            <Column
              align='left'
              title='ID'
              key='index'
              dataIndex='id'
              render={(text, _) => {
                return (
                  <Link to={`/dashboard/shop-view/${text}`} className='font-semibold text-blue-500'>
                    <span>#{text}</span>
                  </Link>
                )
              }}
            />
            <Column
              align='left'
              title='Shop Name'
              key='name'
              dataIndex='name'
              render={(text, _) => {
                return (
                  <span className='font-semibold'>{text}</span>
                )
              }}
            />
            <Column
              align='left'
              title='Username'
              key='username'
              dataIndex='username'
              render={(text, _) => (<span className='font-semibold'>{text}</span>)}
            />
            <Column
              align='left'
              title='Email'
              key='email'
              dataIndex='email'
              render={(text, _) => (<span className='font-semibold'>{text}</span>)}
            />
            <Column
              align='left'
              title='Phone'
              key='phone'
              dataIndex='phone'
              render={(text, _) => (<span className='font-semibold'>{text}</span>)}
            />
            <Column
              align='left'
              title='Established Year'
              key='establish_year'
              dataIndex='establish_year'
              render={(text, _) => {
                return (
                  <span>{text}</span>
                )
              }}
            />
            <Column
              align='left'
              title='Work Time'
              key='work_time'
              dataIndex='work_time'
              render={(text, _) => {
                return (
                  <span>{text}</span>
                )
              }}
            />
            <Column
              align='left'
              title='Request Date'
              key='created_at'
              dataIndex='created_at'
              render={(text, _) => {
                return (
                  <span>{format(new Date(text), 'dd-MM-yyyy')}</span>
                )
              }}
            />
            <Column
              align='center'
              title='Action'
              key='action'
              render={(_, record) => (
                <div className="flex flex-row items-center justify-evenly space-x-2 w-full my-1">
                  <button onClick={() => handleApprovedAccount(record)} className='bg-green-200 rounded-md p-1.5'>
                    <FaCheck size={18} className='text-green-600' />
                  </button>
                  <button onClick={() => handleBlock(record)} className='bg-red-200 rounded-md p-1.5'>
                    <FaWindowClose size={18} className='text-red-600' />
                  </button>
                </div>
              )}
            />
          </Table>
        </div>
      </div>
      <Divider orientation='left'>
        <div className='flex flex-row gap-2 items-center'>
          <IoClose size={20} />
          <span className='text-gray-800 font-bold text-md'>Blocked</span>
        </div>
      </Divider>
      <div className='flex flex-col items-center w-full gap-6 mb-6'>
        <div className='flex flex-row items-center justify-between gap-6 w-full'>
          <div className='flex flex-col items-start'>
            <div className='flex flex-row items-center gap-1 mb-2'>
              <FaCalendarAlt />
              <Tooltip title={TOOLTIP_MESSAGE}>
                <span className='text-md font-semibold'>START DATE <span className='text-red-600'>*</span></span>
              </Tooltip>
            </div>
            <DatePicker
              className='w-52 h-10'
              picker='date'
              defaultValue={startDateBlocked}
              onChange={onChangeStartDateBlocked}
              disabledDate={disabledDate}
            />
          </div>
          <div className='flex flex-col items-start'>
            <div className='flex flex-row items-center gap-1 mb-2'>
              <FaCalendarAlt />
              <Tooltip title={TOOLTIP_MESSAGE}>
                <span className='text-md font-semibold'>END DATE <span className='text-red-600'>*</span></span>
              </Tooltip>
            </div>
            <DatePicker
              className='w-52 h-10'
              picker='date'
              defaultValue={endDateBlocked}
              onChange={onChangeEndDateBlocked}
              disabledDate={disabledDate}
            />
          </div>
          <div className='flex flex-col items-start w-full'>
            <div className='flex flex-row items-center gap-1'>
              <FaSearch />
              <Tooltip title={TOOLTIP_MESSAGE}>
                <p className='text-md font-semibold'>SEARCH BY <span className='text-red-600'>*</span></p>
              </Tooltip>
            </div>
            <Search
              className='mt-2'
              placeholder="Shop name / email / phone"
              enterButton={
                <Button type="primary" disabled={searchShopBlockedInput.trim() === ''}>
                  Search
                </Button>
              }
              size="large"
              onSearch={onSearchBlocked}
              onChange={handleSearchShopBlocked}
              value={searchShopBlockedInput}
            />
          </div>
        </div>
        {/* BLOCKED SHOP */}
        <div className='w-full'>
          <Table
            bordered
            dataSource={listBlockedShops}
            pagination={{
              defaultCurrent: DEFAULT_CURRENT_PAGE_NUMBER,
              defaultPageSize: DEFAULT_PAGE_SIZE_NUMBER,
              hideOnSinglePage: true,
              current: currentPageBlocked,
              pageSizeOptions: allPageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              total: totalBlockedShops,
              showTotal: (totalBlockedShops) => `Total ${totalBlockedShops} blocked shops`,
              onChange: handleClickPaginateBlocked,
              onShowSizeChange: handleShowSizeChangeBlocked
            }}
          >
            <Column
              align='left'
              title='No.'
              key='no.'
              render={(text, record, index) => (
                <span className='font-semibold'>{currentPageBlocked * DEFAULT_PAGE_SIZE_NUMBER - DEFAULT_PAGE_SIZE_NUMBER + index + 1}</span>
              )}
            />
            <Column
              align='left'
              title='ID'
              key='index'
              dataIndex='id'
              render={(text, _) => {
                return (
                  <Link to={`/dashboard/shop-view/${text}`} className='font-semibold text-blue-500'>
                    <span>#{text}</span>
                  </Link>
                )
              }}
            />
            <Column
              align='left'
              title='Shop Name'
              key='name'
              dataIndex='name'
              render={(text, _) => {
                return (
                  <span className='font-semibold'>{text}</span>
                )
              }}
            />
            <Column
              align='left'
              title='Username'
              key='username'
              dataIndex='username'
              render={(text, _) => (<span className='font-semibold'>{text}</span>)}
            />
            <Column
              align='left'
              title='Email'
              key='email'
              dataIndex='email'
              render={(text, _) => (<span className='font-semibold'>{text}</span>)}
            />
            <Column
              align='left'
              title='Phone'
              key='phone'
              dataIndex='phone'
              render={(text, _) => (<span className='font-semibold'>{text}</span>)}
            />
            <Column
              align='left'
              title='Established Year'
              key='establish_year'
              dataIndex='establish_year'
              render={(text, _) => {
                return (
                  <span>{text}</span>
                )
              }}
            />
            <Column
              align='left'
              title='Work Time'
              key='work_time'
              dataIndex='work_time'
              render={(text, _) => {
                return (
                  <span>{text}</span>
                )
              }}
            />
            <Column
              align='left'
              title='Blocked Date'
              key='deleted_at'
              dataIndex='deleted_at'
              render={(text, _) => {
                return (
                  <span>{format(new Date(text), 'dd-MM-yyyy')}</span>
                )
              }}
            />
            <Column
              align='center'
              title='Action'
              key='action'
              render={(_, record) => (
                <div className="flex flex-row items-center justify-evenly space-x-2 w-full my-1">
                  <button onClick={() => handleViewShop(record)} className='bg-purple-200 rounded-md p-1.5'>
                    <FaEye size={18} className='text-purple-600' />
                  </button>
                  <button onClick={() => handleRestore(record)} className='bg-green-200 rounded-md p-1.5'>
                    <FaTrashRestore size={18} className='text-green-600' />
                  </button>
                </div>
              )}
            />
          </Table>
        </div>
      </div>
    </div>
  )
}

export default AdminShopList