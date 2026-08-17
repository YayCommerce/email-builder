import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { InfoCircleOutlined } from '@ant-design/icons';
import { Badge, Empty, InputRef, notification, Tooltip } from 'antd';
import type { IconType } from 'antd/es/notification/interface';
import Table, { ColumnsType } from 'antd/es/table';
import { Key, TableRowSelection } from 'antd/es/table/interface';

import useElementsQueries from '@src/hooks/queries/useElementsQueries';
import useSettingsQueries from '@src/hooks/queries/useSettingsQueries';
import useShortcodesQueries from '@src/hooks/queries/useShortcodesQueries';
import useTemplatesQueries from '@src/hooks/queries/useTemplatesListQueries';

import useCustomizerPageStore from '@src/stores/customizerPage';
import useCustomizerSettingsStore from '@src/stores/customizerSettings';
import { __ } from '@wordpress/i18n';

import { ITemplate } from '../../types';
import BulkImportModal from '../BulkImportTemplate/Modal';
import { getColumnSearchProps } from './SearchColumn';

import './index.scss';

type NotificationType = IconType;

const EmptyPlaceholder = ({ loading = false }: { loading: boolean }) => {
  const placeholderText = useMemo(
    () => (loading ? __('Loading data', 'yaymail') : __('No template found', 'yaymail')),
    [loading],
  );
  return <Empty description={placeholderText} />;
};

