import { ReactNode } from 'react';

import { notification } from 'antd';
import { IconType, NotificationPlacement } from 'antd/es/notification/interface';

import useCustomNotificationStore from '@src/stores/notification';

const NotificationContextHolder = () => {
  const setNotifyFunction = useCustomNotificationStore((state) => state.setNotifyFunction);
  const [notifications, notificationsContextHolder] = notification.useNotification({
    maxCount: 1, // Only show 1 notification
  });

  const showNotifications = (
    type: IconType,
    message: string | ReactNode,
    placement?: NotificationPlacement,
  ) => {
    notifications[type]({
      message: message,
      placement: placement ?? 'bottomRight',
      duration: 3,
    });
  };

  setNotifyFunction(showNotifications);

  return <>{notificationsContextHolder}</>;
};

export default NotificationContextHolder;
