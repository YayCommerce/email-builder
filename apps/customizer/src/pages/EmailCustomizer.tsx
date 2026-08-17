import CustomizerLayout from '@src/layouts/customizer';
import { CustomizerProvider } from '@src/layouts/customizer/providers/CustomizerProvider';
import OrderDataProvider from '@src/layouts/customizer/providers/OrderDataProvider';

import useHideWpAdminToolbar from '@src/hooks/useHideWpAdminToolbar';
import useTemplateChangingSubscribe from '@src/hooks/useTemplateChangingSubscribe';

import { default as EmailCustomizerFeature } from '@src/features/email-customizer';

const EmailCustomizer = () => {
  useHideWpAdminToolbar();
  useTemplateChangingSubscribe();

  return (
    <OrderDataProvider>
      <CustomizerProvider>
        <main className="yaymail-email-customizer">
          <style>
            {`
              ${window.yaymailData.woocommerce_email_styles}
            `}
          </style>
          <CustomizerLayout>
            <EmailCustomizerFeature />
          </CustomizerLayout>
        </main>
      </CustomizerProvider>
    </OrderDataProvider>
  );
};

export default EmailCustomizer;
