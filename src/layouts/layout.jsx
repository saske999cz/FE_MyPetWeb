import React, { useEffect, useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import BreadcrumbCustom from '../components/BreadcrumbCustom'
import { Outlet } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { ref, getDownloadURL } from "firebase/storage"
import { avatarSelector } from '../redux/selectors';
import { storage } from '../utils/firebase'
import AuthUser from '../utils/AuthUser'
import { addAvatar } from '../redux/actions'
import { useAuth } from '../utils/AuthContext'

const Layout = () => {
	const [title, setTitle] = useState('Dashboard');

  const { avatar, username, email } = AuthUser()

  // Create a reference from a Firebase Storage URI
  const accountAvatar = useSelector(avatarSelector);
  const avatarRef = ref(storage, accountAvatar ? accountAvatar : avatar);

  const dispatch = useDispatch()

  // --------------------------     Fetch API     --------------------------
  useEffect(() => {
    const fetchAvatar = () => {
      getDownloadURL(avatarRef).then(url => {
        dispatch(addAvatar(url));
      })
    }

    fetchAvatar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatarRef])

	return (
		<div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row">
			<Sidebar />
			<div className="flex flex-col flex-1">
				<Header username={username} email={email} avatar={accountAvatar} />
				<div className="flex-1 p-4 min-h-0 overflow-auto">
					{/* Breadcrumb custom */}
					<div className='flex flex-row justify-between items-center rounded-lg p-6 bg-white mb-4'>
						<h2 className='text-2xl font-bold'>{title}</h2>
						<BreadcrumbCustom setTitle={setTitle} />
					</div>
					<Outlet />
				</div>
			</div>
		</div>
	)
}

export default Layout