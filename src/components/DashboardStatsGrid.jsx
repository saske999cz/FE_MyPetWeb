import React, { Fragment } from 'react';
import { HiOutlineTrendingUp } from 'react-icons/hi';
import { IoBagHandle, IoPieChart, IoPeople, IoCart, IoStar } from 'react-icons/io5';
import { Menu, MenuButton, MenuItem, MenuItems, Transition } from '@headlessui/react';
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { FaClockRotateLeft } from "react-icons/fa6";

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
					<MenuItems className="absolute right-0 w-40 -mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
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

const DashboardStatsGrid = () => {
	return (
		<div className="flex gap-6">
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 flex-1">
				<BoxWrapper className="bg-gradient-to-r from-green-600 to-green-400 text-white">
					<div className="flex items-center justify-between w-full">
						<div className="flex items-center">
							<div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-700">
								<IoPeople className="text-2xl text-white" />
							</div>
							<div className="pl-4 flex flex-col items-start">
								<span className="text-sm font-light">Total Users</span>
								<div className="flex items-center">
									<strong className="text-2xl font-semibold">277</strong>
								</div>
								<span className="text-sm">+95% Last Month</span>
							</div>
						</div>
						<HiOutlineTrendingUp className="text-green-900 opacity-50" size={100} />
					</div>
				</BoxWrapper>
				<BoxWrapper className="bg-gradient-to-r from-pink-600 to-pink-400 text-white">
					<div className="flex items-center justify-between w-full">
						<div className="flex items-center">
							<div className="rounded-full h-12 w-12 flex items-center justify-center bg-pink-700">
								<IoCart className="text-2xl text-white" />
							</div>
							<div className="pl-4 flex flex-col items-start">
								<span className="text-sm font-light">Total Orders</span>
								<div className="flex items-center">
									<strong className="text-2xl font-semibold">338</strong>
								</div>
								<span className="text-sm">+30% Last Month</span>
							</div>
						</div>
						<HiOutlineTrendingUp className="text-pink-900 opacity-50" size={100} />
					</div>
				</BoxWrapper>
				<BoxWrapper className="bg-gradient-to-r from-blue-600 to-blue-400 text-white">
					<div className="flex items-center justify-between w-full">
						<div className="flex items-center">
							<div className="rounded-full h-12 w-12 flex items-center justify-center bg-blue-700">
								<IoBagHandle className="text-2xl text-white" />
							</div>
							<div className="pl-4 flex flex-col items-start">
								<span className="text-sm font-light">Total Products</span>
								<div className="flex items-center">
									<strong className="text-2xl font-semibold">557</strong>
								</div>
								<span className="text-sm">+25% Last Month</span>
							</div>
						</div>
						<HiOutlineTrendingUp className="text-blue-900 opacity-50" size={100} />
					</div>
				</BoxWrapper>
				<BoxWrapper className="bg-gradient-to-r from-yellow-600 to-yellow-400 text-white">
					<div className="flex items-center justify-between w-full">
						<div className="flex items-center">
							<div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-700">
								<IoStar className="text-2xl text-white" />
							</div>
							<div className="pl-4 flex flex-col items-start">
								<span className="text-sm font-light">Total Reviews</span>
								<div className="flex items-center">
									<strong className="text-2xl font-semibold">166</strong>
								</div>
								<span className="text-sm">+45% Last Month</span>
							</div>
						</div>
						<HiOutlineTrendingUp className="text-yellow-900 opacity-50" size={100} />
					</div>
				</BoxWrapper>
			</div>
			<div className="flex-1">
				<BoxWrapper className="bg-gradient-to-r from-blue-700 to-blue-500 text-white h-full" menuPosition="top-4 right-4" isLastCard={true}>
					<div className="flex flex-col justify-between h-full w-full">
						<div className="flex items-center justify-between w-full">
							<div className="flex items-center">
								<div className="rounded-full h-12 w-12 flex items-center justify-center bg-blue-800">
									<IoPieChart className="text-2xl text-white" />
								</div>
								<div className="pl-4 flex flex-col items-start">
									<span className="text-sm font-light">Total Sales</span>
									<div className="flex items-center">
										<strong className="text-2xl font-semibold">$3,787,681.00</strong>
									</div>
									<span className="text-sm">+40.63% Last Month</span>
								</div>
							</div>
						</div>
						<div className="text-right mt-4">
							<span className="text-sm">$3,578.90 in last month</span>
						</div>
					</div>
				</BoxWrapper>
			</div>
		</div>
	);
}

export default DashboardStatsGrid;
