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