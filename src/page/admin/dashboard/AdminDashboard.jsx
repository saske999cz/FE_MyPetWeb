import React from 'react'
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { HiOutlineTrendingDown, HiOutlineTrendingUp } from 'react-icons/hi';

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

const AdminDashboard = () => {
  return (
    <div>
      
    </div>
  )
}

export default AdminDashboard