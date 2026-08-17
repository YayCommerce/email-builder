import { Link } from 'react-router-dom';

import { FrownOutlined } from '@ant-design/icons';
import { Empty } from 'antd';

import './EmptyPreviewContent.scss';

const EmptyPreviewContent = () => {
  return (
    <div className="yaymail-customizer-preview-email__empty-container">
      <Empty
        className="yaymail-customizer-preview-email__empty-content"
        image={<FrownOutlined />}
        imageStyle={{ marginBottom: 20, marginTop: 20, color: '#9E9E9E', height: 'fit-content' }}
        description={
          <span className="yaymail-customizer-preview-email__message">
            An error occurred while trying to get the previewing content.
            <br />
            Please{' '}
            <Link to="https://yaycommerce.com/support/" target="_blank" className="yaymail-navlink">
              contact YayMail Support
            </Link>{' '}
            for help.
          </span>
        }
      />
    </div>
  );
};

export default EmptyPreviewContent;
