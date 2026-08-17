import { Badge } from 'antd';

import { __ } from '@wordpress/i18n';

interface NewBadgeProps {
  text?: string;
  color?: string;
}

const NewBadge = ({ text, color = '#FFB3001F' }: NewBadgeProps) => (
  <Badge
    count={text ?? __('New', 'yaymail')}
    color={color}
    style={{
      marginInlineStart: 5,
      color: color === '#FFB3001F' ? '#FFB300' : '#fff',
      fontWeight: 700,
      fontSize: '10px',
      textTransform: 'uppercase',
      width: 38,
      height: 18,
      lineHeight: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 0,
    }}
  />
);

export default NewBadge;
