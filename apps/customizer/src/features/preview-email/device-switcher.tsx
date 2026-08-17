import { Tooltip } from 'antd';

import { ReactComponent as DesktopIcon } from '@src/assets/svgs/desktop-icon.svg';
import { ReactComponent as MobileIcon } from '@src/assets/svgs/mobile-icon.svg';

import './device-switcher.scss';

export default function DeviceSwitcher({
  onChange,
  currentDevice,
}: {
  onChange: (device: 'desktop' | 'mobile') => void;
  currentDevice: string;
}) {
  return (
    <div className="yaymail-preview-device-switcher">
      <Tooltip placement="bottom" title="Desktop preview">
        <div
          className={`yaymail-preview-device-switcher__item yaymail-preview-device-switcher--dekstop ${
            currentDevice === 'desktop' ? 'yaymail-preview-device-switcher--active' : ''
          }`}
          onClick={() => {
            onChange('desktop');
          }}
        >
          <DesktopIcon style={{ width: '16px', height: '16px' }} />
        </div>
      </Tooltip>
      <Tooltip placement="bottom" title="Mobile preview">
        <div
          className={`yaymail-preview-device-switcher__item yaymail-preview-device-switcher--mobile ${
            currentDevice === 'mobile' ? 'yaymail-preview-device-switcher--active' : ''
          }`}
          onClick={() => {
            onChange('mobile');
          }}
        >
          <MobileIcon style={{ width: '16px', height: '16px' }} />
        </div>
      </Tooltip>
    </div>
  );
}
