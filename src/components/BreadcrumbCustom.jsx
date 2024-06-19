import { Breadcrumb } from 'antd';
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const routesConfig = {
  '/dashboard': {
    title: 'Dashboard',
    breadcrumb: 'Dashboard',
  },
  '/dashboard/support': {
    title: 'Help & Support',
    breadcrumb: 'Help & Support',
  },
  '/dashboard/settings': {
    title: 'Settings',
    breadcrumb: 'Settings',
  },

  // --------------------------     Shop Routes     --------------------------
  '/dashboard/product-list': {
    title: 'Product List',
    breadcrumb: 'Product List',
  },
  '/dashboard/product-create': {
    title: 'Product Create',
    breadcrumb: 'Product Create',
    parent: '/dashboard/product-list',
  },
  '/dashboard/product-view': {
    title: 'Product View',
    breadcrumb: 'Product View',
    parent: '/dashboard/product-list',
  },
  '/dashboard/product-update': {
    title: 'Product Update',
    breadcrumb: 'Product Update',
    parent: '/dashboard/product-list',
  },
  '/dashboard/invoice-list': {
    title: 'Invoice List',
    breadcrumb: 'Invoice List',
  },
  '/dashboard/invoice-view': {
    title: 'Invoice View',
    breadcrumb: 'Invoice View',
    parent: '/dashboard/invoice-list',
  },
  '/dashboard/profile': {
    title: 'Profile',
    breadcrumb: 'Profile',
  },

  // --------------------------     Shop Routes     --------------------------
  '/dashboard/shop-list': {
    title: ' Shop List',
    breadcrumb: 'Shop List',
  },
  '/dashboard/medical-center-list': {
    title: ' Medical Center List',
    breadcrumb: 'Medical Center List',
  },
  '/dashboard/aid-center-list': {
    title: ' Aid Center List',
    breadcrumb: 'Aid Center List',
  },
};

const findRouteConfig = (pathname) => {
  const matchedRoutes = Object.keys(routesConfig).filter(route =>
    pathname === route || pathname.startsWith(route + '/')
  );
  const matchedRoute = matchedRoutes.length ? matchedRoutes[matchedRoutes.length - 1] : null;
  return matchedRoute ? routesConfig[matchedRoute] : null;
};

const buildBreadcrumbs = (pathSnippets) => {
  const breadcrumbItems = [];
  let url = '';

  pathSnippets.forEach((snippet, index) => {
    const isDynamic = isNaN(snippet);
    if (isDynamic) {
      url += `/${snippet}`;
    }
    const routeConfig = findRouteConfig(url);

    if (routeConfig) {
      const isLast = index === pathSnippets.length - 1;

      // Kiểm tra nếu routeConfig đã có trong breadcrumbItems hay chưa
      const existingBreadcrumbIndex = breadcrumbItems.findIndex(item => item.key === url);
      if (existingBreadcrumbIndex === -1) {
        if (routeConfig.parent && !breadcrumbItems.some(item => item.key === routeConfig.parent)) {
          const parentConfig = routesConfig[routeConfig.parent];
          if (parentConfig) {
            breadcrumbItems.push({
              key: routeConfig.parent,
              title: <Link to={routeConfig.parent}>{parentConfig.breadcrumb}</Link>,
            });
          }
        }
        breadcrumbItems.push({
          key: url,
          title: isLast ? (
            <span>{routeConfig.breadcrumb}</span>
          ) : (
            <Link to={url}>{routeConfig.breadcrumb}</Link>
          ),
        });
      } else {
        breadcrumbItems.splice(existingBreadcrumbIndex + 1);
      }
    }
  });

  // Đảm bảo phần tử cuối cùng luôn là thẻ <span>
  if (breadcrumbItems.length > 0) {
    const lastIndex = breadcrumbItems.length - 1;
    const lastItem = breadcrumbItems[lastIndex];
    breadcrumbItems[lastIndex] = {
      ...lastItem,
      title: <span>{lastItem.title.props.children}</span>,
    };
  }

  return breadcrumbItems;
};

const BreadcrumbCustom = ({ setTitle }) => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);

  const breadcrumbItems = buildBreadcrumbs(pathSnippets);

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
};

export default BreadcrumbCustom;
