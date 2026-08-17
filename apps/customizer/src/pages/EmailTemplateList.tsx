import DashboardContentLayout from '@src/layouts/dashboard-content';

import EmailTemplates from '@src/features/email-templates';
import { __ } from '@wordpress/i18n';

const EmailTemplateList = () => {
  return (
    <DashboardContentLayout
      title={__('Email Templates', 'yaymail')}
      className="yaymail-email-templates"
    >
      <EmailTemplates />
    </DashboardContentLayout>
  );
};

export default EmailTemplateList;
