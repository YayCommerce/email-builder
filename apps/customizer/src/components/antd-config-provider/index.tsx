import { PropsWithChildren } from 'react';

import { ConfigProvider } from 'antd';

import { isWpPlatform } from '@src/common/platform';
import { buildAntdTheme } from '@src/constants/theme';

const AntdConfigProvider = (props: PropsWithChildren) => {
  const isWpOnly = isWpPlatform();

  return (
    <ConfigProvider
      prefixCls="yaymail"
      direction={window.yaymailData.is_rtl ? 'rtl' : 'ltr'}
      theme={buildAntdTheme(isWpOnly)}
    >
      {props?.children}
    </ConfigProvider>
  );
};

export default AntdConfigProvider;
