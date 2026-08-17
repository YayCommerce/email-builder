import { useNavigate } from 'react-router-dom';

import { __ } from '@wordpress/i18n';

import { Button } from 'antd';

import './index.scss';

const PageNotFound = () => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/email-templates');
  };

  return (
    <div className="yaymail-page-not-found-layout">
      <div className="yaymail-layout-header">
        <span>{__('OOPS! PAGE NOT FOUND', 'yaymail')}</span>
      </div>
      <div className="yaymail-layout-main">
        <span>404</span>
      </div>
      <div className="yaymail-layout-footer">
        <span>{__('WE ARE SORRY, BUT THE PAGE YOU REQUESTED WAS NOT FOUND', 'yaymail')}</span>
      </div>
      <Button type="primary" onClick={handleNavigate} style={{ marginTop: '2rem' }}>
        {__('Go to dashboard', 'yaymail')}
      </Button>
    </div>
  );
};
export default PageNotFound;
