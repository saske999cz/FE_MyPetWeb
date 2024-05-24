import React from 'react'
import { IoBagHandle, IoPieChart, IoPeople, IoCart, IoStar } from 'react-icons/io5';

function BoxWrapper({ children, className }) {
	return (
		<div className={`rounded-lg p-4 flex-1 flex items-center justify-between shadow-lg ${className}`}>
      {children}
    </div>
	)
}

const DashboardStatsGrid = () => {
	return (
    <div className="flex gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-6 flex-1">
        <BoxWrapper className="bg-green-500 text-white">
          <div className="flex items-center">
            <div className="rounded-full h-12 w-12 flex items-center justify-center bg-green-600">
              <IoPeople className="text-2xl text-white" />
            </div>
            <div className="pl-4">
              <span className="text-sm font-light">Total Users</span>
              <div className="flex items-center">
                <strong className="text-2xl font-semibold">277</strong>
              </div>
              <span className="text-sm">+95% Last Month</span>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper className="bg-pink-500 text-white">
          <div className="flex items-center">
            <div className="rounded-full h-12 w-12 flex items-center justify-center bg-pink-600">
              <IoCart className="text-2xl text-white" />
            </div>
            <div className="pl-4">
              <span className="text-sm font-light">Total Orders</span>
              <div className="flex items-center">
                <strong className="text-2xl font-semibold">338</strong>
              </div>
              <span className="text-sm">+30% Last Month</span>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper className="bg-blue-500 text-white">
          <div className="flex items-center">
            <div className="rounded-full h-12 w-12 flex items-center justify-center bg-blue-600">
              <IoBagHandle className="text-2xl text-white" />
            </div>
            <div className="pl-4">
              <span className="text-sm font-light">Total Products</span>
              <div className="flex items-center">
                <strong className="text-2xl font-semibold">557</strong>
              </div>
              <span className="text-sm">+25% Last Month</span>
            </div>
          </div>
        </BoxWrapper>
        <BoxWrapper className="bg-yellow-500 text-white">
          <div className="flex items-center">
            <div className="rounded-full h-12 w-12 flex items-center justify-center bg-yellow-600">
              <IoStar className="text-2xl text-white" />
            </div>
            <div className="pl-4">
              <span className="text-sm font-light">Total Reviews</span>
              <div className="flex items-center">
                <strong className="text-2xl font-semibold">166</strong>
              </div>
              <span className="text-sm">+45% Last Month</span>
            </div>
          </div>
        </BoxWrapper>
      </div>
      <div className="flex-1">
        <BoxWrapper className="bg-blue-600 text-white h-full">
          <div className="flex flex-col justify-between h-full w-full">
            <div className="flex items-center">
              <div className="rounded-full h-12 w-12 flex items-center justify-center bg-blue-700">
                <IoPieChart className="text-2xl text-white" />
              </div>
              <div className="pl-4">
                <span className="text-sm font-light">Total Sales</span>
                <div className="flex items-center">
                  <strong className="text-2xl font-semibold">$3,787,681.00</strong>
                </div>
                <span className="text-sm">+40.63% Last Month</span>
              </div>
            </div>
            <div className="text-right mt-4">
              <span className="text-sm">$3,578.90 in last month</span>
            </div>
          </div>
        </BoxWrapper>
      </div>
    </div>
	)
}

export default DashboardStatsGrid
