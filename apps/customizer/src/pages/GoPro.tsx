import GoProLayout from '@src/features/go-pro/main';
import DashboardContentLayout from '@src/layouts/dashboard-content';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const GoPro = () => {
  const location = useLocation();
  useEffect(() => {
    if (location.hash === '#third-party-integrations') {
      window.jQuery('html, body').animate({
        scrollTop: window.jQuery('#third-party-integrations').offset()?.top ?? 0,
      });
    }
  }, [location.hash]);
  return (
    <DashboardContentLayout title="" className="yaymail-go-pro">
      <GoProLayout />
    </DashboardContentLayout>
  );
};
export default GoPro;