const TemplateTable = () => {
  const updateSettings = useCustomizerSettingsStore((state) => state.updateSettings);

  const [notifications, notificationsContextHolder] = notification.useNotification({
    maxCount: 1, // Only show 1 notification
  });

  const { data } = useSettingsQueries();

  useEffect(() => {
    if (data) {
      updateSettings(data);
    }
  }, [data]);

  useElementsQueries();
  useShortcodesQueries();

  // TODO: handle abort fetching when switching to other tab/screen
  const { isFetching, changeStatusesMutation, resetTemplatesMutation } = useTemplatesQueries(true);

  const templatesList = useCustomizerPageStore((state) => state.templates);

  const navigate = useNavigate();

  const showNotifications = (type: NotificationType, message: string) => {
    notifications[type]({
      message: message,
      placement: 'bottomRight',
      duration: 3,
    });
  };

  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const handleChangeStatuses = useCallback(
    (status: ITemplate['status']) => async () => {
      if (selectedRowKeys.length <= 0) {
        return;
      }
      // true is enable / false is disable
      const response = await changeStatusesMutation.mutateAsync({
        list_id: selectedRowKeys,
        status,
      });

      if (response.success == true) {
        const isPlural = selectedRowKeys.length > 1;
        showNotifications(
          'success',
          `${__('Template', 'yaymail')}${isPlural ? 's' : ''} ${
            isPlural ? __('are', 'yaymail') : __('is', 'yaymail')
          } ${status === 'active' ? __('enabled', 'yaymail') : __('disabled', 'yaymail')}`,
        );
      } else {
        showNotifications('error', 'Change status failed');
      }
    },
    [selectedRowKeys],
  );

  const handleResetTemplates = useCallback(async () => {
    if (selectedRowKeys.length <= 0) {
      return;
    }
    const response = await resetTemplatesMutation.mutateAsync(selectedRowKeys);
    if (response.success == true) {
      const isPlural = selectedRowKeys.length > 1;
      showNotifications(
        'success',
        `${__('Template', 'yaymail')}${isPlural ? 's' : ''} ${__('reseted', 'yaymail')}`,
      );
    } else {
      showNotifications('error', 'Reset failed');
    }
  }, [selectedRowKeys]);

  const onCheckboxCellClick = useCallback(
    (record: ITemplate) => {
      const id = record.id;
      const selectedRowKeysSet = new Set(selectedRowKeys);
      if (selectedRowKeysSet.has(id)) {
        selectedRowKeysSet.delete(id);
      } else {
        selectedRowKeysSet.add(id);
      }
      setSelectedRowKeys(Array.from(selectedRowKeysSet));
    },
    [selectedRowKeys],
  );

  const rowSelection: TableRowSelection<ITemplate> = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      {
        key: 'activate',
        text: __('Activate Templates', 'yaymail'),
        onSelect: handleChangeStatuses('active'),
      },
      {
        key: 'deactivate',
        text: __('Deactivate Templates', 'yaymail'),
        onSelect: handleChangeStatuses('inactive'),
      },
      {
        key: 'reset',
        text: __('Reset Templates', 'yaymail'),
        onSelect: handleResetTemplates,
      },
      // {
      //   key: 'bulk-import',
      //   text: __('Bulk Import Template', 'yaymail'),
      //   onSelect: () => {
      //     if (selectedRowKeys.length === 0) return;
      //     setIsBulkImportOpen(true);
      //   },
      // },
    ],
    onCell: (record: ITemplate) => {
      return {
        onClick: (e) => {
          e.stopPropagation();
          onCheckboxCellClick(record);
        },
      };
    },
  };

  const isLoadingTable = useMemo(
    () => isFetching || changeStatusesMutation.isLoading || resetTemplatesMutation.isLoading,
    [isFetching, changeStatusesMutation.isLoading, resetTemplatesMutation.isLoading],
  );

  const handleRowClick = (record: ITemplate) => {
    navigate(`/customizer/?template=${record.name}`);
  };

  const onCheckboxColumnHeaderClick = useCallback(() => {
    if (selectedRowKeys.length === templatesList.length) {
      setSelectedRowKeys([]);
      return;
    }
    setSelectedRowKeys(templatesList.map((template) => template.id));
  }, [selectedRowKeys]);

  const searchInput = useRef<InputRef>(null);

  const columns: ColumnsType<ITemplate> = [
    {
      key: 'template_title',
      title: __('Template Name', 'yaymail'),
      dataIndex: 'template_title',
      width: '25%',
      filterSearch: true,
      onFilter: (value, record) => record.name.startsWith(value as string),
      ...getColumnSearchProps('template_title', searchInput),
    },
    {
      key: 'status',
      title: __('Status', 'yaymail'),
      dataIndex: 'status',
      width: '10%',
      render: (_, { status }, index) => {
        const wcEmails = window.yaymailData?.wc_emails as any[];
        const currentTemplate = templatesList[index];
        const isDisabledInWooSettings =
          Object.values(wcEmails).find((email: any) => email.id === currentTemplate?.name)
            ?.enabled === 'no';
        const contentType =
          Object.values(wcEmails).find((email: any) => email.id === currentTemplate?.name)
            ?.content_type ?? 'text/html';
        const isShowTooltip = isDisabledInWooSettings || contentType !== 'text/html';
        const settingPageUrl =
          Object.values(wcEmails).find((email: any) => email.id === currentTemplate?.name)
            ?.setting_page_url ?? '';

        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Badge
              color={status === 'active' ? '#c8ffdc' : '#e8e8e8'}
              count={status === 'active' ? __('Active', 'yaymail') : __('Inactive', 'yaymail')}
              style={{ color: 'rgba(0, 0, 0, 0.65)' }}
            />
            {status === 'active' && isShowTooltip && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Tooltip
                  title={
                    <div style={{ textAlign: 'center' }}>
                      <span style={{ display: 'block' }}>
                        {isDisabledInWooSettings
                          ? __('The email is currently disabled.', 'yaymail')
                          : __('The email content type is not supported.', 'yaymail')}
                      </span>
                      <span style={{ display: 'block' }}>
                        {__('Go to ', 'yaymail')}
                        <a
                          href={settingPageUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => {
                            e.stopPropagation();
                          }}
                        >
                          {__('Woo Settings', 'yaymail')}
                        </a>
                        {__(' to configure it', 'yaymail')}
                      </span>
                    </div>
                  }
                >
                  <InfoCircleOutlined style={{ color: '#faad14' }} />
                </Tooltip>
              </div>
            )}
          </div>
        );
      },
      sorter: (a, b) => a.status.length - b.status.length,
    },
    {
      key: 'recipient',
      title: __('Recipient(s)', 'yaymail'),
      dataIndex: 'recipient',
      width: '10%',
    },
    {
      key: 'source',
      title: __('Source', 'yaymail'),
      dataIndex: 'source',
      responsive: ['lg'],
    },
    {
      key: 'last_updated',
      title: __('Last Updated', 'yaymail'),
      dataIndex: 'last_updated',
      responsive: ['md'],
      sorter: (a, b) => new Date(a.last_updated).valueOf() - new Date(b.last_updated).valueOf(),
    },
  ];

  const preSelectedTemplateNames = templatesList
    .filter((t) => selectedRowKeys.includes(t.id))
    .map((t) => t.name);

  return (
    // TODO: render error component to display error message and contact support
    <>
      {notificationsContextHolder}
      {isBulkImportOpen && (
        <BulkImportModal
          isOpen={isBulkImportOpen}
          onClose={() => setIsBulkImportOpen(false)}
          preSelectedTemplateNames={preSelectedTemplateNames}
          skipEmailTypes
        />
      )}
      <Table
        id="yaymail-template-table"
        loading={isLoadingTable}
        bordered={false}
        rowKey={'id'}
        rowSelection={rowSelection}
        columns={columns}
        dataSource={templatesList ?? []}
        pagination={false}
        style={{ cursor: 'pointer', fontSize: 14 }}
        onHeaderRow={() => {
          return {
            onClick: (e) => {
              // Only the first column has checkbox
              if (!(e.target as any).querySelector('.yaymail-checkbox-wrapper')) {
                return;
              }
              onCheckboxColumnHeaderClick();
            },
          };
        }}
        onRow={(record) => {
          return {
            onClick: () => {
              handleRowClick(record);
            },
          };
        }}
        locale={{
          emptyText: <EmptyPlaceholder loading={isFetching} />,
        }}
      />
    </>
  );
};
export default TemplateTable;
