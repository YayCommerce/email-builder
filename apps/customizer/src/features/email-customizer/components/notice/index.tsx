import { CSSProperties, useMemo } from 'react';

import useCustomizerPageStore from '@src/stores/customizerPage';
import useCustomizerSettingsStore from '@src/stores/customizerSettings';
import { getDimensionValue } from '@yaymail/utilities/src/functions';

import AddonNeededNotice from './notice-message/addon-needed-notice';
import NotSupportedNotice from './notice-message/not-supported-notice';
import ProNeededNotice from './notice-message/pro-needed-noitice';

import './index.scss';
import { useDirection } from '@src/hooks/useDirection';

type status = 'addon_needed' | 'pro_needed' | 'not_supported' | 'already_supported' | undefined;

const Notice = () => {
  const settings = useCustomizerSettingsStore((state) => state.settings);
  const templateData = useCustomizerPageStore((state) => state.templateData);
  const containerDirection = useDirection();

  const containerWidth = useMemo(() => {
    if (!settings || !settings.container_width || isNaN(settings.container_width)) {
      return 605;
    }
    return settings?.container_width;
  }, [settings]);

  const containerStyle: CSSProperties = useMemo(
    () => ({
      width: getDimensionValue(containerWidth),
      direction: containerDirection == 'rtl' ? 'rtl' : 'initial',
    }),
    [containerWidth, containerDirection],
  );

  const noticeMessage = (status: status) => {
    if (status === 'addon_needed') {
      return <AddonNeededNotice />;
    }
    if (status === 'pro_needed') {
      return <ProNeededNotice />;
    }
    if (status === 'not_supported') {
      return <NotSupportedNotice />;
    }
    return null;
  };

  return (
    <div className="yaymail-notice-message" style={containerStyle}>
      {noticeMessage(templateData?.support_status)}
    </div>
  );
};

export default Notice;
