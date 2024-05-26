import {
	HiOutlineViewGrid,
	HiOutlineCube,
	HiOutlineAnnotation,
	HiOutlineQuestionMarkCircle,
	HiOutlineCog
} from 'react-icons/hi'
import { FaFileInvoiceDollar } from "react-icons/fa6";

export const DASHBOARD_SIDEBAR_TOP_LINKS = [
	{
		key: 'dashboard',
		label: 'Dashboard',
		path: '/dashboard',
		icon: <HiOutlineViewGrid />
	},
	{
		key: 'products',
		label: 'Products',
		path: '/dashboard/product-list',
		icon: <HiOutlineCube />
	},
	{
		key: 'invoices',
		label: 'Invoices',
		path: '/dashboard/invoice-list',
		icon: <FaFileInvoiceDollar />
	},
	{
		key: 'messages',
		label: 'Messages',
		path: '/messages',
		icon: <HiOutlineAnnotation />
	}
]

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	{
		key: 'settings',
		label: 'Settings',
		path: '/settings',
		icon: <HiOutlineCog />
	},
	{
		key: 'support',
		label: 'Help & Support',
		path: '/support',
		icon: <HiOutlineQuestionMarkCircle />
	}
]
