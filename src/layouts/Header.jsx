import React, { Fragment } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, MenuButton, MenuItem, MenuItems, Popover, PopoverButton, PopoverPanel, Transition } from '@headlessui/react'
import { HiOutlineBell, HiOutlineSearch, HiOutlineChatAlt, HiOutlineMail, HiOutlineUserCircle, HiOutlineLogout } from 'react-icons/hi'
import classNames from 'classnames'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import AuthUser from '../utils/AuthUser'
import defaultImg from '../assets/images/default-user-image.png'

const Header = ({ username, email, avatar }) => {
  const { logout } = AuthUser()
  const navigate = useNavigate()
  const messageCount = 0
  const notificationCount = 0

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="bg-white h-16 px-4 flex items-center border-b border-gray-200 justify-end">
      <div className="flex items-center gap-2 mr-4">
        <Popover className="relative">
          {({ open }) => (
            <>
              <PopoverButton
                className={classNames(
                  open && 'bg-gray-100',
                  'group inline-flex items-center rounded-sm p-1.5 text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100'
                )}
              >
                <button type='button' className='bg-blue-100 px-2 py-2 rounded-full'>
                  <HiOutlineChatAlt fontSize={24} className='hover:text-blue-600 transition-colors duration-300' />
                </button>
                {messageCount !== 0 && (
                  <span className="absolute top-2 right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full">
                    {messageCount}
                  </span>
                )}
              </PopoverButton>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <PopoverPanel className="absolute right-0 z-10 mt-2.5 transform w-80">
                  <div className="bg-white rounded-md shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                    <strong className="text-gray-700 font-medium">Messages</strong>
                    <div className="mt-2 py-1 text-sm">This is messages panel.</div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
        <Popover className="relative">
          {({ open }) => (
            <>
              <PopoverButton
                className={classNames(
                  open && 'bg-gray-100',
                  'group inline-flex items-center rounded-sm p-1.5 text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100'
                )}
              >
                <button type='button' className='bg-blue-100 px-2 py-2 rounded-full'>
                  <HiOutlineBell fontSize={24} className='hover:text-blue-600 transition-colors duration-300' />
                </button>
                {notificationCount !== 0 && (
                  <span className="absolute top-2 right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full">
                    {notificationCount}
                  </span>
                )}
              </PopoverButton>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <PopoverPanel className="absolute right-0 z-10 mt-2.5 transform w-80">
                  <div className="bg-white rounded-sm shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                    <strong className="text-gray-700 font-medium">Notifications</strong>
                    <div className="mt-2 py-1 text-sm">This is notification panel.</div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
        <Popover className="relative">
          {({ open }) => (
            <>
              <PopoverButton
                className={classNames(
                  open && 'bg-gray-100',
                  'group inline-flex items-center rounded-sm p-1.5 text-gray-700 hover:text-opacity-100 focus:outline-none active:bg-gray-100'
                )}
              >
                <button type='button' className='bg-blue-100 px-2 py-2 rounded-full'>
                  <HiOutlineMail fontSize={24} className='hover:text-blue-600 transition-colors duration-300' />
                </button>
                {messageCount !== 0 && (
                  <span className="absolute top-2 right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-blue-600 rounded-full">
                    {messageCount}
                  </span>
                )}
              </PopoverButton>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-200"
                enterFrom="opacity-0 translate-y-1"
                enterTo="opacity-100 translate-y-0"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100 translate-y-0"
                leaveTo="opacity-0 translate-y-1"
              >
                <PopoverPanel className="absolute right-0 z-10 mt-2.5 transform w-80">
                  <div className="bg-white rounded-md shadow-md ring-1 ring-black ring-opacity-5 px-2 py-2.5">
                    <strong className="text-gray-700 font-medium">Email</strong>
                    <div className="mt-2 py-1 text-sm">This is email panel.</div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
        <Menu as="div" className="relative">
          <MenuButton className="ml-2 flex flex-row gap-2 justify-between items-center text-sm ">
            <LazyLoadImage
              className="h-10 w-10 rounded-full bg-sky-500 bg-cover bg-no-repeat bg-center border-cyan-600 border-t object-cover"
              key={avatar}
              src={avatar}
              alt='Avatar'
              effect='blur'
              placeholderSrc={defaultImg}
            />
            <div className='flex flex-col items-start'>
              <span className='text-black font-bold'>{username}</span>
              <span className='text-gray-700'>{email}</span>
            </div>
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
            <MenuItems className="origin-top-right z-10 absolute right-0 mt-2 w-48 rounded-sm shadow-md p-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
              <MenuItem>
                {({ focus }) => (
                  <div
                    onClick={() => navigate('/dashboard/profile')}
                    className={classNames(
                      focus && 'bg-gray-100',
                      'active:bg-gray-200 flex flex-row items-center gap-2 rounded-sm px-3 py-2 text-gray-700 cursor-pointer focus:bg-gray-200'
                    )}
                  >
                    <HiOutlineUserCircle fontSize={20} />
                    Your Profile
                  </div>
                )}
              </MenuItem>
              <MenuItem>
                {({ focus }) => (
                  <div
                    onClick={handleLogout}
                    className={classNames(
                      focus && 'bg-gray-100',
                      'active:bg-gray-200 flex flex-row items-center gap-2 rounded-sm px-3 py-2 text-gray-700 cursor-pointer focus:bg-gray-200'
                    )}
                  >
                    <HiOutlineLogout fontSize={20} />
                    Sign out
                  </div>
                )}
              </MenuItem>
            </MenuItems>
          </Transition>
        </Menu>
      </div>
    </div>
  )
}

export default Header