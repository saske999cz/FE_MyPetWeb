import {
	HiOutlineViewGrid,
	HiOutlineCube,
	HiOutlineQuestionMarkCircle,
	HiOutlineCog
} from 'react-icons/hi'
import { FaFileInvoiceDollar, FaHouseMedical, FaPersonShelter, FaShop } from "react-icons/fa6";
import { MdOutlinePets } from "react-icons/md";
import { VscGitPullRequestGoToChanges } from "react-icons/vsc";

export const DASHBOARD_SIDEBAR_TOP_LINKS = {
  ROLE_ADMIN: [
    {
      key: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: <HiOutlineViewGrid />,
    },
    {
      key: 'shop-list',
      label: 'Shops',
      path: '/dashboard/shop-list',
      icon: <FaShop />,
    },
    {
      key: 'medical-center-list',
      label: 'Medical Centers',
      path: '/dashboard/medical-center-list',
      icon: <FaHouseMedical />,
    },
    {
      key: 'aid-center-list',
      label: 'Aid Centers',
      path: '/dashboard/aid-center-list',
      icon: <FaPersonShelter />,
    },
  ],
  ROLE_SHOP: [
    {
      key: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: <HiOutlineViewGrid />,
    },
    {
      key: 'products',
      label: 'Products',
      path: '/dashboard/product-list',
      icon: <HiOutlineCube />,
    },
    {
      key: 'invoices',
      label: 'Invoices',
      path: '/dashboard/invoice-list',
      icon: <FaFileInvoiceDollar />,
    },
  ],
  ROLE_MEDICAL_CENTER: [
    {
      key: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: <HiOutlineViewGrid />,
    },
  ],
  ROLE_AID_CENTER: [
    {
      key: 'dashboard',
      label: 'Dashboard',
      path: '/dashboard',
      icon: <HiOutlineViewGrid />,
    },
    {
      key: 'pet',
      label: 'Pet',
      path: '/dashboard/pet-list',
      icon: <MdOutlinePets />,
    },
    {
      key: 'adopt-request',
      label: 'Adopt Request',
      path: '/dashboard/adopt-request-list',
      icon: <VscGitPullRequestGoToChanges />,
    },
  ],
};

export const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
	{
		key: 'settings',
		label: 'Settings',
		path: '/dashboard/settings',
		icon: <HiOutlineCog />
	},
	{
		key: 'support',
		label: 'Help & Support',
		path: '/dashboard/support',
		icon: <HiOutlineQuestionMarkCircle />
	}
]
