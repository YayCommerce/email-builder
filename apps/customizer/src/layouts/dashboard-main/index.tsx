import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, Outlet, useLocation, useMatches, useNavigate } from 'react-router-dom';

import Icon from '@ant-design/icons';
import { Breadcrumb, Layout, Space, Tabs, TabsProps } from 'antd';
import { ItemType } from 'antd/es/breadcrumb/Breadcrumb';
import { Content, Footer } from 'antd/es/layout/layout';

import NewBadge from '@src/components/new-badge';
import { IRouteCustomData } from '@src/components/router/types';

import { ReactComponent as AddonsIcon } from '@src/assets/svgs/addons-icon.svg';
import { ReactComponent as DocumentationIcon } from '@src/assets/svgs/documentation-icon.svg';
import { ReactComponent as EmailTemplatesIcon } from '@src/assets/svgs/email-templates-icon.svg';
import { ReactComponent as GlobalHeaderFooterIcon } from '@src/assets/svgs/global-header-footer-icon.svg';
import { ReactComponent as GoProIcon } from '@src/assets/svgs/go-pro-icon.svg';
import { ReactComponent as PreviewEmailIcon } from '@src/assets/svgs/preview-email-icon.svg';
import { ReactComponent as SettingsIcon } from '@src/assets/svgs/settings-icon.svg';
import { ReactComponent as SupportIcon } from '@src/assets/svgs/support-icon.svg';
import { ReactComponent as WpLogo } from '@src/assets/svgs/wp-logo.svg';
import { ReactComponent as YayMailLogo } from '@src/assets/svgs/yaymail-logo.svg';
import { reviewYayMail } from '@src/common/ajax';
import { getGlobalHeaderFooterKey, isWpPlatform } from '@src/common/platform';
import { setLocaleData } from '@src/i18n';
import useCustomizerPageStore from '@src/stores/customizerPage';
import useMigrationStore from '@src/stores/migrationStore';
import { __ } from '@wordpress/i18n';

import './index.scss';

setLocaleData();

const MenuItemWrap = ({ children }: { children: React.ReactNode }) => {
  return (
    <span
      className="yaymail-tabs-tab-btn__wrapper"
      style={{ display: 'flex', alignItems: 'center' }}
    >
      {children}
    </span>
  );
};

const IconWrap = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="anticon" style={{ marginRight: 6 }}>
      {children}
    </span>
  );
};

const items: TabsProps['items'] = [
  {
    key: 'email-templates',
    label: (
      <MenuItemWrap>
        <IconWrap>
          <EmailTemplatesIcon />
        </IconWrap>
        <span className="yaymail-tab-name">{__('Email Templates', 'yaymail')}</span>
      </MenuItemWrap>
    ),
  },
  {
    key: 'global-header-footer',
    label: (
      <MenuItemWrap>
        <IconWrap>
          <GlobalHeaderFooterIcon />
        </IconWrap>
        <span className="yaymail-tab-name">{__('Global Header & Footer', 'yaymail')}</span>
        <NewBadge />
      </MenuItemWrap>
    ),
  },
  {
    key: 'settings',
    label: (
      <MenuItemWrap>
        <IconWrap>
          <SettingsIcon />
        </IconWrap>
        <span className="yaymail-tab-name">{__('Settings', 'yaymail')}</span>
        <NewBadge />
      </MenuItemWrap>
    ),
  },
  {
    key: 'go-pro',
    label: (
      <MenuItemWrap>
        <IconWrap>
          <GoProIcon />
        </IconWrap>
        <span className="yaymail-tab-name">{__('Go Pro', 'yaymail')}</span>
      </MenuItemWrap>
    ),
  },
  {
    key: 'addons',
    label: (
      <MenuItemWrap>
        <IconWrap>
          <AddonsIcon />
        </IconWrap>
        <span className="yaymail-tab-name">{__('Addons', 'yaymail')}</span>
      </MenuItemWrap>
    ),
  },
];

if (!isWpPlatform()) {
  items.push({
    key: 'preview-email',
    label: (
      <MenuItemWrap>
        <IconWrap>
          <PreviewEmailIcon />
        </IconWrap>
        <span className="yaymail-tab-name">{__('Preview Email', 'yaymail')}</span>
      </MenuItemWrap>
    ),
  });
}

const ADMIN_URL = '#';

const isInstanceOfIRouteCustomData = (object: unknown): object is IRouteCustomData => {
  return typeof object === 'object' && Object.prototype.hasOwnProperty.call(object, 'crumbTitle');
};

