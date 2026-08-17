import { type CSSProperties, useMemo } from 'react';

import { Collapse, theme } from 'antd';

import { ReactComponent as ExpandIcon } from '@src/assets/svgs/expand-icon.svg';
import YAYMAIL_TOKENS from '@src/constants/tokens';
import classNames from 'classnames';

import { ICustomCollapseProps } from '../type';

import './index.scss';

const CustomCollapse = ({
  items = [],
  className,
  panelStyle: panelStyleProps,
  ...restProps
}: ICustomCollapseProps) => {
  const { token } = theme.useToken();

  const panelStyle: CSSProperties = useMemo(
    () => ({
      background: YAYMAIL_TOKENS.collapse.tab.background,
      border: 'none',
      borderRadius: token.borderRadiusLG,
      fontSize: 14,
      marginBottom: 10,
      ...panelStyleProps,
    }),
    [token.borderRadiusLG],
  );

  const itemsWithStyle = useMemo(
    () =>
      items.map((item) => ({
        ...item,
        style: panelStyle,
        className: 'yaymail-collapse-' + item?.key + '-item',
      })),
    [items, panelStyle],
  );

  return (
    <Collapse
      className={classNames('yaymail-customizer-sidebar-collapse', className)}
      bordered={false}
      expandIconPosition={'end'}
      expandIcon={ExpandIcon}
      items={itemsWithStyle}
      style={{ background: YAYMAIL_TOKENS.sidebar.background }}
      {...restProps}
    />
  );
};

export default CustomCollapse;
