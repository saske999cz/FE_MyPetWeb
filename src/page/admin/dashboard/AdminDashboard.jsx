import React, { useState, useEffect } from 'react'
import classNames from 'classnames';
import animalShelterLogo from '../../../assets/images/animal_shelter_logo.png'
import medicalCenterLogo from '../../../assets/images/medical_center_logo.png'
import shopLogo from '../../../assets/images/shop_logo.png'
import customerLogo from '../../../assets/images/customer_logo.jpg'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { HiOutlineTrendingDown, HiOutlineTrendingUp } from 'react-icons/hi';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Select } from 'antd';
import AuthUser from '../../../utils/AuthUser';
import './AdminDashboard.scss'
import { BeatLoader } from 'react-spinners';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { getAccountTypeStatus } from '../../../utils/statusLabel';
import { FaCheck, FaEye } from 'react-icons/fa6';
import { FaWindowClose } from 'react-icons/fa';
const { Option } = Select;

// function BoxWrapper({
//   children,
//   className,
//   menuPosition = 'bottom-0 right-4',
//   isLastCard = false,
//   banner,
//   handleDateChange,
// }) {
//   return (
//     <div className={`relative rounded-lg flex-1 flex items-center justify-between shadow-lg ${className}`}>
//       {children}
//       <Menu as="div" className={`absolute ${menuPosition}`}>
//         <MenuButton className="inline-flex justify-center w-10 h-10 text-gray-500 hover:text-gray-700">
//           {isLastCard ? (
//             <></>
//           ) : (
//             <HiOutlineDotsVertical className="w-6 h-6" />
//           )}
//         </MenuButton>
//         <Transition
//           as={Fragment}
//           enter="transition ease-out duration-100"
//           enterFrom="transform opacity-0 scale-95"
//           enterTo="transform opacity-100 scale-100"
//           leave="transition ease-in duration-75"
//           leaveFrom="transform opacity-100 scale-100"
//           leaveTo="transform opacity-0 scale-95"
//         >
//           <MenuItems className="absolute right-0 w-40 -mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
//             <div className="py-1">
//               <MenuItem>
//                 {({ focus }) => (
//                   <button
//                     className={`${focus ? 'bg-gray-100' : ''} flex items-center gap-2 p-2 text-sm text-gray-700 w-full`}
//                     onClick={handleDateChange(banner, FILTER_LAST_DAY)}
//                   >
//                     <FaClockRotateLeft />
//                     Last day
//                   </button>
//                 )}
//               </MenuItem>
//               <MenuItem>
//                 {({ focus }) => (
//                   <button
//                     className={`${focus ? 'bg-gray-100' : ''} flex items-center gap-2 p-2 text-sm text-gray-700 w-full`}
//                     onClick={handleDateChange(banner, FILTER_LAST_WEEK)}
//                   >
//                     <FaClockRotateLeft />
//                     Last week
//                   </button>
//                 )}
//               </MenuItem>
//               <MenuItem>
//                 {({ focus }) => (
//                   <button
//                     className={`${focus ? 'bg-gray-100' : ''} flex items-center gap-2 p-2 text-sm text-gray-700 w-full`}
//                     onClick={handleDateChange(banner, FILTER_LAST_MONTH)}
//                   >
//                     <FaClockRotateLeft />
//                     Last month
//                   </button>
//                 )}
//               </MenuItem>
//               <MenuItem>
//                 {({ focus }) => (
//                   <button
//                     className={`${focus ? 'bg-gray-100' : ''} flex items-center gap-2 p-2 text-sm text-gray-700 w-full`}
//                     onClick={handleDateChange(banner, FILTER_LAST_YEAR)}
//                   >
//                     <FaClockRotateLeft />
//                     Last year
//                   </button>
//                 )}
//               </MenuItem>
//             </div>
//           </MenuItems>
//         </Transition>
//       </Menu>
//     </div>
//   );
// }

const RADIAN = Math.PI / 180
const ACCOUNT_TYPE_COLORS = ['#8684d8', '#d70f7e', '#ff8042', '#0ba5e9']
const ACCOUNT_STATUS_COLORS = ['#00c49f', '#0ba5e9', '#d70f7e']

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

