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


const AdminMedicalCenterList = () => {
  const { http } = AuthUser()
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  const TOOLTIP_MESSAGE = "Working with other * to search"

  const [loading, setLoading] = useState(true);
  const [searchMedicalCenterInput, setSearchMedicalCenterInput] = useState('')
  const [searchMedicalCenterWaitingApproveInput, setSearchMedicalCenterWaitingApproveInput] = useState('')
  const [searchMedicalCenterBlockedInput, setSearchMedicalCenterBlockedInput] = useState('')

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

  const [listMedicalCenters, setListMedicalCenters] = useState([]);
  const [totalMedicalCenters, setTotalMedicalCenters] = useState(0);
  const [listWaitingApproveMedicalCenters, setListWaitingApproveMedicalCenters] = useState([]);
  const [totalWaitingApproveMedicalCenters, setTotalWaitingApproveMedicalCenters] = useState(0);
  const [listBlockedMedicalCenters, setListBlockedMedicalCenters] = useState([]);
  const [totalBlockedMedicalCenters, setTotalBlockedMedicalCenters] = useState(0);

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
      const fetchUrl = `admin/medical-centers?page_number=${currentPage}&num_of_page=${pageSize}&start_date=${formattedStartDate}&end_date=${formattedEndDate}&search_term=${searchMedicalCenterInput}`
      const response = await http.get(fetchUrl)
      const medicalCenterData = response.data.data

      if (medicalCenterData.length === 0) {
        toast.info('No medical center founded', {
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
        const medicalCenterWithAvatarPromises = medicalCenterData.map(async (shop) => {
          const avatarRef = ref(storage, shop.avatar)
          const avatarUrl = await getDownloadURL(avatarRef)
          return {
            ...shop,
            avatar_url: avatarUrl
          }
        })

        const medicalCenterWithAvatars = await Promise.all(medicalCenterWithAvatarPromises);
        setListMedicalCenters(medicalCenterWithAvatars);
        setTotalMedicalCenters(response.data.total_shops)

        toast.success('Successfully search medical center', {
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
      const fetchUrl = `admin/medical_centers/waiting-approve?page_number=${currentPageWaitingApprove}&num_of_page=${pageSizeWaitingApprove}&start_date=${formattedStartDateWaitingApprove}&end_date=${formattedEndDateWaitingApprove}&search_term=${searchMedicalCenterWaitingApproveInput}`
      const response = await http.get(fetchUrl)
      const medicalCenterData = response.data.data

      if (medicalCenterData.length === 0) {
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
        setListWaitingApproveMedicalCenters(medicalCenterData);
        setTotalWaitingApproveMedicalCenters(response.data.total_medical_centers)

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
      const fetchUrl = `admin/shops/blocked?page_number=${currentPageBlocked}&num_of_page=${pageSizeBlocked}&start_date=${formattedStartDateBlocked}&end_date=${formattedEndDateBlocked}&search_term=${searchMedicalCenterBlockedInput}`
      const response = await http.get(fetchUrl)
      const medicalCenterData = response.data.data

      if (medicalCenterData.length === 0) {
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
        setListBlockedMedicalCenters(medicalCenterData);
        setTotalBlockedMedicalCenters(response.data.total_shops)

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

  const handleViewMedicalCenter = (record) => {
    navigate(`/dashboard/medical-center-view/${record.id}`)
  }

  const handleApprovedAccount = (record) => {
    Swal.fire({
      title: 'Approve this medical center?',
      text: 'You are about to make this account active',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#3fc2ed',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        http.patch(`admin/medical-centers/approve/${record.account_id}`)
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

  const handleBlockMedicalCenter = (record) => {
    Swal.fire({
      title: 'Block this medical center?',
      text: 'You are about to make this account inactive',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        http.patch(`admin/medical-centers/block/${record.account_id}`)
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
      title: 'Restore this medical center?',
      text: 'You are about to make this account active again',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        http.patch(`admin/medical-centers/restore/${record.account_id}`)
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

  // --------------     SEARCH MEDICAL CENTER INPUT     --------------
  const handleSearchMedicalCenter = (e) => {
    setSearchMedicalCenterInput(e.target.value)
  }

  const handleSearchMedicalCenterWaitingApprove = (e) => {
    setSearchMedicalCenterWaitingApproveInput(e.target.value)
  }

  const handleSearchMedicalCenterBlocked = (e) => {
    setSearchMedicalCenterBlockedInput(e.target.value)
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

  // --------------------------     Fetch Medical Center API     --------------------------
  useEffect(() => {
    const fetchMedicalCenters = async () => {
      try {
        const fetchUrl = `admin/medical-centers?page_number=${currentPage}&num_of_page=${pageSize}&start_date=${formattedStartDate}&end_date=${formattedEndDate}`
        const response = await http.get(fetchUrl)
        const medicalCenterData = response.data.data
        console.log(response)

        if (medicalCenterData.length === 0 && !loading) {
          toast.info('No medical center founded', {
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
          const medicalCenterWithAvatarPromises = medicalCenterData.map(async (medicalCenter) => {
            const avatarRef = ref(storage, medicalCenter.avatar)
            const avatarUrl = await getDownloadURL(avatarRef)
            return {
              ...medicalCenter,
              avatar_url: avatarUrl
            }
          })

          const medicalCenterWithAvatar = await Promise.all(medicalCenterWithAvatarPromises)
          setListMedicalCenters(medicalCenterWithAvatar)
          setTotalMedicalCenters(response.data.total_medical_centers)

          if (loading) {
            setLoading(false)
          } else {
            toast.success('Successfully retrieved medical center', {
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

    fetchMedicalCenters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, formattedStartDate, formattedEndDate])

  // --------------------------     Fetch Waiting Approve Medical Center API     --------------------------
  useEffect(() => {
    const fetchWaitingApproveMedicalCenters = async () => {
      try {
        const fetchUrl = `admin/medical-centers/waiting-approve?page_number=${currentPageWaitingApprove}&num_of_page=${pageSizeWaitingApprove}&start_date=${formattedStartDateWaitingApprove}&end_date=${formattedEndDateWaitingApprove}`
        const response = await http.get(fetchUrl)
        const medicalCenterData = response.data.data
        console.log(response)

        if (medicalCenterData.length === 0 && !loading) {
          toast.info('No medical center founded', {
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
          setListWaitingApproveMedicalCenters(medicalCenterData)
          setTotalWaitingApproveMedicalCenters(response.data.total_medical_centers)

          if (loading) {
            setLoading(false)
          } else {
            toast.success('Successfully retrieved waiting approve medical center', {
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

    fetchWaitingApproveMedicalCenters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageWaitingApprove, pageSizeWaitingApprove, formattedStartDateWaitingApprove, formattedEndDateWaitingApprove])

  // --------------------------     Fetch Blocked Medical Center API     --------------------------
  useEffect(() => {
    const fetchBlockedMedicalCenters = async () => {
      try {
        const fetchUrl = `admin/medical-centers/blocked?page_number=${currentPageBlocked}&num_of_page=${pageSizeBlocked}&start_date=${formattedStartDateBlocked}&end_date=${formattedEndDateBlocked}`
        const response = await http.get(fetchUrl)
        const medicalCenterData = response.data.data
        console.log(response)

        if (medicalCenterData.length === 0 && !loading) {
          toast.info('No medical center founded', {
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
          setListBlockedMedicalCenters(medicalCenterData)
          setTotalBlockedMedicalCenters(response.data.total_medical_centers)

          if (loading) {
            setLoading(false)
          } else {
            toast.success('Successfully retrieved blocked medical center', {
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

    fetchBlockedMedicalCenters()
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
              placeholder="Medical center name / email / phone"
              enterButton={
                <Button type="primary" disabled={searchMedicalCenterInput.trim() === ''}>
                  Search
                </Button>
              }
              size="large"
              onSearch={onSearch}
              onChange={handleSearchMedicalCenter}
              value={searchMedicalCenterInput}
            />
          </div>
        </div>
        {/* APPROVED MEDICAL CENTER */}
        <div className='w-full'>
          <Table
            bordered
            dataSource={listMedicalCenters}
            pagination={{
              defaultCurrent: DEFAULT_CURRENT_PAGE_NUMBER,
              defaultPageSize: DEFAULT_PAGE_SIZE_NUMBER,
              hideOnSinglePage: true,
              current: currentPage,
              pageSizeOptions: allPageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              total: totalMedicalCenters,
              showTotal: (totalMedicalCenters) => `Total ${totalMedicalCenters} medical centers`,
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
                  <Link to={`/dashboard/medical-center-view/${text}`} className='font-semibold text-blue-500'>
                    <span>#{text}</span>
                  </Link>
                )
              }}
            />
            <Column
              align='left'
              title='Medical Center Name'
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
                  <button onClick={() => handleViewMedicalCenter(record)} className='bg-purple-200 rounded-md p-1.5'>
                    <FaEye size={18} className='text-purple-600' />
                  </button>
                  <button onClick={() => handleBlockMedicalCenter(record)} className='bg-red-200 rounded-md p-1.5'>
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
              placeholder="Medical center name / email / phone"
              enterButton={
                <Button type="primary" disabled={searchMedicalCenterWaitingApproveInput.trim() === ''}>
                  Search
                </Button>
              }
              size="large"
              onSearch={onSearchWaitingApprove}
              onChange={handleSearchMedicalCenterWaitingApprove}
              value={searchMedicalCenterWaitingApproveInput}
            />
          </div>
        </div>
        {/* WAITING APPROVE SHOP */}
        <div className='w-full'>
          <Table
            bordered
            dataSource={listWaitingApproveMedicalCenters}
            pagination={{
              defaultCurrent: DEFAULT_CURRENT_PAGE_NUMBER,
              defaultPageSize: DEFAULT_PAGE_SIZE_NUMBER,
              hideOnSinglePage: true,
              current: currentPageWaitingApprove,
              pageSizeOptions: allPageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              total: totalWaitingApproveMedicalCenters,
              showTotal: (totalWaitingApproveMedicalCenters) => `Total ${totalWaitingApproveMedicalCenters} waiting approve shops`,
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
                  <Link to={`/dashboard/medical-center-view/${text}`} className='font-semibold text-blue-500'>
                    <span>#{text}</span>
                  </Link>
                )
              }}
            />
            <Column
              align='left'
              title='Medical Center Name'
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
                  <button onClick={() => handleBlockMedicalCenter(record)} className='bg-red-200 rounded-md p-1.5'>
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
              placeholder="Medical center name / email / phone"
              enterButton={
                <Button type="primary" disabled={searchMedicalCenterBlockedInput.trim() === ''}>
                  Search
                </Button>
              }
              size="large"
              onSearch={onSearchBlocked}
              onChange={handleSearchMedicalCenterBlocked}
              value={searchMedicalCenterBlockedInput}
            />
          </div>
        </div>
        {/* BLOCKED MEDICAL CENTER */}
        <div className='w-full'>
          <Table
            bordered
            dataSource={listBlockedMedicalCenters}
            pagination={{
              defaultCurrent: DEFAULT_CURRENT_PAGE_NUMBER,
              defaultPageSize: DEFAULT_PAGE_SIZE_NUMBER,
              hideOnSinglePage: true,
              current: currentPageBlocked,
              pageSizeOptions: allPageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              total: totalBlockedMedicalCenters,
              showTotal: (totalBlockedMedicalCenters) => `Total ${totalBlockedMedicalCenters} blocked medical centers`,
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
                  <Link to={`/dashboard/medical-center-view/${text}`} className='font-semibold text-blue-500'>
                    <span>#{text}</span>
                  </Link>
                )
              }}
            />
            <Column
              align='left'
              title='Medical Center Name'
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
                  <button onClick={() => handleViewMedicalCenter(record)} className='bg-purple-200 rounded-md p-1.5'>
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

export default AdminMedicalCenterList