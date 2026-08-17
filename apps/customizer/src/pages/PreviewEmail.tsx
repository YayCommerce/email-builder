import DashboardContentLayout from '@src/layouts/dashboard-content';

import PreviewEmailFeature from '@src/features/preview-email';

const PreviewEmail = () => {
  return (
    <DashboardContentLayout title="Preview Email" className="yaymail-preview-email">
      <PreviewEmailFeature />
    </DashboardContentLayout>
  );
};
export default PreviewEmail;
