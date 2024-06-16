import React, { useState, Fragment, useEffect } from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaClockRotateLeft, FaFileInvoiceDollar } from "react-icons/fa6";
import { FaBagShopping } from "react-icons/fa6";
import { Button, DatePicker, Divider, Table, Tooltip } from 'antd';
import { MdCategory } from "react-icons/md";
import { VscFeedback } from "react-icons/vsc";
import { FaEye, FaTrash, FaCalendarAlt, FaSearch } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import Search from 'antd/es/input/Search';
import './InvoiceList.scss'
import { BeatLoader } from 'react-spinners';
import AuthUser from '../../../../utils/AuthUser';
import { useAuth } from '../../../../utils/AuthContext';
import { AiFillProduct } from 'react-icons/ai';
import dayjs from 'dayjs';
import Column from 'antd/es/table/Column';
import loadingImg from '../../../../assets/images/loading.png'
import paypalLogo from '../../../../assets/images/paypal_logo.png'
import codLogo from '../../../../assets/images/cod_logo.png'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import getOrderStatus from '../../../../utils/orderStatus';
import { getDownloadURL, ref } from 'firebase/storage';
import { storage } from '../../../../utils/firebase';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

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

const InvoiceList = () => {
  const { http } = AuthUser()
  const { accessToken } = useAuth()
  const navigate = useNavigate()

  const TOOLTIP_MESSAGE = "Working with other * to search"
  const COD_PAYMENT_METHOD = 'COD'
  const PAYPAL_PAYMENT_METHOD = 'Paypal'

  const [loading, setLoading] = useState(true);
  const [searchInvoiceInput, setSearchInvoiceInput] = useState('');

  // --------------     PAGINATION STATE     --------------
  const DEFAULT_CURRENT_PAGE_NUMBER = 1;
  const DEFAULT_PAGE_SIZE_NUMBER = 10;
  const allPageSize = [10, 20, 30];

  const [currentPage, setCurrentPage] = useState(DEFAULT_CURRENT_PAGE_NUMBER);
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE_NUMBER);

  const [listInvoices, setListInvoices] = useState([]) // Fetch list invoices state
  const [totalInvoices, setTotalInvoices] = useState(0); // Fetch total invoices state

  const ALL_FILTER_STATUS = 'All'
  const PAID_FILTER_STATUS = 'Paid'
  const CREATED_FILTER_STATUS = 'Created'
  const DELIVERING_FILTER_STATUS = 'Delivering'
  const DONE_FILTER_STATUS = 'Done'

  const listFilterStatus = [
    ALL_FILTER_STATUS,
    PAID_FILTER_STATUS,
    CREATED_FILTER_STATUS,
    DELIVERING_FILTER_STATUS,
    DONE_FILTER_STATUS
  ]

  const [invoiceStatusFilter, setInvoiceStatusFilter] = useState(ALL_FILTER_STATUS)
  const [startDate, setStartDate] = useState(() => dayjs())
  const [endDate, setEndDate] = useState(() => dayjs())
  const [formattedStartDate, setFormattedStartDate] = useState(() => dayjs().format('YYYY-MM-DD'))
  const [formattedEndDate, setFormattedEndDate] = useState(() => dayjs().format('YYYY-MM-DD'))

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

  const disabledDate = (current) => {
    // Can not select days after today
    return current && current > dayjs().endOf('day');
  };

  const handleInvoiceStatusChange = (event) => {
    const value = event.target.value
    console.log(value)
    setInvoiceStatusFilter(value)
  }

  // --------------     SEARCH PRODUCT     --------------
  const handleSearchInvoice = (e) => {
    setSearchInvoiceInput(e.target.value)
  }

  const onSearch = async () => {
    try {
      const fetchUrl = `shop/orders/paging?page_number=${currentPage}&num_of_page=${pageSize}&start_date=${formattedStartDate}&end_date=${formattedEndDate}&search_team=${searchInvoiceInput}&status=${invoiceStatusFilter}`
      const response = await http.get(fetchUrl)
      const invoiceData = response.data.data

      if (invoiceData.length === 0) {
        toast.error('No invoice founded', {
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
        const invoiceWithAvatarPromises = invoiceData.map(async (invoice) => {
          const avatarRef = ref(storage, invoice.avatar)
          const avatarUrl = await getDownloadURL(avatarRef)
          return { ...invoice, avatar_url: avatarUrl }
        })
  
        const invoicesWithAvatars = await Promise.all(invoiceWithAvatarPromises);
        setListInvoices(invoicesWithAvatars);
        setTotalInvoices(response.data.total_sub_orders)
  
        toast.success('Successfully search invoice', {
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
  };

  const handleViewInvoice = (record) => {
    navigate(`/dashboard/invoice-view/${record.id}`)
  }

  const handleDeleteInvoice = (record) => {

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

  // --------------------------     Fetch API     --------------------------
  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const fetchUrl = `shop/orders/paging?page_number=${currentPage}&num_of_page=${pageSize}&start_date=${formattedStartDate}&end_date=${formattedEndDate}&status=${invoiceStatusFilter}`
        const response = await http.get(fetchUrl)
        const invoiceData = response.data.data

        if (invoiceData.length === 0 && !loading) {
          toast.error('No invoice founded', {
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
          const invoiceWithAvatarPromises = invoiceData.map(async (invoice) => {
            const avatarRef = ref(storage, invoice.avatar)
            const avatarUrl = await getDownloadURL(avatarRef)
            return { ...invoice, avatar_url: avatarUrl }
          })
  
          const invoicesWithAvatars = await Promise.all(invoiceWithAvatarPromises);
          setListInvoices(invoicesWithAvatars);
          setTotalInvoices(response.data.total_sub_orders)
  
          if (loading) {
            setLoading(false)
          } else {
            toast.success('Successfully retrieved invoice', {
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

    fetchInvoices()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken, currentPage, pageSize, formattedStartDate, formattedEndDate, invoiceStatusFilter])

  if (loading) {
    return (
      <div className='h-full'>
        <BeatLoader className='relative top-1/2 transform -translate-y-1/2' color="#2463eb" size={36} />
      </div>
    )
  }

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
        <Divider orientation='left'>
          <div className='flex flex-row gap-2 items-center'>
            <FaFileInvoiceDollar />
            <span className='text-gray-800 font-bold text-md'>List Invoices</span>
          </div>
        </Divider>
        <div className='flex flex-row items-center justify-between w-full gap-12 mb-6'>
          <div className='flex flex-row items-center gap-6'>
            <div className='flex flex-col items-start'>
              <div className='flex flex-row items-center gap-1'>
                <AiFillProduct />
                <Tooltip title={TOOLTIP_MESSAGE}>
                  <span className='text-md font-semibold'>INVOICE STATUS BY <span className='text-red-600'>*</span></span>
                </Tooltip>
              </div>
              <select
                className='minimal w-52 mt-2 h-10 px-4 py-2 border border-gray-300 rounded-md shadow-sm hover:cursor-pointer hover:border-blue-500 transition duration-200 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none text-left'
                value={invoiceStatusFilter}
                onChange={handleInvoiceStatusChange}
              >
                {listFilterStatus.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
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
              placeholder="name / email"
              enterButton={
                <Button type="primary" disabled={searchInvoiceInput.trim() === ''}>
                  Search
                </Button>
              }
              size="large"
              onSearch={onSearch}
              onChange={handleSearchInvoice}
              value={searchInvoiceInput}
            />
          </div>
        </div>
        <div className='w-full'>
          <Table
            bordered
            dataSource={listInvoices}
            pagination={{
              defaultCurrent: DEFAULT_CURRENT_PAGE_NUMBER,
              defaultPageSize: DEFAULT_PAGE_SIZE_NUMBER,
              hideOnSinglePage: true,
              current: currentPage,
              pageSizeOptions: allPageSize,
              showSizeChanger: true,
              showQuickJumper: true,
              total: totalInvoices,
              showTotal: (totalInvoices) => `Total ${totalInvoices} invoices`,
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
              render={(text, _) => {
                return (
                  <Link to={`/dashboard/invoice-view/${text}`} className='font-semibold text-blue-500'>
                    <span>#{text}</span>
                  </Link>
                )
              }}
            />
            <Column
              align='left'
              title='Customer'
              key='name'
              dataIndex='full_name'
              render={(text, record, index) => {
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
                      <span className='font-semibold'>{text}</span>
                      <span className='font-normal text-sm'>{record.username}</span>
                    </div>
                  </div>
                )
              }}
            />
            <Column
              align='left'
              title='Email'
              key='email'
              dataIndex='email'
              render={(text, _) => <span className='font-normal text-[14px]'>{text}</span>}
            />
            <Column
              align='left'
              title='Address'
              key='address'
              dataIndex='address'
              render={(text, _) => <span className='font-normal text-[14px]'>{text}</span>}
            />
            <Column
              align='left'
              title='Amount'
              key='amount'
              dataIndex='sub_total_prices'
              render={(text, _) => <span className='font-semibold text-[14px]'>{text?.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</span>}
            />
            <Column
              align='left'
              title='Payment Method'
              key='payment_method'
              dataIndex='payment_method'
              render={(text, _) => (
                <div className='flex items-center gap-2'>
                  {(() => {
                    if (text === COD_PAYMENT_METHOD) {
                      return <img src={codLogo} width={40} height={40} alt="payment-method-logo" />
                    } else if (text === PAYPAL_PAYMENT_METHOD) {
                      return <img src={paypalLogo} width={40} height={40} alt="payment-method-logo" /> 
                    } 
                  })()}
                  <span className='font-normal text-[14px]'>{text}</span>
                </div>
              )}
            />
            <Column
              align='left'
              title='Status'
              key='status'
              dataIndex='status'
              render={(text, _) => getOrderStatus(text)}
            />
            <Column
              align='left'
              title='Order Date'
              key='order_date'
              dataIndex='created_at'
              render={(text, _) => <span className='font-normal text-[14px]'>{format(new Date(text), 'EEEE, dd-MM-yyyy')}</span>}
            />
            <Column
              align='center'
              title='Action'
              key='action'
              render={(_, record) => (
                <div className="flex flex-row items-center justify-evenly space-x-2 w-full my-1">
                  <button onClick={() => handleViewInvoice(record)} className='bg-purple-200 rounded-md p-1.5'>
                    <FaEye size={18} className='text-purple-600' />
                  </button>
                  <button onClick={() => handleDeleteInvoice(record)} className='bg-red-200 rounded-md p-1.5'>
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

export default InvoiceList