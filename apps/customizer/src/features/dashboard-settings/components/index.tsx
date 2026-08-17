import { useCallback, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { CloudSyncOutlined, CloudUploadOutlined, GlobalOutlined } from '@ant-design/icons';
import { Card, Tabs, TabsProps } from 'antd';

import NewBadge from '@src/components/new-badge';
import Backup from '@src/features/dashboard-settings/components/backup';
import Migration from '@src/features/dashboard-settings/components/migration';

import { isWpPlatform } from '@src/common/platform';
import useMigrationQueries from '@src/hooks/queries/useMigrationQueries';

import { ReactComponent as AttachmentEmailIcon } from '@src/assets/svgs/attachment-email-icon.svg';
import { ReactComponent as GlobalVariablesIcon } from '@src/assets/svgs/global-variables-icon.svg';
import { ReactComponent as ImportTemplateIcon } from '@src/assets/svgs/import-template-icon.svg';
import { ReactComponent as SyncedPatternsIcon } from '@src/assets/svgs/synced-patterns.svg';
import useMigrationStore from '@src/stores/migrationStore';
import { __ } from '@wordpress/i18n';

import AttachmentFile from './attachment-file';
import GlobalColors from './global-variables';
import ImportExport from './import-export';
import SyncedPatterns from './synced-patterns';

import './index.scss';

const getSettingItems = (isMigrationBlocking: boolean): TabsProps['items'] => {
  const settingItems = [
    {
      key: 'synced-patterns',
      label: (
        <>
          <span className="anticon" style={{ display: 'inline-flex' }}>
            <SyncedPatternsIcon style={{ width: '14px', height: '14px' }} />
          </span>
          <span>{__('Synced patterns', 'yaymail')}</span>
          <NewBadge text={__('Pro', 'yaymail')} color="#FCB900"/>
        </>
      ),
      children: <SyncedPatterns />,
    },
    {
      key: 'global-colors',
      label: (
        <>
          <span className="anticon" style={{ display: 'inline-flex' }}>
            <GlobalVariablesIcon style={{ width: '14px', height: '14px' }} />
          </span>
          <span>{__('Global variables', 'yaymail')}</span>
          <NewBadge text={__('Pro', 'yaymail')} color="#FCB900"/>
        </>
      ),
      children: <GlobalColors />,
    },
    {
      key: 'attachment-file',
      label: (
        <>
          <span className="anticon" style={{ display: 'inline-flex' }}>
            <AttachmentEmailIcon style={{ width: '14px', height: '14px' }} />
          </span>
          <span>{__('Attachments', 'yaymail')}</span>
          <NewBadge text={__('Pro', 'yaymail')} color="#FCB900"/>
        </>
      ),
      children: <AttachmentFile />,
    },
    {
      key: 'import-export',
      label: (
        <>
          <span className="anticon" style={{ display: 'inline-flex' }}>
            <ImportTemplateIcon style={{ width: '14px', height: '14px' }} />
          </span>
          <span>{__('Import/Export Templates', 'yaymail')}</span>
        </>
      ),
      children: <ImportExport />,
      disabled: isMigrationBlocking,
    },
    {
      key: 'migration',
      label: (
        <>
          <CloudSyncOutlined />
          <span>{__('Migration', 'yaymail')}</span>
        </>
      ),
      children: <Migration />,
    },
    {
      key: 'backup',
      label: (
        <>
          <CloudUploadOutlined />
          <span>{__('Backups', 'yaymail')}</span>
        </>
      ),
      children: <Backup />,
    },
  ];
  return settingItems;
};

export default function DashboardSettings() {
  // Preload migration data
  useMigrationQueries();

  const location = useLocation();
  const navigate = useNavigate();

  const isCriticalMigrationRequired = useMigrationStore((s) => s.isCriticalMigrationRequired);

  // The pre-4.0 migration only concerns the WooCommerce (yaymail) template
  // data -- it's irrelevant on the WordPress email-builder platform, so never
  // let it disable tabs or force the Migration tab open there.
  const isMigrationBlocking = isCriticalMigrationRequired && !isWpPlatform();

  const settingItems = useMemo(() => {
    let rawSettings = getSettingItems(isMigrationBlocking);
    if (window.yaymailData?.yaymailHooks?.applyFilters) {
      rawSettings = [
        ...window.yaymailData.yaymailHooks.applyFilters('yaymail_setting_items', rawSettings),
      ];
    }
    // @ts-ignore. This will pass the es2022 check toSorted
    return (rawSettings ?? []).toSorted(function (a: any, b: any) {
      const aPosition = parseFloat(a.position ?? 1);
      const bPosition = parseFloat(b.position ?? 1);
      return aPosition - bPosition;
    });
  }, [window.yaymailData.yaymailHooks, isMigrationBlocking]);

  const handleTabChange = useCallback(
    (activeKey: string) => {
      navigate(`#/${activeKey}`);
    },
    [navigate],
  );

  const activeKey = useMemo(() => {
    return location.hash.split('#/')?.pop() || 'synced-patterns';
  }, [location]);

  return (
    <Card className="yaymail-settings-card">
      <Tabs
        defaultActiveKey="synced-patterns"
        activeKey={isMigrationBlocking ? 'migration' : activeKey}
        tabPosition="left"
        style={{ minHeight: '45vh' }}
        items={settingItems}
        className="yaymail-settings-tabs"
        onChange={handleTabChange}
      />
    </Card>
  );
}
