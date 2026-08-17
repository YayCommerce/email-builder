import React, { useCallback, useMemo } from 'react';

import { notification, Switch, Tooltip } from 'antd';
import type { IconType } from 'antd/es/notification/interface';

import useTemplateQueries from '@src/hooks/queries/useTemplateQueries';

import useCustomizerPageStore from '@src/stores/customizerPage';
import { __ } from '@wordpress/i18n';
import { setValueByPath } from '@yaymail/utilities/src/functions';

import './EnableTemplate.scss';
type NotificationType = IconType;

const EnableTemplate: React.FC = () => {
  const [notifications, notificationsContextHolder] = notification.useNotification({
    maxCount: 1, // Only show 1 notification
  });
  const status = useCustomizerPageStore((state) => state.templateData?.status ?? 'inactive');
  const selectedTemplate = useCustomizerPageStore((state) => state.currentTemplate);
  const templateData = useCustomizerPageStore((state) => state.templateData);
  const updateItemTemplates = useCustomizerPageStore((state) => state.updateItemTemplates);
  const { changeStatusMutation } = useTemplateQueries({
    template_name: selectedTemplate,
    fetch: false,
  });

  const showNotifications = (type: NotificationType, message: string) => {
    notifications[type]({
      message: message,
      placement: 'bottomRight',
      duration: 3,
    });
  };

  const handleChangeStatus = useCallback(async () => {
    try {
      const statusChange = status === 'active' ? 'inactive' : 'active';
      const response = await changeStatusMutation.mutateAsync({
        list_id: [templateData?.id || ''],
        status: statusChange,
      });
      if (response.success === true) {
        templateData && (templateData.status = statusChange);

        selectedTemplate &&
          updateItemTemplates((data) => {
            setValueByPath(data, 'status', statusChange);
          }, selectedTemplate);

        if (statusChange === 'active') {
          showNotifications('success', __('This template is enabled', 'yaymail'));
        } else {
          showNotifications('success', __('This template is disabled', 'yaymail'));
        }
      } else {
        showNotifications('error', __("Can't change status template", 'yaymail'));
      }
    } catch (error) {
      console.error('An error occurred:', error);
    }
  }, [status, templateData, changeStatusMutation]);

  const isEditable = useMemo(
    () => templateData?.support_status === 'already_supported',
    [templateData?.support_status],
  );

  return (
    <>
      {notificationsContextHolder}
      <div className="header__enable-template-switcher">
        <Tooltip
          placement="bottom"
          title={
            templateData?.status === 'active'
              ? __('Disable this template', 'yaymail')
              : __('Enable this template', 'yaymail')
          }
        >
          <Switch
            checked={templateData?.status === 'active'}
            onChange={handleChangeStatus}
            disabled={!isEditable}
          />
        </Tooltip>
      </div>
    </>
  );
};

export default EnableTemplate;
