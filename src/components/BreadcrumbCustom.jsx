import { Breadcrumb } from 'antd';
import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const routesConfig = {
  '/dashboard': {
    title: 'Dashboard',
    breadcrumb: 'Dashboard',
  },
  '/dashboard/product-list': {
    title: 'Product List',
    breadcrumb: 'Product List',
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
};

const findRouteConfig = (pathname) => {
  const matchedRoutes = Object.keys(routesConfig).filter(route =>
    pathname.startsWith(route)
  );
  const matchedRoute = matchedRoutes.length ? matchedRoutes[matchedRoutes.length - 1] : null;
  return matchedRoute ? routesConfig[matchedRoute] : null;
};

const BreadcrumbCustom = ({ setTitle }) => {
  const location = useLocation();
  const pathSnippets = location.pathname.split('/').filter(i => i);
  console.log('path snippets:', pathSnippets)

  const breadcrumbItems = [];
  let url = '';

  pathSnippets.forEach((_, index) => {
    url += `/${pathSnippets[index]}`;
    const routeConfig = findRouteConfig(url);

    if (routeConfig) {
      const isLast = index === pathSnippets.length - 1;

      breadcrumbItems.push({
        key: url,
        title: isLast ? (
          <span>{routeConfig.breadcrumb}</span>
        ) : (
          <Link to={url}>{routeConfig.breadcrumb}</Link>
        ),
      });

      if (routeConfig.parent && !isLast && pathSnippets[index + 1] !== routeConfig.parent.split('/')[2]) {
        const parentConfig = routesConfig[routeConfig.parent];
        if (parentConfig) {
          breadcrumbItems.push({
            key: routeConfig.parent,
            title: <Link to={routeConfig.parent}>{parentConfig.breadcrumb}</Link>,
          });
        }
      }
    }
  });

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
