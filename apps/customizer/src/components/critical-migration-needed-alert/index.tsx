import { Alert } from 'antd';

import { __ } from '@wordpress/i18n';

import './index.scss';

const CriticalMigrationNeededAlert = () => {
  const decription = (
    <>
      It looks like you haven’t migrated your email customizations to the new version yet. Until the
      migration is completed:
      <ul>
        <li>
          Your old email elements cannot be used in the customizer, and unmigrated elements might be
          lost permanently.
        </li>
        <li>
          Emails sent before the migration will use WooCommerce’s default template, not your
          previously customized version.
        </li>
        <li>
          No actions can be taken in the customizer until the migration process is started and
          completed.
        </li>
      </ul>
    </>
  );

  return (
    <Alert
      message={__('Migration Required to Continue', 'yaymail')}
      description={decription}
      type="warning"
      showIcon
      className="yaymail-settings-critical-migration-needed-alert"
    />
  );
};

export default CriticalMigrationNeededAlert;