const DashboardMainLayout = () => {
  const location = useLocation();

  const navigate = useNavigate();

  const matches = useMatches();

  const [tabActiveKey, setTabActiveKey] = useState<string>(items[0]?.key ?? '');
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const isReviewed = useCustomizerPageStore((state) => state.isReviewed);
  const setIsReviewed = useCustomizerPageStore((state) => state.setIsReviewed);

  const isCriticalMigrationRequired = useMigrationStore((s) => s.isCriticalMigrationRequired);
  // The pre-4.0 migration only concerns the WooCommerce (yaymail) template
  // data -- it's irrelevant on the WordPress email-builder platform, so never
  // force the nav back to the Settings tab there.
  const isMigrationBlocking = isCriticalMigrationRequired && !isWpPlatform();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!location.pathname) {
      return;
    }
    if (location.pathname === '/go-pro') {
      setTabActiveKey('go-pro');
      return;
    }
    setTabActiveKey(location.pathname.slice(1));
  }, [location]);

  const breadcrumbData = useMemo((): ItemType[] => {
    return matches
      .filter((match) => !!match.handle && isInstanceOfIRouteCustomData(match.handle))
      .map((match) => {
        const crumbTitle = (match.handle as IRouteCustomData).crumbTitle;
        const linkTo = match.pathname === '/' ? items[0].key : match.pathname;

        return {
          title: (
            <span data-path={linkTo} className="yaymail-breadcrumb-item">
              {crumbTitle}
            </span>
          ),
          onClick: (e: React.MouseEvent<HTMLElement>) => {
            if (e.target instanceof HTMLElement && e.target.dataset?.path) {
              if (e.target.dataset.path === '/email-templates') {
                setTabActiveKey(items[0]?.key);
              } else {
                setTabActiveKey(e.target.dataset.path);
              }
              navigate(e.target.dataset.path);
            }
          },
        };
      });
  }, [matches]);

  const onTabSelected = useCallback(
    (key: string): void => {
      let navigatePath = `${key}`;
      if (key === 'global-header-footer') {
        navigatePath = `customizer/?template=${getGlobalHeaderFooterKey()}`;
      }
      if (location.pathname === `/${key}`) return;
      setTabActiveKey(key);
      navigate(navigatePath);
    },
    [navigate, location],
  );

  const handleReviewYayMail = async () => {
    try {
      setIsReviewed(true);
      await reviewYayMail();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <Layout style={{ background: '#f0f0f1' }}>
        <div
          className={`yaymail-header__navbar ${
            isScrolled ? 'yaymail-header__navbar--scrolled' : ''
          }`}
        >
          <div className="yaymail-header__navbar--left">
            <span className="yaymail-header__logo">
              <YayMailLogo />
            </span>
            <Tabs
              activeKey={isMigrationBlocking ? 'settings' : tabActiveKey}
              className="yaymail-dashboard-tabs"
              defaultActiveKey={items[0]?.key}
              onChange={onTabSelected}
              items={items}
            />
          </div>
          <div className="yaymail-header__navbar--right">
            <Link
              to="https://docs.yaycommerce.com/yaymail"
              target="_blank"
              className="yaymail-navlink"
            >
              <DocumentationIcon className="yaymail-navlink--icon" />
              <span className="yaymail-navlink--text">{__('Documentation', 'yaymail')}</span>
            </Link>
            <Link to="https://yaycommerce.com/support/" target="_blank" className="yaymail-navlink">
              <SupportIcon className="yaymail-navlink--icon" />
              <span className="yaymail-navlink--text">{__('Support', 'yaymail')}</span>
            </Link>
          </div>
        </div>
        <Content style={{ minHeight: '100vh', paddingTop: '50px' }}>
          <Outlet />
        </Content>
        <Footer className="yaymail-footer">
          <div className="yaymail-footer-wrap">
            <Space style={{ height: '100%' }}>
              <Link to={ADMIN_URL}>
                <Icon component={WpLogo} />
              </Link>
              <Breadcrumb separator=">" items={breadcrumbData} />
            </Space>

            {!isReviewed ? (
              <span className="yaymail-footer-review-text">
                {__(
                  'We need your support to keep updating and improving the plugin. Please, ',
                  'yaymail',
                )}
                <Link
                  target="_blank"
                  to="https://wordpress.org/support/plugin/yaymail/reviews/"
                  onClick={handleReviewYayMail}
                >
                  {__('help us by leaving a good review', 'yaymail')}
                </Link>{' '}
                {__(' :) Thanks!', 'yaymail')}
              </span>
            ) : (
              <span className="yaymail-footer-review-text">
                {__('Thank you for using YayMail.', 'yaymail')}
              </span>
            )}
          </div>
        </Footer>
      </Layout>
    </>
  );
};

export default DashboardMainLayout;
