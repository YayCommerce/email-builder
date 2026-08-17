import DashboardContentLayout from '@src/layouts/dashboard-content';

import CriticalMigrationNeededAlert from '@src/components/critical-migration-needed-alert';

import { isWpPlatform } from '@src/common/platform';
import DashboardSettings from '@src/features/dashboard-settings';
import useMigrationStore from '@src/stores/migrationStore';

const Settings = () => {
  const isCriticalMigrationRequired = useMigrationStore((s) => s.isCriticalMigrationRequired);

  // The pre-4.0 migration only concerns the WooCommerce (yaymail) template
  // data -- it's irrelevant on the WordPress email-builder platform, so never
  // block that screen with it.
  const showMigrationAlert = isCriticalMigrationRequired && !isWpPlatform();

  return (
    <>
      {showMigrationAlert && <CriticalMigrationNeededAlert />}

      <DashboardContentLayout title="Settings" className="yaymail-settings">
        <DashboardSettings />
      </DashboardContentLayout>
    </>
  );
};
export default Settings;
