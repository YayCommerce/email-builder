import { useCallback, useMemo, useState } from 'react';

import { Switch } from 'antd';
import { SwitchChangeEventHandler } from 'antd/es/switch';

import { __ } from '@wordpress/i18n';
import { v4 as uuidv4 } from 'uuid';

import './index.scss';

const DarkModeSwitch = () => {
  const [, setIsDarkMode] = useState<boolean>(false);

  const onDarkModeToggled: SwitchChangeEventHandler = useCallback((value) => {
    setIsDarkMode(value);
  }, []);

  const switchId = useMemo(() => uuidv4(), []);

  return (
    <div className="yaymail-darkmode-switch-container" style={{ display: 'none' }}>
      <label htmlFor={switchId} className="yaymail-dark-mode-switch-label">
        {__('Dark mode type', 'yaymail')}
      </label>
      <Switch id={switchId} title={__('Dark mode type', 'yaymail')} onChange={onDarkModeToggled} />
    </div>
  );
};

export default DarkModeSwitch;
