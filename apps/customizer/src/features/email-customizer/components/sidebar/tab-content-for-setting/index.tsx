import { CollapseProps } from 'antd';

import { __ } from '@wordpress/i18n';

import CustomCollapse from '../custom-collapse';
import EmailSettings from './email-settings';
import GlobalSettings from './global-settings';

import './index.scss';

const items: CollapseProps['items'] = [
  {
    key: 'global',
    label: 'Global',
    children: <GlobalSettings />,
  },
  {
    key: 'emailSettings',
    label: (
      <>
        Email Settings
        <p style={{ marginBottom: 2 }} className="yaymail-general-setting-item__note">
          {__('This will affect the current email settings', 'yaymail')}
        </p>
      </>
    ),
    children: <EmailSettings />,
  },
];

const TabContentForSetting = () => {
  return (
    <div className="yaymail-customizer-tab-content yaymail-customizer-tab-setting">
      <CustomCollapse accordion items={items} />
    </div>
  );
};

export default TabContentForSetting;
