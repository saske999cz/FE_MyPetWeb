import React, { useState } from 'react'
import Sidebar from './Sidebar'
import Header from './Header'
import { Outlet } from 'react-router-dom'
import BreadcrumbCustom from '../components/BreadcrumbCustom'

const Layout = () => {
	const [title, setTitle] = useState('Dashboard');

	return (
		<div className="bg-neutral-100 h-screen w-screen overflow-hidden flex flex-row">
			<Sidebar />
			<div className="flex flex-col flex-1">
				<Header />
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