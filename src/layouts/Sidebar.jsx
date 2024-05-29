import React from 'react'
import classNames from 'classnames'
import { Link, useLocation } from 'react-router-dom'
import { HiOutlineLogout } from 'react-icons/hi'
import { DASHBOARD_SIDEBAR_TOP_LINKS, DASHBOARD_SIDEBAR_BOTTOM_LINKS } from '../lib/constants'
import LogoWhite from '../assets/images/LogoWhite.png'
import AuthUser from '../utils/AuthUser'

const linkClass =
  'flex items-center gap-2 font-light px-3 py-2 hover:bg-neutral-700 hover:no-underline active:bg-neutral-600 rounded-sm text-base'

function SidebarLink({ link }) {
  const { pathname } = useLocation()

  return (
    <Link
      to={link.path}
      className={classNames(
        pathname === link.path ? 'bg-neutral-700 text-white' : 'text-neutral-400',
        linkClass
      )}
    >
      <span className="text-xl">{link.icon}</span>
      {link.label}
    </Link>
  )
}

const Sidebar = () => {
  const { logout } = AuthUser()
  
  const handleLogout = () => {
    logout()
  }

  return (
    <div className="bg-neutral-900 w-60 p-3 flex flex-col">
      <img src={LogoWhite} alt="logo" />
      <div className="flex flex-1 flex-col py-6 gap-1">
        {DASHBOARD_SIDEBAR_TOP_LINKS.map((link) => (
          <SidebarLink key={link.key} link={link} />
        ))}
      </div>
      <div className="flex flex-col pt-2 gap-1 border-t border-neutral-700">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
          <SidebarLink key={link.key} link={link} />
        ))}
        <div 
          onClick={handleLogout}
          className={classNames(
            linkClass,
            'cursor-pointer text-red-500'
          )}
        >
          <span className="text-xl">
            <HiOutlineLogout />
          </span>
          Logout
        </div>
      </div>
    </div>
  )
}

export default Sidebar