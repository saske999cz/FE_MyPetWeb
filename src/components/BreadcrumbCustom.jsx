import { Breadcrumb } from 'antd'
import React, { useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'

const BreadcrumbCustom = ({ setTitle }) => {
	// http://localhost:3000/dashboard/product-list => {pathname: '/dashboard/product-list', search: '', hash: '', state: null, key: 'pz1qnn9h'}
	const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i); // ['dashboard', 'product-list']

  const breadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`; // /dashboard, /dashboard/product-list
    const isLast = index === pathSnippets.length - 1; // false, true

    let title;
    switch (url) {
      case '/dashboard':
        title = 'Dashboard';
        break;
      case '/dashboard/product-list':
        title = 'Product List';
        break;
      case '/dashboard/product-view':
        title = 'Product View';
        break;
      case '/dashboard/product-update':
        title = 'Product Update';
        break;
      default:
        title = '';
    }

    if (isLast && title) {
      return {
        key: url,
        title: <span>{title}</span>,
      };
    }

    return {
      key: url,
      title: <Link to={url}>{title}</Link>,
    };
  }); 
	// [0: {key: '/dashboard', title: <Link to="/dashboard">Dashboard</Link>}, 1: {key: '/dashboard/product-list', title: <span>Product List<span>}]

	useEffect(() => {
    if (breadcrumbItems.length > 0) {
      const lastItem = breadcrumbItems[breadcrumbItems.length - 1];
      if (typeof lastItem.title === 'string') {
        setTitle(lastItem.title);
      } else if (React.isValidElement(lastItem.title)) {
        setTitle(lastItem.title.props.children);
      }
    }
  }, [location, breadcrumbItems, setTitle]);

  return (
    <Breadcrumb separator="~" items={breadcrumbItems} />
  );
}

export default BreadcrumbCustom