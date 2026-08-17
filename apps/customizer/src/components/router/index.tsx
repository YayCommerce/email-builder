import { useEffect } from 'react';
import {
  createHashRouter,
  Navigate,
  RouteObject,
  RouterProvider,
  useLocation,
} from 'react-router-dom';

import EmailCustomizer from '@src/pages/EmailCustomizer';
import EmailTemplateList from '@src/pages/EmailTemplateList';
import GlobalHeaderFooterCustomizer from '@src/pages/GlobalHeaderFooterCustomizer';
import GoPro from '@src/pages/GoPro';
import PageNotFound from '@src/pages/page-not-found/PageNotFound';
import PreviewEmail from '@src/pages/PreviewEmail';
import Settings from '@src/pages/Settings';

import DashboardMainLayout from '@src/layouts/dashboard-main';

import { isWpPlatform } from '@src/common/platform';
import { GLOBAL_HEADER_FOOTER_TEMPLATE_IDS } from '@src/constants/global-header-footer';
import useMigrationStore from '@src/stores/migrationStore';
import { __ } from '@wordpress/i18n';

import { IRouteCustomData } from './types';
import Addons from '@src/pages/Addons';

const YAYMAIL_BODY_CLASS_CUSTOMIZER = 'yaycommerce_page_yaymail-settings__customizer';

const CustomizerComponent = () => {
  const location = useLocation();

  useEffect(() => {
    document.body.classList.add(YAYMAIL_BODY_CLASS_CUSTOMIZER);
    return () => {
      document.body.classList.remove(YAYMAIL_BODY_CLASS_CUSTOMIZER);
    };
  }, []);

  const queryParams = new URLSearchParams(location.search);
  const template = queryParams.get('template');
  if (GLOBAL_HEADER_FOOTER_TEMPLATE_IDS.includes(template || '')) {
    return <GlobalHeaderFooterCustomizer />;
  }
  return <EmailCustomizer />;
};

const isWp = isWpPlatform();

const normalRoutes: RouteObject[] = [
  {
    path: '/',
    element: <DashboardMainLayout />,
    handle: {
      crumbTitle: isWp ? __('Email Builder', 'yaymail') : __('YayMail', 'yaymail'),
    } as IRouteCustomData,

    children: [
      {
        path: '',
        element: <Navigate to={'email-templates'} />,
      },
      {
        path: 'email-templates',
        element: <EmailTemplateList />,
        handle: { crumbTitle: __('Email Templates', 'yaymail') } as IRouteCustomData,
      },
      {
        path: 'settings',
        element: <Settings />,
        handle: { crumbTitle: __('Settings', 'yaymail') } as IRouteCustomData,
      },
      {
        path: 'go-pro',
        element: <GoPro />,
        handle: { crumbTitle: __('Go Pro', 'yaymail') } as IRouteCustomData,
      },
      {
        path: 'addons',
        element: <Addons />,
        handle: { crumbTitle: __('Addons', 'yaymail') } as IRouteCustomData,
      },
      {
        path: 'preview-email',
        element: <PreviewEmail />,
        handle: { crumbTitle: __('Preview Email', 'yaymail') } as IRouteCustomData,
      },
      {
        path: '*',
        element: <PageNotFound />,
      },
    ],
  },
  {
    path: 'customizer',
    element: <CustomizerComponent />,
    handle: {
      crumbTitle: isWp ? __('Email Builder', 'yaymail') : __('Email Customizer', 'yaymail'),
    } as IRouteCustomData,
  },
  {
    path: '*',
    element: <PageNotFound />,
  },
];

const normalRouter = createHashRouter(normalRoutes);

const migrationOnlyRoutes: RouteObject[] = [
  {
    path: '/',
    element: <DashboardMainLayout />,
    handle: { crumbTitle: 'YayMail' } as IRouteCustomData,

    children: [
      {
        path: '',
        element: <Navigate to="/settings#/migration" />,
      },
      {
        path: 'settings',
        element: <Settings />,
        handle: { crumbTitle: __('Settings', 'yaymail') } as IRouteCustomData,
      },
      {
        path: '*',
        element: <Navigate to="/settings#/migration" />,
      },
    ],
  },

  {
    path: '*',
    element: <Navigate to="/settings#/migration" />,
  },
];

const migrationOnlyRouter = createHashRouter(migrationOnlyRoutes);

const DataRouter = () => {
  const isCriticalMigrationRequired = useMigrationStore((s) => s.isCriticalMigrationRequired);

  // The pre-4.0 migration only concerns the WooCommerce (yaymail) template
  // data -- it's irrelevant on the WordPress email-builder platform, so never
  // lock that platform down to the migration-only router.
  const isMigrationBlocking = isCriticalMigrationRequired && !isWp;

  return <RouterProvider router={isMigrationBlocking ? migrationOnlyRouter : normalRouter} />;
};
export default DataRouter;
