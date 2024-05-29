import React, { Fragment, useEffect, useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaClockRotateLeft, FaFilter, FaStar } from "react-icons/fa6";
import { FaBagShopping } from "react-icons/fa6";
import { Select, Table } from 'antd';
import { MdCategory, MdOutlinePets, MdTableRows } from "react-icons/md";
import { VscFeedback } from "react-icons/vsc";
import { FaEye, FaPencilAlt, FaSearch, FaTrash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Search from 'antd/es/input/Search';
import './ProductList.scss'
import { toast } from 'react-toastify';
import AuthUser from '../../../../utils/AuthUser';
import currency from '../../../../utils/currency';
import { BiSolidCategory } from 'react-icons/bi';
import Column from 'antd/es/table/Column';

function BoxWrapper({ children, className, menuPosition = 'bottom-0 right-4', isLastCard = false }) {
  return (
    <div className={`relative rounded-lg p-4 flex-1 flex items-center justify-between shadow-lg ${className}`}>
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
                    className={`${focus ? 'bg-gray-100' : ''} flex items-center gap-2 p-2 text-sm text-gray-700 w-full`}
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

const ProductList = () => {
  const { http } = AuthUser()
  const navigate = useNavigate()

  // --------------     PAGINATION STATE     --------------
  const DEFAULT_CURRENT_PAGE_NUMBER = 1;
  const DEFAULT_PAGE_SIZE_NUMBER = 10;
  const allPageSize = [10, 20, 30];
  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE_NUMBER);
  const [listProducts, setListProducts] = useState([]) // Fetch list products state
  const [totalProducts, setTotalProducts] = useState(0); // Fetch total products state

  // --------------     RATING BY     --------------
  const allRating = [5, 4, 3, 2, 1]
  const [rating, setRating] = useState(5)
  const ratingOptions = allRating.map(item => (
    { value: item, label: <span>{`${item} Star`}</span> }
  ))

  const handleRatingChange = (value) => {
    setRating(value);
  }

  // --------------     CATEGORY BY     --------------
  const [category, setCategory] = useState()
  const [listCategories, setListCategories] = useState([])
  const categoryOptions = listCategories.map(item => (
    { value: item, label: <span>{item}</span> }
  ))

  const handleCategoryChange = (value) => {
    setCategory(value)
  }

  // --------------     TARGET BY     --------------
  const allTarget = ['dog', 'cat']
  const [target, setTarget] = useState('Dog')
  const targetOptions = allTarget.map(item => (
    { value: item, label: <span>{item.charAt(0).toUpperCase() + item.slice(1)}</span> }
  ))

  const handleTargetChange = (value) => {
    setTarget(value);
  }

  // --------------     FILTER BY     --------------
  const ALL_FILTER = 'All'
  const BEST_SELLING_FILTER = 'Best Selling'
  const HIGHEST_RATING_FILTER = 'Highest Rating'
  const PRICE_ASCENDING_FILTER = 'Price Acsending'
  const PRICE_DESCENDING_FILTER = 'Price Descending'

  const allFilter = [ALL_FILTER, BEST_SELLING_FILTER, HIGHEST_RATING_FILTER, PRICE_ASCENDING_FILTER, PRICE_DESCENDING_FILTER]
  const [filter, setFilter] = useState('All')
  const filterOptions = allFilter.map(item => (
    { value: item, label: <span>{item}</span> }
  ))

  const handleFilterChange = (value) => {
    setFilter(value);
  }

  // --------------     SEARCH PRODUCT     --------------
  const onSearch = (value, _e, info) => {
    http.get(`shop/products/search?page_number=${currentPage}&num_of_page=${pageSize}&name=${value}`)
      .then((resolve) => {
        console.log('List Products:', resolve)
        setListProducts(resolve.data.data)
        setTotalProducts(resolve.data.pagination.total)

        toast.success('Successfully search product', {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: 0,
          theme: "colored",
        })
      })
      .catch((reject) => {
        console.log(reject)
      })
  }

   // --------------     ACTION HANDLER     --------------
  const handleViewProduct = () => {
    navigate('/dashboard/product-view')
  }

  const handleUpdateProduct = () => {
    toast.error('Please input all fields', {
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

  const handleDeleteProduct = () => {

  }

  // --------------------------     Paginate     --------------------------
  const handleClickPaginate = (page, pageSize) => {
    console.log(`(onChange) Page: ${page}, Page Size: ${pageSize}`);
    setCurrentPage(page);
  }

  const handleShowSizeChange = (currentPage, pageSize) => {
    console.log(`(onShowSizeChange) Page: ${currentPage}, Page Size: ${pageSize}`);
    setCurrentPage(currentPage);
    setPageSize(pageSize);
  }

  // --------------------------     Fetch API     --------------------------
  useEffect(() => {
    const fetchData = () => {
      http.get('shop/product-categories/type')
        .then((resolve) => {
          console.log('Product Categories Type:', resolve)
          setCategory(resolve.data.data[0])
          setListCategories(resolve.data.data)
        })
        .catch((reject) => {
          console.log(reject);
        })
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // --------------------------     Fetch Filter API     --------------------------
  useEffect(() => {
    const fetchData = () => {
      if (filter === ALL_FILTER) {
        http.get(`shop/products/paginate?page_number=${currentPage}&num_of_page=${pageSize}`)
          .then((resolve) => {
            console.log('List Products:', resolve)
            setListProducts(resolve.data.data)
            setTotalProducts(resolve.data.total_products)
          })
          .catch((reject) => {
            console.log(reject)
          })
      } else if (filter === BEST_SELLING_FILTER) {
        http.get(`shop/products/best-selling?page_number=${currentPage}&num_of_page=${pageSize}`)
          .then((resolve) => {
            console.log('List Products:', resolve)
            setListProducts(resolve.data.data)
            setTotalProducts(resolve.data.total_products)

            toast.success('Successfully filtered by best-selling', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: 0,
              theme: "colored",
            })
          })
          .catch((reject) => {
            console.log(reject)
          })
      } else if (filter === HIGHEST_RATING_FILTER) {
        http.get(`shop/products/highest-rating?page_number=${currentPage}&num_of_page=${pageSize}`)
          .then((resolve) => {
            console.log('List Products:', resolve)
            setListProducts(resolve.data.data)
            setTotalProducts(resolve.data.total_products)

            toast.success('Successfully filtered by highest rating', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: 0,
              theme: "colored",
            })
          })
          .catch((reject) => {
            console.log(reject)
          })
      } else if (filter === PRICE_ASCENDING_FILTER) {
        http.get(`shop/products/sort?page_number=${currentPage}&num_of_page=${pageSize}`)
          .then((resolve) => {
            console.log('List Products:', resolve)
            setListProducts(resolve.data.data)
            setTotalProducts(resolve.data.pagination.total)

            toast.success('Successfully filtered by ascending price', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: 0,
              theme: "colored",
            })
          })
          .catch((reject) => {
            console.log(reject)
          })
      } else if (filter === PRICE_DESCENDING_FILTER) {
        http.get(`shop/products/sort?page_number=${currentPage}&num_of_page=${pageSize}&order=desc`)
          .then((resolve) => {
            console.log('List Products:', resolve)
            setListProducts(resolve.data.data)
            setTotalProducts(resolve.data.pagination.total)

            toast.success('Successfully filtered by descending price', {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: 0,
              theme: "colored",
            })
          })
          .catch((reject) => {
            console.log(reject)
          })
      }
    }

    fetchData()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, pageSize, filter])

  return (
    <div className='flex flex-col gap-4'>
      <div className='flex flex-row justify-between items-center gap-10 mt-4'>
        <BoxWrapper className="bg-gradient-to-t from-blue-600 to-blue-400 text-white">
          <div className="flex flex-col items-start justify-between w-full pl-2">
            <div className="flex items-center">
              <strong className="text-2xl font-bold">547</strong>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-semibold">Total Products</span>
              <span className="text-md">+95% Last Month</span>
            </div>
          </div>
          <div className='absolute -top-6 right-5 text-blue-300'>
            <FaBagShopping size={50} />
          </div>
        </BoxWrapper>
        <BoxWrapper className="bg-gradient-to-t from-green-600 to-green-400 text-white">
          <div className="flex flex-col items-start justify-between w-full pl-2">
            <div className="flex items-center">
              <strong className="text-2xl font-bold">605</strong>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-semibold">Total Categories</span>
              <span className="text-md">+95% Last Month</span>
            </div>
          </div>
          <div className='absolute -top-6 right-5 text-green-300'>
            <MdCategory size={50} />
          </div>
        </BoxWrapper>
        <BoxWrapper className="bg-gradient-to-t from-purple-600 to-purple-400 text-white">
          <div className="flex flex-col items-start justify-between w-full pl-2">
            <div className="flex items-center">
              <strong className="text-2xl font-bold">428</strong>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-xl font-semibold">Total Ratings</span>
              <span className="text-md">+95% Last Month</span>
            </div>
          </div>
          <div className='absolute -top-6 right-5 text-purple-300'>
            <VscFeedback size={50} />
          </div>
        </BoxWrapper>
      </div>
      <div className='flex flex-col items-start justify-between bg-white p-6 rounded-md'>
        <div className='flex flex-row items-center w-full gap-6 mb-6'>
          <div className='flex flex-row items-center justify-between gap-6'>
            <div className='flex flex-col items-start'>
              <div className='flex flex-row items-center gap-1'>
                <FaStar />
                <span className='text-md font-semibold'>RATING BY</span>
              </div>
              <Select
                className='w-28 mt-2 h-10'
                value={rating}
                options={ratingOptions}
                onChange={handleRatingChange}
              />
            </div>
            <div className='flex flex-col items-start'>
              <div className='flex flex-row items-center gap-1'>
                <BiSolidCategory />
                <span className='text-md font-semibold'>CATEGORY BY</span>
              </div>
              <Select
                className='w-60 mt-2 h-10'
                value={category}
                options={categoryOptions}
                onChange={handleCategoryChange}
              />
            </div>
            <div className='flex flex-col items-start'>
              <div className='flex flex-row items-center gap-1'>
                <MdOutlinePets />
                <span className='text-md font-semibold'>TARGET BY</span>
              </div>
              <Select
                className='w-28 mt-2 h-10'
                value={target}
                options={targetOptions}
                onChange={handleTargetChange}
              />
            </div>
          </div>
          <div className='flex flex-col items-start'>
            <div className='flex flex-row items-center gap-1'>
              <FaFilter />
              <span className='text-md font-semibold'>FILTER BY</span>
            </div>
            <Select
              className='w-44 mt-2 h-10'
              value={filter}
              options={filterOptions}
              onChange={handleFilterChange}
            />
          </div>
          <div className='flex flex-col items-start w-full'>
            <div className='flex flex-row items-center gap-1'>
              <FaSearch />
              <span className='text-md font-semibold'>SEARCH BY</span>
            </div>
            <Search
              className='mt-2'
              placeholder="Search Product"
              allowClear
              enterButton="Search"
              size="large"
              onSearch={onSearch}
            />
          </div>
        </div>
        <div className='w-full'>
          <Table
            bordered
            dataSource={listProducts}
            pagination={{
              defaultCurrent: DEFAULT_CURRENT_PAGE_NUMBER,
              defaultPageSize: DEFAULT_PAGE_SIZE_NUMBER,
              hideOnSinglePage: true,
              current: currentPage,
              pageSizeOptions: allPageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              total: totalProducts,
              showTotal: (totalProducts) => `Total ${totalProducts} products`,
              onChange: handleClickPaginate,
              onShowSizeChange: handleShowSizeChange
            }}
          >
            <Column
              align='left'
              title='UID'
              key='index'
              render={(text, record, index) => (
                <span className='font-semibold'>#{currentPage * DEFAULT_PAGE_SIZE_NUMBER - DEFAULT_PAGE_SIZE_NUMBER + index + 1}</span>
              )}
            />
            <Column
              align='left'
              title='Product Name'
              key='name'
              dataIndex='name'
              render={(text, record) => <span className='font-semibold'>{text}</span>}
            />
            <Column
              align='left'
              title='Category'
              key='category'
              dataIndex='category'
              render={(text, record) => text.name} // Renderer of the table cell. The return value should be a ReactNode (function(text, record, index) {})
            />
            <Column
              align='left'
              title='Target'
              key='target'
              dataIndex={['category', 'target']} // Display field of the data record, support nest path by string array
              render={(text, record) => text.charAt(0).toUpperCase() + text.slice(1)}
            />
            <Column
              align='left'
              title='Price'
              key='price'
              dataIndex='price'
              render={(text, record) => <span className='font-semibold'>{currency(text)}</span>}
            />
            <Column
              align='left'
              title='Stock'
              key='stock'
              dataIndex='quantity'
            />
            <Column
              align='left'
              title='Solded'
              key='sold_quantity'
              dataIndex='sold_quantity'
            />
            <Column
              align='left'
              title='Rating'
              key='rating'
              dataIndex='rating'
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
              key='solded'
              dataIndex='rating'
              render={() => (
                <div className="flex flex-row items-center justify-evenly space-x-2 w-full my-1">
                  <button onClick={handleViewProduct} className='bg-purple-200 rounded-md p-1.5'>
                    <FaEye size={18} className='text-purple-600' />
                  </button>
                  <button onClick={handleUpdateProduct} className='bg-green-200 rounded-md p-1.5'>
                    <FaPencilAlt size={18} className='text-green-600' />
                  </button>
                  <button onClick={handleDeleteProduct} className='bg-red-200 rounded-md p-1.5'>
                    <FaTrash size={18} className='text-red-600' />
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

export default ProductList