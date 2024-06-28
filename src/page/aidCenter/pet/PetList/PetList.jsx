import React, { useEffect, useState } from 'react';
import { FaFilter, FaPlus } from "react-icons/fa6";
import { GiDogHouse } from "react-icons/gi";
import { MdOutlinePets } from "react-icons/md";
import { Button, Divider, Table } from 'antd';
import { FaEye, FaPencilAlt, FaSearch, FaTrash, FaTrashRestore } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import Search from 'antd/es/input/Search';
import './PetList.scss'
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

const PetList = () => {
  const { http } = AuthUser()
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  const [loading, setLoading] = useState(true);
  const [searchAdoptedPetInput, setSearchAdoptedPetInput] = useState('');
  const [searchUnadoptedPetInput, setSearchUnadoptedPetInput] = useState('');
  const [searchDeletedPetInput, setSearchDeletedPetInput] = useState('');

  const handleClickCreateButton = () => {
    navigate('/dashboard/pet-create')
  }

  // --------------     PAGINATION STATE     --------------
  const DEFAULT_CURRENT_PAGE_NUMBER = 1;
  const DEFAULT_PAGE_SIZE_NUMBER = 10;
  const allPageSize = [10, 20, 30];

  const [currentPageAdoptedPet, setCurrentPageAdoptedPet] = useState(DEFAULT_CURRENT_PAGE_NUMBER);
  const [currentPageUnadoptedPet, setCurrentPageUnadoptedPet] = useState(DEFAULT_CURRENT_PAGE_NUMBER);
  const [currentPageDeletedPet, setCurrentPageDeletedPet] = useState(DEFAULT_CURRENT_PAGE_NUMBER);
  const [pageSizeAdoptedPet, setPageSizeAdoptedPet] = useState(DEFAULT_PAGE_SIZE_NUMBER);
  const [pageSizeUnadoptedPet, setPageSizeUnadoptedPet] = useState(DEFAULT_PAGE_SIZE_NUMBER);
  const [pageSizeDeletedPet, setPageSizeDeletedPet] = useState(DEFAULT_PAGE_SIZE_NUMBER);

  const [listAdoptedPets, setListAdoptedPets] = useState([]) // Fetch list adopted pets state
  const [totalAdoptedPets, setTotalAdoptedPets] = useState(0); // Fetch total adopted pet state
  const [listUnadoptedPets, setListUnadoptedPets] = useState([]) // Fetch list unadopted pets state
  const [totalUnadoptedPets, setTotalUnadoptedPets] = useState(0); // Fetch total unadopted pet state
  const [listDeletedPets, setListDeletedPets] = useState([]) // Fetch list deleted pets state
  const [totalDeletedPets, setTotalDeletedPets] = useState([]) // Fetch total deleted pets state

  // --------------     FILTER BY     --------------
  const ALL_FILTER = 'All'
  const DOG_FILTER = 'Dog'
  const CAT_FILTER = 'Cat'

  const listFilter = [
    ALL_FILTER,
    DOG_FILTER,
    CAT_FILTER,
  ]

  const [filterAdoptedPet, setFilterAdoptedPet] = useState(ALL_FILTER)
  const [filterUnadoptedPet, setFilterUnadoptedPet] = useState(ALL_FILTER)
  const [filterDeletedPet, setFilterDeletedPet] = useState(ALL_FILTER)

  const handleFilterAdoptedPetChange = (event) => {
    const value = event.target.value
    setFilterAdoptedPet(value)
  }

  const handleFilterUnadoptedPetChange = (event) => {
    const value = event.target.value
    setFilterUnadoptedPet(value)
  }

  const handleFilterDeletedPetChange = (event) => {
    const value = event.target.value
    setFilterDeletedPet(value);
  }

  // --------------     SEARCH PET     --------------
  const handleSearchAdoptedPet = (e) => {
    setSearchAdoptedPetInput(e.target.value)
  }

  const handleSearchUnadoptedPet = (e) => {
    setSearchUnadoptedPetInput(e.target.value)
  }

  const handleSearchDeletedPet = (e) => {
    setSearchDeletedPetInput(e.target.value)
  }

  const onSearchAdoptedPet = async () => {
    try {
      const fetchUrl = `aid-center/pets/search-adopted-pet?page_number=${currentPageAdoptedPet}&num_of_page=${pageSizeAdoptedPet}&search_term=${searchAdoptedPetInput}`
      const response = await http.get(fetchUrl)
      const adoptedPets = response.data.data
      const totalAdoptedPets = response.data.pagination.total

      setTotalAdoptedPets(totalAdoptedPets)

      const adoptedPetsWithImagesPromises = adoptedPets.map(async (adoptedPet) => {
        const imageUrl = await fetchImage(adoptedPet.image);
        const avatarUrl = await fetchImage(adoptedPet.customer.avatar);
        return {
          ...adoptedPet,
          image_url: imageUrl,
          avatar_url: avatarUrl
        };
      })

      const adoptedPetsWithImages = await Promise.all(adoptedPetsWithImagesPromises);
      setListAdoptedPets(adoptedPetsWithImages);

      toast.success('Successfully search adopted pets', {
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

  const onSearchUnadoptedPet = async () => {
    try {
      const fetchUrl = `aid-center/pets/search-unadopted-pet?page_number=${currentPageUnadoptedPet}&num_of_page=${pageSizeUnadoptedPet}&search_term=${searchUnadoptedPetInput}`
      const response = await http.get(fetchUrl)
      const unadoptedPets = response.data.data
      const totalUnadoptedPets = response.data.pagination.total

      setTotalUnadoptedPets(totalUnadoptedPets)

      const unadoptedPetsWithImagesPromises = unadoptedPets.map(async (unadoptedPet) => {
        const imageUrl = await fetchImage(unadoptedPet.image);
        return {
          ...unadoptedPet,
          image_url: imageUrl,
        };
      })

      const unadoptedPetsWithImages = await Promise.all(unadoptedPetsWithImagesPromises);
      setListUnadoptedPets(unadoptedPetsWithImages);

      toast.success('Successfully search unadopted pets', {
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

  const onSearchDeleted = async () => {
    try {
      const fetchUrl = `aid-center/pets/search-deleted-pet?page_number=${currentPageDeletedPet}&num_of_page=${pageSizeDeletedPet}&search_term=${searchDeletedPetInput}`
      const response = await http.get(fetchUrl)
      const deletedPets = response.data.data
      const totalDeletedPets = response.data.pagination.total

      setTotalDeletedPets(totalDeletedPets)

      const deletedPetsWithImagesPromises = deletedPets.map(async (deletedPet) => {
        const imageUrl = await fetchImage(deletedPet.image);
        return {
          ...deletedPet,
          image_url: imageUrl,
        };
      })

      const deletedPetsWithImages = await Promise.all(deletedPetsWithImagesPromises);
      setListDeletedPets(deletedPetsWithImages);

      toast.success('Successfully search deleted pets', {
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
  const handleViewPet = (record) => {
    navigate(`/dashboard/pet-view/${record.id}`)
  }

  const handleUpdatePet = (record) => {
    navigate(`/dashboard/pet-update/${record.id}`)
  }

  const handleDeletePet = (record) => {
    const petId = record.id
    Swal.fire({
      title: 'Hold up!',
      text: 'Want to delete this pet?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'OK',
      confirmButtonColor: '#d33',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        http.delete(`aid-center/pets/${petId}`)
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
                text: `You can restore pet anytime you want`,
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

  const handleRestorePet = (record) => {
    const petId = record.id
    Swal.fire({
      title: 'Restore',
      text: 'Want to restore this pet?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      confirmButtonColor: '#3085d6',
      cancelButtonText: 'Cancel',
      cancelButtonColor: "#d33",
    }).then((result) => {
      if (result.isConfirmed) {
        http.put(`aid-center/pets/${petId}/restore`)
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
                text: `Please check at selling products table`,
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
  const handleClickPaginateAdoptedPets = (page, pageSize) => {
    setCurrentPageAdoptedPet(page)
    setPageSizeAdoptedPet(pageSize)
  }

  const handleShowSizeAdoptedPetsChange = (currentPage, pageSize) => {
    setCurrentPageAdoptedPet(currentPage);
    setPageSizeAdoptedPet(pageSize)
  }

  const handleClickPaginateUnadoptedPets = (page, pageSize) => {
    setCurrentPageUnadoptedPet(page)
    setPageSizeUnadoptedPet(pageSize)
  }

  const handleShowSizeUnadoptedPetsChange = (currentPage, pageSize) => {
    setCurrentPageUnadoptedPet(currentPage);
    setPageSizeUnadoptedPet(pageSize)
  }

  const handleClickPaginateDeletedPets = (page, pageSize) => {
    setCurrentPageDeletedPet(page)
    setPageSizeDeletedPet(pageSize)
  }

  const handleShowSizeDeletedPetsChange = (currentPage, pageSize) => {
    setCurrentPageDeletedPet(currentPage);
    setPageSizeDeletedPet(pageSize)
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

  // --------------------------     Fetch Adopted Pets API     --------------------------
  useEffect(() => {
    const fetchAdoptedPets = async () => {
      if (loading === false) {
        setLoading(true)
      }

      try {
        const fetchUrl = `aid-center/pets/adopted/paging?page_number=${currentPageAdoptedPet}&num_of_page=${pageSizeAdoptedPet}&filter=${filterAdoptedPet}`
        const response = await http.get(fetchUrl)
        const adoptedPets = response.data.data
        const totalAdoptedPets = response.data.pagination.total

        setTotalAdoptedPets(totalAdoptedPets)

        const adoptedPetsWithImagesPromises = adoptedPets.map(async (adoptedPet) => {
          const imageUrl = await fetchImage(adoptedPet.image);
          const avatarUrl = await fetchImage(adoptedPet.customer.avatar);
          return {
            ...adoptedPet,
            image_url: imageUrl,
            avatar_url: avatarUrl
          };
        })

        const adoptedPetsWithImages = await Promise.all(adoptedPetsWithImagesPromises);
        setListAdoptedPets(adoptedPetsWithImages);
        setLoading(false);
      } catch (error) {
        console.log(error)
      }
    }

    fetchAdoptedPets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageAdoptedPet, pageSizeAdoptedPet, filterAdoptedPet, accessToken])

  // --------------------------     Fetch Unadopted Pets API     --------------------------
  useEffect(() => {
    const fetchUnadoptedPets = async () => {
      if (loading === false) {
        setLoading(true)
      }

      try {
        const fetchUrl = `aid-center/pets/unadopted/paging?page_number=${currentPageUnadoptedPet}&num_of_page=${pageSizeUnadoptedPet}&filter=${filterUnadoptedPet}`
        const response = await http.get(fetchUrl)
        const unadoptedPets = response.data.data
        const totalUnadoptedPets = response.data.pagination.total

        setTotalUnadoptedPets(totalUnadoptedPets)

        const unadoptedPetsWithImagesPromises = unadoptedPets.map(async (unadoptedPet) => {
          const imageUrl = await fetchImage(unadoptedPet.image);
          return {
            ...unadoptedPet,
            image_url: imageUrl,
          };
        })

        const unadoptedPetsWithImages = await Promise.all(unadoptedPetsWithImagesPromises);
        setListUnadoptedPets(unadoptedPetsWithImages);
        setLoading(false);
      } catch (error) {
        console.log(error)
      }
    }

    fetchUnadoptedPets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageUnadoptedPet, pageSizeUnadoptedPet, filterUnadoptedPet, accessToken])

  // --------------------------     Fetch Deleted Pets API     --------------------------
  useEffect(() => {
    const fetchDeletedPets = async () => {
      if (loading === false) {
        setLoading(true)
      }

      try {
        const fetchUrl = `aid-center/pets/deleted/paging?page_number=${currentPageDeletedPet}&num_of_page=${pageSizeDeletedPet}&filter=${filterDeletedPet}`
        const response = await http.get(fetchUrl)
        const deletedPets = response.data.data
        const totalDeletedPets = response.data.pagination.total

        setTotalDeletedPets(totalDeletedPets)

        const deletedPetsWithImagesPromises = deletedPets.map(async (deletedPet) => {
          const imageUrl = await fetchImage(deletedPet.image);
          return {
            ...deletedPet,
            image_url: imageUrl,
          };
        })

        const deletedPetsWithImages = await Promise.all(deletedPetsWithImagesPromises);
        setListDeletedPets(deletedPetsWithImages);
        setLoading(false);
      } catch (error) {
        console.log(error)
      }
    }

    fetchDeletedPets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPageDeletedPet, pageSizeDeletedPet, filterDeletedPet, accessToken])

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
        <div className='flex flex-row items-start justify-end w-full mb-6'>
          <button
            onClick={handleClickCreateButton}
            className='flex flex-row items-center gap-2 px-4 py-2 bg-blue-600 rounded-md hover:opacity-80 transition duration-300'
          >
            <FaPlus size={18} style={{ color: 'white' }} />
            <p className='text text-[16] text-white'>Create</p>
          </button>
        </div>
        <Divider orientation='left'>
          <div className='flex flex-row gap-2 items-center'>
            <GiDogHouse />
            <span className='text-gray-800 font-bold text-md'>Adopted Pets</span>
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
                value={filterAdoptedPet}
                onChange={handleFilterAdoptedPetChange}
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
                <Button type="primary" disabled={searchAdoptedPetInput.trim() === ''}>
                  Search
                </Button>
              }
              size="large"
              onSearch={onSearchAdoptedPet}
              onChange={handleSearchAdoptedPet}
              value={searchAdoptedPetInput}
            />
          </div>
        </div>
        {/* ADOPTED PETS */}
        <div className='w-full'>
          <Table
            bordered
            dataSource={listAdoptedPets}
            pagination={{
              defaultCurrent: DEFAULT_CURRENT_PAGE_NUMBER,
              defaultPageSize: DEFAULT_PAGE_SIZE_NUMBER,
              hideOnSinglePage: true,
              current: currentPageAdoptedPet,
              pageSizeOptions: allPageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              total: totalAdoptedPets,
              showTotal: (totalAdoptedPets) => `Total ${totalAdoptedPets} adopted pets`,
              onChange: handleClickPaginateAdoptedPets,
              onShowSizeChange: handleShowSizeAdoptedPetsChange
            }}
          >
            <Column
              align='left'
              title='No.'
              key='no.'
              render={(text, record, index) => (
                <span className='font-semibold'>{currentPageAdoptedPet * DEFAULT_PAGE_SIZE_NUMBER - DEFAULT_PAGE_SIZE_NUMBER + index + 1}</span>
              )}
            />
            <Column
              align='left'
              title='ID'
              key='index'
              dataIndex='id'
              render={(text, _) => {
                return (
                  <Link to={`/dashboard/pet-view/${text}`} className='font-semibold text-blue-500'>
                    <span>#{text}</span>
                  </Link>
                )
              }}
            />
            <Column
              align='left'
              title='Pet Name'
              key='name'
              dataIndex='name'
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
                    <span className='font-semibold'>{text}</span>
                  </div>
                )
              }}
            />
            <Column
              align='left'
              title='Gender'
              key='gender'
              dataIndex='gender'
              render={(text, _) => text}
            />
            <Column
              align='left'
              title='Breed'
              key='breed'
              render={(_, record) => record.breed.name}
            />
            <Column
              align='left'
              title='Type'
              key='type'
              render={(_, record) => record.breed.type}
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
                  <button onClick={() => handleViewPet(record)} className='bg-purple-200 rounded-md p-1.5'>
                    <FaEye size={18} className='text-purple-600' />
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
            <span className='text-gray-800 font-bold text-md'>Unadopted Pets</span>
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
                value={filterUnadoptedPet}
                onChange={handleFilterUnadoptedPetChange}
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
              placeholder="Pet Name"
              enterButton={
                <Button type="primary" disabled={searchUnadoptedPetInput.trim() === ''}>
                  Search
                </Button>
              }
              size="large"
              onSearch={onSearchUnadoptedPet}
              onChange={handleSearchUnadoptedPet}
              value={searchUnadoptedPetInput}
            />
          </div>
        </div>
        {/* UNADOPTED PETS */}
        <div className='w-full'>
          <Table
            bordered
            dataSource={listUnadoptedPets}
            pagination={{
              defaultCurrent: DEFAULT_CURRENT_PAGE_NUMBER,
              defaultPageSize: DEFAULT_PAGE_SIZE_NUMBER,
              hideOnSinglePage: true,
              current: currentPageUnadoptedPet,
              pageSizeOptions: allPageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              total: totalUnadoptedPets,
              showTotal: (totalUnadoptedPets) => `Total ${totalUnadoptedPets} unadopted pets`,
              onChange: handleClickPaginateUnadoptedPets,
              onShowSizeChange: handleShowSizeUnadoptedPetsChange
            }}
          >
            <Column
              align='left'
              title='No.'
              key='no.'
              render={(text, record, index) => (
                <span className='font-semibold'>{currentPageUnadoptedPet * DEFAULT_PAGE_SIZE_NUMBER - DEFAULT_PAGE_SIZE_NUMBER + index + 1}</span>
              )}
            />
            <Column
              align='left'
              title='UID'
              key='index'
              dataIndex='id'
              render={(text, _) => {
                return (
                  <Link to={`/dashboard/pet-view/${text}`} className='font-semibold text-blue-500'>
                    <span>#{text}</span>
                  </Link>
                )
              }}
            />
            <Column
              align='left'
              title='Pet Name'
              key='name'
              dataIndex='name'
              render={(text, record, index) => {
                return (
                  <div className='flex flex-row items-center gap-3'>
                    <LazyLoadImage
                      key={index}
                      src={record.image_url}
                      alt={`Product Deleted ${index}`}
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
              title='Gender'
              key='gender'
              dataIndex='gender'
              render={(text, _) => text}
            />
            <Column
              align='left'
              title='Breed'
              key='breed'
              render={(_, record) => record.breed.name}
            />
            <Column
              align='left'
              title='Type'
              key='type'
              render={(_, record) => record.breed.type}
            />
            <Column
              align='left'
              title='Created Date'
              key='created_date'
              dataIndex='created_at'
              render={(text, _) => {
                const formatTime = (time) => {
                  return format(new Date(time), 'EEEE, dd-MM-yyyy');
                };

                return (
                  <span>{formatTime(text)}</span>
                )
              }}
            />
            <Column
              align='center'
              title='Action'
              key='action'
              render={(_, record) => (
                <div className="flex flex-row items-center justify-evenly space-x-2 w-full my-1">
                  <button onClick={() => handleViewPet(record)} className='bg-purple-200 rounded-md p-1.5'>
                    <FaEye size={18} className='text-purple-600' />
                  </button>
                  <button onClick={() => handleUpdatePet(record)} className='bg-blue-200 rounded-md p-1.5'>
                    <FaPencilAlt size={18} className='text-blue-600' />
                  </button>
                  <button onClick={() => handleDeletePet(record)} className='bg-red-200 rounded-md p-1.5'>
                    <FaTrash size={18} className='text-red-600' />
                  </button>
                </div>
              )}
            />
          </Table>
        </div>
        {/* DIVIDE LINE */}
        <Divider orientation='left'>
          <div className='flex flex-row gap-2 items-center'>
            <FaTrash />
            <span className='text-gray-800 font-bold text-md'>Deleted Pets</span>
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
                value={filterDeletedPet}
                onChange={handleFilterDeletedPetChange}
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
              placeholder="Pet Name"
              enterButton={
                <Button type="primary" disabled={searchDeletedPetInput.trim() === ''}>
                  Search
                </Button>
              }
              size="large"
              onSearch={onSearchDeleted}
              onChange={handleSearchDeletedPet}
              value={searchDeletedPetInput}
            />
          </div>
        </div>
        {/* DELETED PETS */}
        <div className='w-full'>
          <Table
            bordered
            dataSource={listDeletedPets}
            pagination={{
              defaultCurrent: DEFAULT_CURRENT_PAGE_NUMBER,
              defaultPageSize: DEFAULT_PAGE_SIZE_NUMBER,
              hideOnSinglePage: true,
              current: currentPageDeletedPet,
              pageSizeOptions: allPageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              total: totalDeletedPets,
              showTotal: (totalDeletedPets) => `Total ${totalDeletedPets} deleted pets`,
              onChange: handleClickPaginateDeletedPets,
              onShowSizeChange: handleShowSizeDeletedPetsChange
            }}
          >
            <Column
              align='left'
              title='No.'
              key='no.'
              render={(text, record, index) => (
                <span className='font-semibold'>{currentPageDeletedPet * DEFAULT_PAGE_SIZE_NUMBER - DEFAULT_PAGE_SIZE_NUMBER + index + 1}</span>
              )}
            />
            <Column
              align='left'
              title='UID'
              key='index'
              dataIndex='id'
              render={(text, _) => {
                return (
                  <Link to={`/dashboard/pet-view/${text}`} className='font-semibold text-blue-500'>
                    <span>#{text}</span>
                  </Link>
                )
              }}
            />
            <Column
              align='left'
              title='Pet Name'
              key='name'
              dataIndex='name'
              render={(text, record, index) => {
                return (
                  <div className='flex flex-row items-center gap-3'>
                    <LazyLoadImage
                      key={index}
                      src={record.image_url}
                      alt={`Product Deleted ${index}`}
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
              title='Gender'
              key='gender'
              dataIndex='gender'
              render={(text, _) => text}
            />
            <Column
              align='left'
              title='Breed'
              key='breed'
              render={(_, record) => record.breed.name}
            />
            <Column
              align='left'
              title='Type'
              key='type'
              render={(_, record) => record.breed.type}
            />
            <Column
              align='left'
              title='Deleted Date'
              key='deleted_date'
              dataIndex='deleted_at'
              render={(text, _) => {
                const formatTime = (time) => {
                  return format(new Date(time), 'EEEE, dd-MM-yyyy');
                };

                return (
                  <span>{formatTime(text)}</span>
                )
              }}
            />
            <Column
              align='center'
              title='Action'
              key='action'
              render={(_, record) => (
                <div className="flex flex-row items-center justify-evenly space-x-2 w-full my-1">
                  <button onClick={() => handleViewPet(record)} className='bg-purple-200 rounded-md p-1.5'>
                    <FaEye size={18} className='text-purple-600' />
                  </button>
                  <button onClick={() => handleRestorePet(record)} className='bg-green-200 rounded-md p-1.5'>
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

export default PetList