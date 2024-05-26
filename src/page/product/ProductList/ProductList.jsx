import React, { Fragment } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaClockRotateLeft } from "react-icons/fa6";
import { FaBagShopping } from "react-icons/fa6";
import { Select, Table } from 'antd';
import { MdCategory } from "react-icons/md";
import { VscFeedback } from "react-icons/vsc";
import { FaEye, FaPencilAlt, FaTrash } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Search from 'antd/es/input/Search';
import './ProductList.scss'

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
  const navigate = useNavigate()
  const columns = [
    {
      title: 'Product Name',
      dataIndex: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'age',
    },
    {
      title: 'Target',
      dataIndex: 'address',
    },
    {
      title: 'Price',
      dataIndex: 'age',
    },
    {
      title: 'Stock',
      dataIndex: 'age',
    },
    {
      title: 'Solded',
      dataIndex: 'age',
    },
    {
      title: 'Rating',
      dataIndex: 'age',
    },
    {
      title: 'Action',
      render: (text, record) => (
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
      )
    },
  ];
  const data = [];
  for (let i = 0; i < 46; i++) {
    data.push({
      key: i,
      name: `Edward King ${i}`,
      age: 32,
      address: `London, Park Lane no. ${i}`,
    });
  }

  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };

  const onSearch = (value, _e, info) => console.log(info?.source, value);

  const handleViewProduct = () => {
    navigate('/dashboard/product-view')
  }

  const handleUpdateProduct = () => {
    
  }
  const handleDeleteProduct = () => {
    
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
        <div className='flex flex-row items-center justify-between w-full gap-12 mb-6'>
          <div className='flex flex-row items-center justify-between gap-6'>
            <div className='flex flex-col items-start'>
              <span className='text-md font-semibold'>SHOW BY</span>
              <Select
                defaultValue="10"
                className='w-44 mt-2 h-10'
                options={[
                  { value: '10', label: <span>10 Row</span> },
                  { value: '20', label: <span>20 Row</span> },
                  { value: '30', label: <span>30 Row</span> },
                ]}
              />
            </div>
            <div className='flex flex-col items-start'>
              <span className='text-md font-semibold'>RATING BY</span>
              <Select
                defaultValue="5"
                className='w-44 mt-2 h-10'
                options={[
                  { value: '1', label: <span>1 Star</span> },
                  { value: '2', label: <span>2 Star</span> },
                  { value: '3', label: <span>3 Star</span> },
                  { value: '4', label: <span>4 Star</span> },
                  { value: '5', label: <span>5 Star</span> },
                ]}
              />
            </div>
            <div className='flex flex-col items-start'>
              <span className='text-md font-semibold'>CATEGORY BY</span>
              <Select
                defaultValue="Mans"
                className='w-44 mt-2 h-10'
                options={[
                  { value: 'Mans', label: <span>Mans</span> },
                  { value: 'Womans', label: <span>Womans</span> },
                  { value: 'Kids', label: <span>Kids</span> },
                  { value: 'Accessory', label: <span>Accessory</span> },
                ]}
              />
            </div>
            <div className='flex flex-col items-start'>
              <span className='text-md font-semibold'>TARGET BY</span>
              <Select
                defaultValue="Dog"
                className='w-44 mt-2 h-10'
                options={[
                  { value: 'dog', label: <span>Dog</span> },
                  { value: 'cat', label: <span>Cat</span> },
                ]}
              />
            </div>
          </div>
          <div className='flex flex-col items-start w-full'>
            <span className='text-md font-semibold'>SEARCH BY</span>
            <Search
              placeholder="input search text"
              allowClear
              enterButton="Search"
              size="large"
              className='mt-2'
              onSearch={onSearch}
            />
          </div>
        </div>
        <div className='w-full'>
          <Table
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            bordered
            columns={columns}
            dataSource={data}
          />
        </div>
      </div>
    </div>
  )
}

export default ProductList