const AdminDashboard = () => {
  const { http } = AuthUser()

  const ROLE_SHOP = 'Role Shop'
  const ROLE_MEDICAL_CENTER = 'Role Medical Center'
  const ROLE_AID_CENTER = 'Role Aid Center'
  const ROLE_CUSTOMER = 'Role Customer'
  const ACCOUNT_ENABLE = 'Enabled'
  const ACCOUNT_NOT_APPROVED = 'Not Approved'
  const ACCOUNT_BLOCKED = 'Blocked'

  const [loading, setLoading] = useState(true);

  const [shopBar, setShopBar] = useState([])
  const [medicalCenterBar, setMedicalCenterBar] = useState([])
  const [aidCenterBar, setAidCenterBar] = useState([])
  const [customerBar, setCustomerBar] = useState([])
  const [accountTypePie, setAccountTypePie] = useState([])
  const [accountStatusPie, setAccountStatusPie] = useState([])
  const [accountApprovedRadar, setAccountApprovedRadar] = useState([])
  const [accountApprovedRadarTotal, setAccountApprovedRadarTotal] = useState()
  const [recentAccountWaitingApproved, setRecentAccountWaitingApproved] = useState([])

  const currentYear = new Date().getFullYear();
  const shopYears = [currentYear, currentYear - 1, currentYear - 2];
  const medicalCenterYears = [currentYear, currentYear - 1, currentYear - 2];
  const aidCenterYears = [currentYear, currentYear - 1, currentYear - 2];
  const customerYears = [currentYear, currentYear - 1, currentYear - 2];
  const [selectedShopYears, setSelectedShopYears] = useState(currentYear);
  const [selectedMedicalCenterYears, setSelectedMedicalCenterYears] = useState(currentYear);
  const [selectedAidCenterYears, setSelectedAidCenterYears] = useState(currentYear);
  const [selectedCustomerYears, setSelectedCustomerYears] = useState(currentYear);

  const handleChangeShopYear = (value) => {
    setSelectedShopYears(value)
  };

  const handleChangeMedicalCenterYear = (value) => {
    setSelectedMedicalCenterYears(value)
  };

  const handleChangeAidCenterYear = (value) => {
    setSelectedAidCenterYears(value)
  };

  const handleChangeCustomerYear = (value) => {
    setSelectedCustomerYears(value)
  };

  const handleViewAccount = () => {

  }

  const handleApprovedAccount = () => {

  }

  const handleDeleteAccount = () => {

  }

  useEffect(() => {
    const fetchShopBar = async () => {
      try {
        const response = await http.get(`/admin/bar/shop?year=${selectedShopYears}`)
        console.log(response)
        setShopBar(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchShopBar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedShopYears])

  useEffect(() => {
    const fetchMedicalCenterBar = async () => {
      try {
        const response = await http.get(`/admin/bar/medical-center?year=${selectedMedicalCenterYears}`)
        setMedicalCenterBar(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchMedicalCenterBar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMedicalCenterYears])

  useEffect(() => {
    const fetchAidCenterBar = async () => {
      try {
        const response = await http.get(`/admin/bar/aid-center?year=${selectedAidCenterYears}`)
        setAidCenterBar(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchAidCenterBar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAidCenterYears])

  useEffect(() => {
    const fetchCustomerBar = async () => {
      try {
        const response = await http.get(`/admin/bar/customer?year=${selectedCustomerYears}`)
        setCustomerBar(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchCustomerBar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomerYears])

  useEffect(() => {
    const fetchAccountTypePie = async () => {
      try {
        const response = await http.get('/admin/pie/account-type')

        const roleMapping = {
          ROLE_SHOP: ROLE_SHOP,
          ROLE_MEDICAL_CENTER: ROLE_MEDICAL_CENTER,
          ROLE_AID_CENTER: ROLE_AID_CENTER,
          ROLE_CUSTOMER: ROLE_CUSTOMER,
        };

        const data = response.data.data.map(item => ({
          name: roleMapping[item.role] || item.role,
          value: item.count,
        }))
        setAccountTypePie(data)
      } catch (error) {
        console.log(error)
      }
    }

    const fetchAccountStatusPie = async () => {
      try {
        const response = await http.get('/admin/pie/account-status')

        const roleMapping = {
          ENABLED: ACCOUNT_ENABLE,
          NOT_APPROVED: ACCOUNT_NOT_APPROVED,
          BLOCKED: ACCOUNT_BLOCKED,
        };

        const data = response.data.data.map(item => ({
          name: roleMapping[item.status] || item.status,
          value: item.count,
        }))
        setAccountStatusPie(data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchAccountTypePie()
    fetchAccountStatusPie()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchAccountApprovedRadar = async () => {
      try {
        const response = await http.get('/admin/radar/account-approved')
        const data = response.data.data
        setAccountApprovedRadar(data)
        setAccountApprovedRadarTotal(response.data.total)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    const fetchRecentWaitingApprovedAccount = async () => {
      try {
        const response = await http.get('/admin/recent-waiting-approved-account')
        setRecentAccountWaitingApproved(response.data.data)
      } catch (error) {
        console.log(error)
      }
    }

    fetchAccountApprovedRadar()
    fetchRecentWaitingApprovedAccount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const fetchAccountApprovedRadar = async () => {
      try {
        const response = await http.get('/admin/radar/account-approved')
        const data = response.data.data
        setAccountApprovedRadar(data)
        setAccountApprovedRadarTotal(response.data.total)
        setLoading(false)
      } catch (error) {
        console.log(error)
      }
    }

    fetchAccountApprovedRadar()
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
    <div className='flex flex-col items-start'>
      <div className="flex flex-row gap-4 w-full">
        <div className="h-[26rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
          <div className='flex items-center justify-between'>
            <strong className="flex items-center gap-2">
              <img src={shopLogo} alt="" className='w-8 h-8' />
              <span className='text-gray-700 font-bold text-xl'>Shop's Account Created Report</span>
            </strong>
            <Select
              defaultValue={selectedShopYears.toString()}
              style={{ width: 120 }}
              onChange={handleChangeShopYear}
            >
              {shopYears.map((year) => (
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
                data={shopBar}
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
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8684d8" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="h-[26rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
          <div className='flex items-center justify-between'>
            <strong className="flex items-center gap-2">
              <img src={medicalCenterLogo} alt="" className='w-8 h-8' />
              <span className='text-gray-700 font-bold text-xl'>Medical Center's Account Created Report</span>
            </strong>
            <Select
              defaultValue={selectedMedicalCenterYears.toString()}
              style={{ width: 120 }}
              onChange={handleChangeMedicalCenterYear}
            >
              {medicalCenterYears.map((year) => (
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
                data={medicalCenterBar}
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
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#d70f7e" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="w-[20rem] h-[26rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col">
          <strong className="text-gray-700 font-medium">Account Type</strong>
          <div className="mt-3 w-full flex-1 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={400} height={300}>
                <Pie
                  data={accountTypePie}
                  cx="50%"
                  cy="45%"
                  labelLine={true}
                  label={renderCustomizedLabel}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {accountTypePie.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={ACCOUNT_TYPE_COLORS[index % ACCOUNT_TYPE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4 w-full mt-4">
        <div className="h-[26rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
          <div className='flex items-center justify-between'>
            <strong className="flex items-center gap-2">
              <img src={animalShelterLogo} alt="" className='w-8 h-8' />
              <span className='text-gray-700 font-bold text-xl px-3'>Aid Center's Account Created Report</span>
            </strong>
            <Select
              defaultValue={selectedAidCenterYears.toString()}
              style={{ width: 120 }}
              onChange={handleChangeAidCenterYear}
            >
              {aidCenterYears.map((year) => (
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
                data={aidCenterBar}
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
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#FF8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="h-[26rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
          <div className='flex items-center justify-between'>
            <strong className="flex items-center gap-2">
              <img src={customerLogo} alt="" className='w-8 h-8' />
              <span className='text-gray-700 font-bold text-xl'>Customer's Account Created Report</span>
            </strong>
            <Select
              defaultValue={selectedCustomerYears.toString()}
              style={{ width: 120 }}
              onChange={handleChangeCustomerYear}
            >
              {customerYears.map((year) => (
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
                data={customerBar}
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
                />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#0ba5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="w-[20rem] h-[26rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col">
          <strong className="text-gray-700 font-medium">Account Status</strong>
          <div className="mt-3 w-full flex-1 text-xs">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart width={400} height={300}>
                <Pie
                  data={accountStatusPie}
                  cx="50%"
                  cy="45%"
                  labelLine={true}
                  label={renderCustomizedLabel}
                  outerRadius={110}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {accountTypePie.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={ACCOUNT_STATUS_COLORS[index % ACCOUNT_STATUS_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      <div className='mt-4 flex gap-4 w-full'>
        <div className="bg-white px-4 pt-3 pb-4 rounded-sm border border-gray-200 flex-1 dashboard-container w-full">
          <strong className="text-gray-700 font-medium">Recent Wating Approved Account</strong>
          <div className="border-x border-gray-200 rounded-sm mt-3">
            <table className="w-full text-gray-700">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Registration Date</th>
                  <th>Account Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {recentAccountWaitingApproved.map((account) => (
                  <tr key={account.id}>
                    <td>
                      <Link to={`/account/${account.id}`}>#{account.id}</Link>
                    </td>
                    <td>{account.username}</td>
                    <td>{account.email}</td>
                    <td>{format(new Date(account.created_at), 'dd MMM yyyy')}</td>
                    <td>{getAccountTypeStatus(account.role_name)}</td>
                    <td className='flex items-center gap-2'>
                      <button onClick={() => handleViewAccount()} className='bg-purple-200 rounded-md p-1.5'>
                        <FaEye size={18} className='text-purple-600' />
                      </button>
                      <button onClick={() => handleApprovedAccount()} className='bg-green-200 rounded-md p-1.5'>
                        <FaCheck size={18} className='text-green-600' />
                      </button>
                      <button onClick={() => handleDeleteAccount()} className='bg-red-200 rounded-md p-1.5'>
                        <FaWindowClose size={18} className='text-red-600' />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard