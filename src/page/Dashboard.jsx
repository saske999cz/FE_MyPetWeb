import React, { useState } from 'react';
import DashboardStatsGrid from '../components/DashboardStatsGrid';
import TransactionChart from '../components/TransactionChart';
import BuyerProfilePieChart from '../components/BuyerProfilePieChart';
import RecentOrders from '../components/RecentOrders';
import PopularProducts from '../components/PopularProducts';
import { Breadcrumb } from 'antd';

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-4">
      <div className='flex flex-row justify-between items-center rounded-lg p-6 bg-white'>
        <h2 className='text-2xl font-bold'>Dashboard</h2>
        <Breadcrumb
          separator="~"
          items={[
            {
              title: <span>Dashboard</span>,
            }
          ]}
        />
      </div>
			<DashboardStatsGrid />
			<div className="flex flex-row gap-4 w-full">
				<TransactionChart />
				<BuyerProfilePieChart />
			</div>
			<div className="flex flex-row gap-4 w-full">
				<RecentOrders />
				<PopularProducts />
			</div>
		</div>
  )
}

export default Dashboard