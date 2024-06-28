import React, { Fragment, useEffect, useState } from 'react';
import { GiDogHouse } from "react-icons/gi";
import { MdOutlinePets, MdPending, MdPets } from "react-icons/md";
import { Button, Divider, Table } from 'antd';
import { FaEye, FaFilter, FaPencilAlt, FaSearch, FaTrash, FaTrashRestore } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import Search from 'antd/es/input/Search';
import './AdoptRequestList.scss'
import { toast } from 'react-toastify';
import AuthUser from '../../../../utils/AuthUser';
import Column from 'antd/es/table/Column';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { BeatLoader } from 'react-spinners';
import { storage } from '../../../../utils/firebase';
import { getDownloadURL, ref } from 'firebase/storage';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import loadingImg from '../../../../assets/images/loading.png'
import { useAuth } from '../../../../utils/AuthContext';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { FaCheck } from 'react-icons/fa6';

const AdoptRequestList = () => {
  const { http } = AuthUser()
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true);
  const [searchPendingAdoptRequestInput, setSearchPendingAdoptRequest] = useState('');
  const [searchApproveAdoptRequestnput, setSearchApproveAdoptRequest] = useState('');
  const [searchDoneAdoptRequestInput, setSearchDoneAdoptRequest] = useState('');

  // --------------     PAGINATION STATE     --------------
  const DEFAULT_CURRENT_PAGE_NUMBER = 1;
  const DEFAULT_PAGE_SIZE_NUMBER = 10;
  const allPageSize = [10, 20, 30];

  const [currentPagePendingAdoptRequest, setCurrentPagePendingAdoptRequest] = useState(DEFAULT_CURRENT_PAGE_NUMBER);
  const [currentPageApproveAdoptRequest, setCurrentPageApproveAdoptRequest] = useState(DEFAULT_CURRENT_PAGE_NUMBER);
  const [currentPageDoneAdoptRequest, setCurrentPageDoneAdoptRequest] = useState(DEFAULT_CURRENT_PAGE_NUMBER);
  const [pageSizePendingAdoptRequest, setPageSizePendingAdoptRequest] = useState(DEFAULT_PAGE_SIZE_NUMBER);
  const [pageSizeApproveAdoptRequest, setPageSizeApproveAdoptRequest] = useState(DEFAULT_PAGE_SIZE_NUMBER);
  const [pageSizeDoneAdoptRequest, setPageSizeDoneAdoptRequest] = useState(DEFAULT_PAGE_SIZE_NUMBER);

  const [listPendingAdoptRequest, setListPendingAdoptRequest] = useState([]) // Fetch list adopted pets state
  const [totalPendingAdoptRequest, setTotalPendingAdoptRequest] = useState(0); // Fetch total adopted pet state
  const [listApproveAdoptRequest, setListApproveAdoptRequest] = useState([]) // Fetch list unadopted pets state
  const [totalApproveAdoptRequest, setTotalApproveAdoptRequest] = useState(0); // Fetch total unadopted pet state
  const [listDoneAdoptRequest, setListDoneAdoptRequest] = useState([]) // Fetch list deleted pets state
  const [totalDoneAdoptRequest, setTotalDoneAdoptRequest] = useState([]) // Fetch total deleted pets state

  // --------------     FILTER BY     --------------
  const ALL_FILTER = 'All'
  const DOG_FILTER = 'Dog'
  const CAT_FILTER = 'Cat'

  const listFilter = [
    ALL_FILTER,
    DOG_FILTER,
    CAT_FILTER,
  ]

  const [filterPendingAdoptRequest, setFilterPendingAdoptRequest] = useState(ALL_FILTER)
  const [filterApproveAdoptRequest, setFilterApproveAdoptRequest] = useState(ALL_FILTER)
  const [filterDoneAdoptRequest, setFilterDoneAdoptRequest] = useState(ALL_FILTER)

  const handleFilterPendingAdoptRequestChange = (event) => {
    const value = event.target.value
    setFilterPendingAdoptRequest(value)
  }

  const handleFilterApproveAdoptRequestChange = (event) => {
    const value = event.target.value
    setFilterApproveAdoptRequest(value)
  }

  const handleFilterDoneAdoptRequestChange = (event) => {
    const value = event.target.value
    setFilterDoneAdoptRequest(value);
  }

  // --------------     SEARCH PET     --------------
  const handleSearchPendingAdoptRequest = (e) => {
    setSearchPendingAdoptRequest(e.target.value)
  }

  const handleSearchApproveAdoptRequest = (e) => {
    setSearchApproveAdoptRequest(e.target.value)
  }

  const handleSearchDoneAdoptRequest = (e) => {
    setSearchDoneAdoptRequest(e.target.value)
  }

  const onSearchPendingAdoptRequest = async () => {
    try {
      const fetchUrl = `aid-center/adopt-request/search-pending?page_number=${currentPagePendingAdoptRequest}&num_of_page=${pageSizePendingAdoptRequest}&search_term=${searchPendingAdoptRequestInput}`
      const response = await http.get(fetchUrl)
      const pendingAdoptRequest = response.data.data
      const totalPendingAdoptRequest = response.data.pagination.total

      setTotalPendingAdoptRequest(totalPendingAdoptRequest)

      const pendingAdoptRequestWithImagesPromises = pendingAdoptRequest.map(async (adoptRequest) => {
        const imageUrl = await fetchImage(adoptRequest.pet.pet_image);
        const avatarUrl = await fetchImage(adoptRequest.customer.avatar);
        return {
          ...adoptRequest,
          image_url: imageUrl,
          avatar_url: avatarUrl
        };
      })

      const pendingAdoptRequestWithImages = await Promise.all(pendingAdoptRequestWithImagesPromises);
      setListPendingAdoptRequest(pendingAdoptRequestWithImages);

      toast.success('Successfully search pending adopt request', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      })
    } catch (error) {
      console.log(error)
    }
  }

  const onSearchApproveAdoptRequest = async () => {
    try {
      const fetchUrl = `aid-center/adopt-request/search-approve?page_number=${currentPageApproveAdoptRequest}&num_of_page=${pageSizeApproveAdoptRequest}&search_term=${searchApproveAdoptRequestnput}`
      const response = await http.get(fetchUrl)
      const approveAdoptRequest = response.data.data
      const totalApproveAdoptRequest = response.data.pagination.total

      setTotalApproveAdoptRequest(totalApproveAdoptRequest)

      const approveAdoptRequestWithImagesPromises = approveAdoptRequest.map(async (adoptRequest) => {
        const imageUrl = await fetchImage(adoptRequest.pet.pet_image);
        const avatarUrl = await fetchImage(adoptRequest.customer.avatar);
        return {
          ...adoptRequest,
          image_url: imageUrl,
          avatar_url: avatarUrl
        };
      })

      const approveAdoptRequestWithImages = await Promise.all(approveAdoptRequestWithImagesPromises);
      setListApproveAdoptRequest(approveAdoptRequestWithImages);

      toast.success('Successfully search approve adopt request', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      })
    } catch (error) {
      console.log(error)
    }
  }

  const onSearchDoneAdoptRequest = async () => {
    try {
      const fetchUrl = `aid-center/adopt-request/search-done?page_number=${currentPageDoneAdoptRequest}&num_of_page=${pageSizeDoneAdoptRequest}&search_term=${searchDoneAdoptRequestInput}`
      const response = await http.get(fetchUrl)
      const doneAdoptRequest = response.data.data
      const totalDoneAdoptRequest = response.data.pagination.total

      setTotalDoneAdoptRequest(totalDoneAdoptRequest)

      const doneAdoptRequestWithImagesPromises = doneAdoptRequest.map(async (adoptRequest) => {
        const imageUrl = await fetchImage(adoptRequest.pet.pet_image);
        const avatarUrl = await fetchImage(adoptRequest.customer.avatar);
        return {
          ...adoptRequest,
          image_url: imageUrl,
          avatar_url: avatarUrl
        };
      })

      const doneAdoptRequestWithImages = await Promise.all(doneAdoptRequestWithImagesPromises);
      setListDoneAdoptRequest(doneAdoptRequestWithImages);

      toast.success('Successfully search done adopt request', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: 0,
        theme: "colored",
      })
    } catch (error) {
      console.log(error)
    }
  }

  // --------------     ACTION HANDLER     --------------
  const handleApprove = (record) => {
    const adoptRequestId = record.id
    Swal.fire({
      title: 'Approve Adopt Request',
      text: 'Confirm approve this adopt request?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        http.patch(`aid-center/adopt-request/${adoptRequestId}/approve-request`)
          .then((resolve) => {
            if (resolve.status === 404) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: resolve.data.message,
              })
            } else if (resolve.status === 200) {
              Swal.fire({
                icon: "success",
                title: resolve.data.message,
              }).then(() => {
                navigate(0)
              })
            }
          })
          .catch((reject) => {
            console.log(reject)
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong. Try again",
            })
          })
      }
    })
  }

  const handleDone = (record) => {
    const adoptRequestId = record.id
    Swal.fire({
      title: 'Done Adopt Request',
      text: 'Confirm done this adopt request?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'Cancel',
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        http.patch(`aid-center/adopt-request/${adoptRequestId}/done-request`)
          .then((resolve) => {
            if (resolve.status === 404) {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: resolve.data.message,
              })
            } else if (resolve.status === 200) {
              Swal.fire({
                icon: "success",
                title: resolve.data.message,
              }).then(() => {
                navigate(0)
              })
            }
          })
          .catch((reject) => {
            console.log(reject)
            Swal.fire({
              icon: "error",
              title: "Oops...",
              text: "Something went wrong. Try again",
            })
          })
      }
    })
  }

  // --------------------------     Paginate     --------------------------
  const handleClickPaginatePendingAdoptRequest = (page, pageSize) => {
    setCurrentPagePendingAdoptRequest(page)
    setPageSizePendingAdoptRequest(pageSize)
  }

  const handleShowSizePendingAdoptRequestChange = (currentPage, pageSize) => {
    setCurrentPagePendingAdoptRequest(currentPage);
    setPageSizePendingAdoptRequest(pageSize)
  }

  const handleClickPaginateApproveAdoptRequest = (page, pageSize) => {
    setCurrentPageApproveAdoptRequest(page)
    setPageSizeApproveAdoptRequest(pageSize)
  }

  const handleShowSizeApproveAdoptRequestChange = (currentPage, pageSize) => {
    setCurrentPageApproveAdoptRequest(currentPage);
    setPageSizeApproveAdoptRequest(pageSize)
  }

  const handleClickPaginateDoneAdoptRequest = (page, pageSize) => {
    setCurrentPageDoneAdoptRequest(page)
    setPageSizeDoneAdoptRequest(pageSize)
  }

  const handleShowSizeDoneAdoptRequestChange = (currentPage, pageSize) => {
    setCurrentPageDoneAdoptRequest(currentPage);
    setPageSizeDoneAdoptRequest(pageSize)
  }

  // --------------------------     Fetch Firebase Image     --------------------------
  const fetchImage = (imagePath) => {
    return new Promise((resolve, reject) => {
      const imageRef = ref(storage, imagePath);
      getDownloadURL(imageRef)
        .then((url) => {
          resolve(url);
        })
        .catch((error) => {
          console.log(error);
          resolve('');  // Resolve with an empty string if there's an error
        });
    });
  };

  // --------------------------     Fetch Pending Adopt Request API     --------------------------
  useEffect(() => {
    const fetchPendingAdoptRequest = async () => {
      if (loading === false) {
        setLoading(true)
      }

      try {
        const fetchUrl = `aid-center/adopt-request/pending?page_number=${currentPagePendingAdoptRequest}&num_of_page=${pageSizePendingAdoptRequest}&filter=${filterPendingAdoptRequest}`
        const response = await http.get(fetchUrl)
        console.log(response)
        const pendingAdoptRequest = response.data.data
        const totalPendingAdoptRequest = response.data.pagination.total

        setTotalPendingAdoptRequest(totalPendingAdoptRequest)

        const pendingAdoptRequestWithImagesPromises = pendingAdoptRequest.map(async (adoptRequest) => {
          const imageUrl = await fetchImage(adoptRequest.pet.pet_image);
          const avatarUrl = await fetchImage(adoptRequest.customer.avatar);
          return {
            ...adoptRequest,
            image_url: imageUrl,
            avatar_url: avatarUrl
          };
        })

        const pendingAdoptRequestWithImages = await Promise.all(pendingAdoptRequestWithImagesPromises);
        setListPendingAdoptRequest(pendingAdoptRequestWithImages);
        setLoading(false);
      } catch (error) {
        console.log(error)
      }
    }

    fetchPendingAdoptRequest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPagePendingAdoptRequest, pageSizePendingAdoptRequest, filterPendingAdoptRequest, accessToken])

  // --------------------------     Fetch Approve Adopt Request API     --------------------------
  useEffect(() => {
    const fetchApproveAdoptRequest = async () => {
      if (loading === false) {
        setLoading(true)
      }

      try {
        const fetchUrl = `aid-center/adopt-request/approve?page_number=${currentPageApproveAdoptRequest}&num_of_page=${pageSizeApproveAdoptRequest}&filter=${filterApproveAdoptRequest}`
        const response = await http.get(fetchUrl)
        console.log(response)
        const approveAdoptRequest = response.data.data
        const totalApproveAdoptRequest = response.data.pagination.total

        setTotalApproveAdoptRequest(totalApproveAdoptRequest)

        const approveAdoptRequestWithImagesPromises = approveAdoptRequest.map(async (adoptRequest) => {
          const imageUrl = await fetchImage(adoptRequest.pet.pet_image);
          const avatarUrl = await fetchImage(adoptRequest.customer.avatar);
          return {
            ...adoptRequest,
            image_url: imageUrl,
            avatar_url: avatarUrl
          };
        })

        const adoptRequestWithImages = await Promise.all(approveAdoptRequestWithImagesPromises);
        setListApproveAdoptRequest(adoptRequestWithImages);
        setLoading(false);
      } catch (error) {
        console.log(error)
      }
    }

    fetchApproveAdoptRequest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageApproveAdoptRequest, pageSizeApproveAdoptRequest, filterApproveAdoptRequest, accessToken])

  // --------------------------     Fetch Done Adopt Request API     --------------------------
  useEffect(() => {
    const fetchDoneAdoptRequest = async () => {
      if (loading === false) {
        setLoading(true)
      }

      try {
        const fetchUrl = `aid-center/adopt-request/done?page_number=${currentPageDoneAdoptRequest}&num_of_page=${pageSizeDoneAdoptRequest}&filter=${filterDoneAdoptRequest}`
        const response = await http.get(fetchUrl)
        const doneAdoptRequest = response.data.data
        const totalDoneAdoptRequest = response.data.pagination.total

        setTotalDoneAdoptRequest(totalDoneAdoptRequest)

        const doneAdoptRequestWithImagesPromises = doneAdoptRequest.map(async (adoptRequest) => {
          const imageUrl = await fetchImage(adoptRequest.pet.pet_image);
          const avatarUrl = await fetchImage(adoptRequest.customer.avatar);
          return {
            ...adoptRequest,
            image_url: imageUrl,
            avatar_url: avatarUrl
          };
        })

        const doneAdoptRequestWithImages = await Promise.all(doneAdoptRequestWithImagesPromises);
        setListDoneAdoptRequest(doneAdoptRequestWithImages);
        setLoading(false);
      } catch (error) {
        console.log(error)
      }
    }

    fetchDoneAdoptRequest()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageDoneAdoptRequest, pageSizeDoneAdoptRequest, filterDoneAdoptRequest, accessToken])

  if (loading) {
    return (
      <div className='h-full'>
        <BeatLoader className='relative top-1/2 transform -translate-y-1/2' color="#2463eb" size={36} />
      </div>
    )
  }

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-col items-start justify-between bg-white p-6 rounded-md'>
        <Divider orientation='left'>
          <div className='flex flex-row gap-2 items-center'>
            <MdPending />
            <span className='text-gray-800 font-bold text-md'>Pending Adopt Request</span>
          </div>
        </Divider>
        <div className='flex flex-row items-center w-full gap-6 mb-6'>
          <div className='flex flex-row items-center justify-between gap-6'>
            <div className='flex flex-col items-start'>
              <div className='flex flex-row items-center gap-1'>
                <FaFilter />
                <span className='text-md font-semibold'>FILTER BY</span>
              </div>
              <select
                className='minimal w-52 mt-2 h-10 px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:cursor-pointer hover:border-blue-500 transition duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none text-left'
                value={filterPendingAdoptRequest}
                onChange={handleFilterPendingAdoptRequestChange}
              >
                {listFilter.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='flex flex-col items-start w-full'>
            <div className='flex flex-row items-center gap-1'>
              <FaSearch />
              <p className='text-md font-semibold'>SEARCH BY <span className='text-red-600'>*</span></p>
            </div>
            <Search
              className='mt-2'
              placeholder="Pet name / customer name / email / phone"
              enterButton={
                <Button type="primary" disabled={searchPendingAdoptRequestInput.trim() === ''}>
                  Search
                </Button>
              }
              size="large"
              onSearch={onSearchPendingAdoptRequest}
              onChange={handleSearchPendingAdoptRequest}
              value={searchPendingAdoptRequestInput}
            />
          </div>
        </div>
        {/* PENDING ADOPT REQUEST */}
        <div className='w-full'>
          <Table
            bordered
            dataSource={listPendingAdoptRequest}
            pagination={{
              defaultCurrent: DEFAULT_CURRENT_PAGE_NUMBER,
              defaultPageSize: DEFAULT_PAGE_SIZE_NUMBER,
              hideOnSinglePage: true,
              current: currentPagePendingAdoptRequest,
              pageSizeOptions: allPageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              total: totalPendingAdoptRequest,
              showTotal: (totalPendingAdoptRequest) => `Total ${totalPendingAdoptRequest} pending adopt requests`,
              onChange: handleClickPaginatePendingAdoptRequest,
              onShowSizeChange: handleShowSizePendingAdoptRequestChange
            }}
          >
            <Column
              align='left'
              title='No.'
              key='no.'
              render={(text, record, index) => (
                <span className='font-semibold'>{currentPagePendingAdoptRequest * DEFAULT_PAGE_SIZE_NUMBER - DEFAULT_PAGE_SIZE_NUMBER + index + 1}</span>
              )}
            />
            <Column
              align='left'
              title='ID'
              key='index'
              dataIndex='id'
              render={(text, _) => {
                return (
                  // <Link to={`/dashboard/pet-view/${text}`} className='font-semibold text-blue-500'>

                  // </Link>
                  <span>#{text}</span>
                )
              }}
            />
            <Column
              align='left'
              title='Pet Name'
              key='name'
              render={(text, record, index) => {
                return (
                  <div className='flex flex-row items-center gap-3'>
                    <LazyLoadImage
                      key={index}
                      src={record.image_url}
                      alt={`Product ${index}`}
                      className='w-10 h-10 bg-white border-neutral-300 border-2 rounded-md p-1 object-cover'
                      effect='blur'
                      placeholderSrc={loadingImg}
                    />
                    <span className='font-semibold'>{record.pet.pet_name}</span>
                  </div>
                )
              }}
            />
            <Column
              align='left'
              title='Gender'
              key='gender'
              render={(_, record) => <span>{record.pet.pet_gender}</span>}
            />
            <Column
              align='left'
              title='Breed'
              key='breed'
              render={(_, record) => <span>{record.pet.pet_breed}</span>}
            />
            <Column
              align='left'
              title='Type'
              key='type'
              render={(_, record) => <span>{record.pet.pet_type}</span>}
            />
            <Column
              align='left'
              title='Customer'
              key='name'
              render={(_, record, index) => {
                return (
                  <div className='flex items-center justify-start gap-2'>
                    <div>
                      <LazyLoadImage
                        key={index}
                        src={record.avatar_url}
                        alt={`Customer ${index}`}
                        className='w-12 h-12 bg-white border-neutral-300 border-2 rounded-full p-1 object-cover'
                        effect='blur'
                        placeholderSrc={loadingImg}
                      />
                    </div>
                    <div className='flex flex-col items-start justify-center'>
                      <span className='font-semibold'>{record.customer.full_name}</span>
                      <span className='font-normal text-sm'>{record.customer.username}</span>
                    </div>
                  </div>
                )
              }}
            />
            <Column
              align='left'
              title='Email'
              key='email'
              render={(_, record) => record.customer.email}
            />
            <Column
              align='left'
              title='Phone'
              key='phone'
              render={(_, record) => record.customer.phone}
            />
            <Column
              align='center'
              title='Action'
              key='action'
              render={(text, record) => (
                <div className="flex flex-row items-center justify-evenly space-x-2 w-full my-1">
                  <button onClick={() => handleApprove(record)} className='bg-purple-200 rounded-md p-1.5'>
                    <FaCheck size={18} className='text-purple-600' />
                  </button>
                </div>
              )}
            />
          </Table>
        </div>
        {/* DIVIDE LINE */}
        <Divider orientation='left'>
          <div className='flex flex-row gap-2 items-center'>
            <MdOutlinePets />
            <span className='text-gray-800 font-bold text-md'>Approve Adopt Request</span>
          </div>
        </Divider>
        <div className='flex flex-row items-center w-full gap-6 mb-6'>
          <div className='flex flex-row items-center justify-between gap-6'>
            <div className='flex flex-col items-start'>
              <div className='flex flex-row items-center gap-1'>
                <IoCheckmarkCircle />
                <span className='text-md font-semibold'>FILTER BY</span>
              </div>
              <select
                className='minimal w-52 mt-2 h-10 px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:cursor-pointer hover:border-blue-500 transition duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none text-left'
                value={filterApproveAdoptRequest}
                onChange={handleFilterApproveAdoptRequestChange}
              >
                {listFilter.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='flex flex-col items-start w-full'>
            <div className='flex flex-row items-center gap-1'>
              <FaSearch />
              <p className='text-md font-semibold'>SEARCH BY <span className='text-red-600'>*</span></p>
            </div>
            <Search
              className='mt-2'
              placeholder="Pet name / customer name / email / phone"
              enterButton={
                <Button type="primary" disabled={searchApproveAdoptRequestnput.trim() === ''}>
                  Search
                </Button>
              }
              size="large"
              onSearch={onSearchApproveAdoptRequest}
              onChange={handleSearchApproveAdoptRequest}
              value={searchApproveAdoptRequestnput}
            />
          </div>
        </div>
        {/* APPROVE ADOPT REQUEST */}
        <div className='w-full'>
          <Table
            bordered
            dataSource={listApproveAdoptRequest}
            pagination={{
              defaultCurrent: DEFAULT_CURRENT_PAGE_NUMBER,
              defaultPageSize: DEFAULT_PAGE_SIZE_NUMBER,
              hideOnSinglePage: true,
              current: currentPageApproveAdoptRequest,
              pageSizeOptions: allPageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              total: totalApproveAdoptRequest,
              showTotal: (totalApproveAdoptRequest) => `Total ${totalApproveAdoptRequest} approve adopt request`,
              onChange: handleClickPaginateApproveAdoptRequest,
              onShowSizeChange: handleShowSizeApproveAdoptRequestChange
            }}
          >
            <Column
              align='left'
              title='No.'
              key='no.'
              render={(text, record, index) => (
                <span className='font-semibold'>{currentPageApproveAdoptRequest * DEFAULT_PAGE_SIZE_NUMBER - DEFAULT_PAGE_SIZE_NUMBER + index + 1}</span>
              )}
            />
            <Column
              align='left'
              title='UID'
              key='index'
              dataIndex='id'
              render={(text, _) => {
                return (
                  // <Link to={`/dashboard/pet-view/${text}`} className='font-semibold text-blue-500'>
                  // </Link>
                  <span>#{text}</span>
                )
              }}
            />
            <Column
              align='left'
              title='Pet Name'
              key='name'
              render={(_, record, index) => {
                return (
                  <div className='flex flex-row items-center gap-3'>
                    <LazyLoadImage
                      key={index}
                      src={record.image_url}
                      alt={`Product ${index}`}
                      className='w-10 h-10 bg-white border-neutral-300 border-2 rounded-md p-1 object-cover'
                      effect='blur'
                      placeholderSrc={loadingImg}
                    />
                    <span className='font-semibold'>{record.pet.pet_name}</span>
                  </div>
                )
              }}
            />
            <Column
              align='left'
              title='Gender'
              key='gender'
              render={(_, record) => <span>{record.pet.pet_gender}</span>}
            />
            <Column
              align='left'
              title='Breed'
              key='breed'
              render={(_, record) => <span>{record.pet.pet_breed}</span>}
            />
            <Column
              align='left'
              title='Type'
              key='type'
              render={(_, record) => <span>{record.pet.pet_type}</span>}
            />
            <Column
              align='left'
              title='Customer'
              key='name'
              render={(_, record, index) => {
                return (
                  <div className='flex items-center justify-start gap-2'>
                    <div>
                      <LazyLoadImage
                        key={index}
                        src={record.avatar_url}
                        alt={`Customer ${index}`}
                        className='w-12 h-12 bg-white border-neutral-300 border-2 rounded-full p-1 object-cover'
                        effect='blur'
                        placeholderSrc={loadingImg}
                      />
                    </div>
                    <div className='flex flex-col items-start justify-center'>
                      <span className='font-semibold'>{record.customer.full_name}</span>
                      <span className='font-normal text-sm'>{record.customer.username}</span>
                    </div>
                  </div>
                )
              }}
            />
            <Column
              align='left'
              title='Email'
              key='email'
              render={(_, record) => record.customer.email}
            />
            <Column
              align='left'
              title='Phone'
              key='phone'
              render={(_, record) => record.customer.phone}
            />
            <Column
              align='center'
              title='Action'
              key='action'
              render={(_, record) => (
                <div className="flex flex-row items-center justify-evenly space-x-2 w-full my-1">
                  <button onClick={() => handleDone(record)} className='bg-green-200 rounded-md p-1.5'>
                    <MdPets size={18} className='text-green-600' />
                  </button>
                </div>
              )}
            />
          </Table>
        </div>
        {/* DIVIDE LINE */}
        <Divider orientation='left'>
          <div className='flex flex-row gap-2 items-center'>
            <GiDogHouse />
            <span className='text-gray-800 font-bold text-md'>Done Adopt Request</span>
          </div>
        </Divider>
        <div className='flex flex-row items-center w-full gap-6 mb-6'>
          <div className='flex flex-row items-center justify-between gap-6'>
            <div className='flex flex-col items-start'>
              <div className='flex flex-row items-center gap-1'>
                <FaFilter />
                <span className='text-md font-semibold'>FILTER BY</span>
              </div>
              <select
                className='minimal w-52 mt-2 h-10 px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:cursor-pointer hover:border-blue-500 transition duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none text-left'
                value={filterDoneAdoptRequest}
                onChange={handleFilterDoneAdoptRequestChange}
              >
                {listFilter.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className='flex flex-col items-start w-full'>
            <div className='flex flex-row items-center gap-1'>
              <FaSearch />
              <p className='text-md font-semibold'>SEARCH BY <span className='text-red-600'>*</span></p>
            </div>
            <Search
              className='mt-2'
              placeholder="Pet name / customer name / email / phone"
              enterButton={
                <Button type="primary" disabled={searchDoneAdoptRequestInput.trim() === ''}>
                  Search
                </Button>
              }
              size="large"
              onSearch={onSearchDoneAdoptRequest}
              onChange={handleSearchDoneAdoptRequest}
              value={searchDoneAdoptRequestInput}
            />
          </div>
        </div>
        {/* DONE ADOPT REQUEST */}
        <div className='w-full'>
          <Table
            bordered
            dataSource={listDoneAdoptRequest}
            pagination={{
              defaultCurrent: DEFAULT_CURRENT_PAGE_NUMBER,
              defaultPageSize: DEFAULT_PAGE_SIZE_NUMBER,
              hideOnSinglePage: true,
              current: currentPageDoneAdoptRequest,
              pageSizeOptions: allPageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              total: totalDoneAdoptRequest,
              showTotal: (totalDoneAdoptRequest) => `Total ${totalDoneAdoptRequest} done adopt request`,
              onChange: handleClickPaginateDoneAdoptRequest,
              onShowSizeChange: handleShowSizeDoneAdoptRequestChange
            }}
          >
            <Column
              align='left'
              title='No.'
              key='no.'
              render={(text, record, index) => (
                <span className='font-semibold'>{currentPageDoneAdoptRequest * DEFAULT_PAGE_SIZE_NUMBER - DEFAULT_PAGE_SIZE_NUMBER + index + 1}</span>
              )}
            />
            <Column
              align='left'
              title='UID'
              key='index'
              dataIndex='id'
              render={(text, _) => {
                return (
                  // <Link to={`/dashboard/pet-view/${text}`} className='font-semibold text-blue-500'>
                  // </Link>
                  <span>#{text}</span>
                )
              }}
            />
            <Column
              align='left'
              title='Pet Name'
              key='name'
              dataIndex='name'
              render={(_, record, index) => {
                return (
                  <div className='flex flex-row items-center gap-3'>
                    <LazyLoadImage
                      key={index}
                      src={record.image_url}
                      alt={`Product ${index}`}
                      className='w-10 h-10 bg-white border-neutral-300 border-2 rounded-md p-1 object-cover'
                      effect='blur'
                      placeholderSrc={loadingImg}
                    />
                    <span className='font-semibold'>{record.pet.pet_name}</span>
                  </div>
                )
              }}
            />
            <Column
              align='left'
              title='Gender'
              key='gender'
              render={(_, record) => <span>{record.pet.pet_gender}</span>}
            />
            <Column
              align='left'
              title='Breed'
              key='breed'
              render={(_, record) => <span>{record.pet.pet_breed}</span>}
            />
            <Column
              align='left'
              title='Type'
              key='type'
              render={(_, record) => <span>{record.pet.pet_type}</span>}
            />
            <Column
              align='left'
              title='Customer'
              key='name'
              render={(_, record, index) => {
                return (
                  <div className='flex items-center justify-start gap-2'>
                    <div>
                      <LazyLoadImage
                        key={index}
                        src={record.avatar_url}
                        alt={`Customer ${index}`}
                        className='w-12 h-12 bg-white border-neutral-300 border-2 rounded-full p-1 object-cover'
                        effect='blur'
                        placeholderSrc={loadingImg}
                      />
                    </div>
                    <div className='flex flex-col items-start justify-center'>
                      <span className='font-semibold'>{record.customer.full_name}</span>
                      <span className='font-normal text-sm'>{record.customer.username}</span>
                    </div>
                  </div>
                )
              }}
            />
            <Column
              align='left'
              title='Email'
              key='email'
              render={(_, record) => record.customer.email}
            />
            <Column
              align='left'
              title='Phone'
              key='phone'
              render={(_, record) => record.customer.phone}
            />
          </Table>
        </div>
      </div>
    </div>
  )
}

export default AdoptRequestList