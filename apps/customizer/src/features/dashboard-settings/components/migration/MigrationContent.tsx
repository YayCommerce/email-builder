import { useCallback, useMemo, useState } from 'react';
import { useQueryClient } from 'react-query';

import { Button, Select, Space, Tooltip } from 'antd';

import MigrationConfirmModal from '@src/features/dashboard-settings/components/migration/MigrationConfirmModal';

import MigrationApi from '@src/common/api/migrationApi';
import { MigrationOnloadData } from '@src/common/api/types';
import { getBrandName } from '@src/common/platform';
import useMigrationStore from '@src/stores/migrationStore';
import useCustomNotificationStore from '@src/stores/notification';
import { __, sprintf } from '@wordpress/i18n';

import './MigrationContent.scss';

type PropsType = {
  onloadData: MigrationOnloadData;
  isButtonDisabled: boolean;
};

const MigrationContent = ({ onloadData, isButtonDisabled }: PropsType) => {
  const brandName = getBrandName();
  const notify = useCustomNotificationStore((state) => state.notify);
  const queryClient = useQueryClient();
  const setIsCriticalMigrationRequired = useMigrationStore((s) => s.setIsCriticalMigrationRequired);
  const performMigration = useCallback(async () => {
    try {
      setIsButtonLoading(true);
      const response = await MigrationApi.migrate();
      if (response.data.isError) {
        notify?.('error', __('Migration failed! Please contact our support for help!', 'yaymail'));
        return;
      }
      notify?.('success', __('Migration succeeded!', 'yaymail'));
      setIsCriticalMigrationRequired(response.data.is_critical_migration_required);
      queryClient.invalidateQueries();
    } catch (e) {
      console.error(e);
      notify?.('error', __('Migration failed! Please contact our support for help!', 'yaymail'));
    } finally {
      setIsButtonLoading(false);
    }
  }, [notify, setIsCriticalMigrationRequired]);

  const performReset = useCallback(async (backupName: string) => {
    try {
      setIsButtonLoading(true);
      const response = await MigrationApi.reset(backupName);
      notify?.('success', __('Reset succeeded!', 'yaymail'));
      setIsCriticalMigrationRequired(response.data.is_critical_migration_required);
      queryClient.invalidateQueries();
    } catch (e) {
      console.error(e);
      notify?.('error', __('Reset failed!', 'yaymail'));
    } finally {
      setIsButtonLoading(false);
    }
  }, []);

  const [isButtonLoading, setIsButtonLoading] = useState<boolean>(false);

  const [modalHeaderText, setModalHeaderText] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const onModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);
  const [onModalOk, setOnModalOk] = useState<() => void>(() => {});

  const onMigrate = useCallback(() => {
    setModalHeaderText(
      sprintf(
        /* translators: %s: brand name, e.g. YayMail or Email Builder */
        __("Proceed to migrate %s's data to the latest version, are you sure?"),
        brandName,
      ),
    );
    setOnModalOk(() => performMigration);

    setIsModalOpen(true);
  }, [performMigration, brandName]);

  const [backupName, setBackupName] = useState<string | undefined>(undefined);

  const onReset = useCallback(() => {
    if (!backupName) {
      console.debug('YayMail: Please select backup name!');
      return;
    }
    setModalHeaderText(
      sprintf(
        /* translators: %s: brand name, e.g. YayMail or Email Builder */
        __("Proceed to reset %s's data, are you sure?"),
        brandName,
      ),
    );
    setOnModalOk(() => () => performReset(backupName));

    setIsModalOpen(true);
  }, [performReset, backupName, brandName]);

  const isButtonMigrateDisabled = useMemo(
    () => isButtonLoading || onloadData.required_migrations.length === 0 || isButtonDisabled,
    [isButtonLoading, onloadData.required_migrations.length, isButtonDisabled],
  );

  return (
    <>
      <h3 className="yaymail-settings__title">{__('Migration', 'yaymail')}</h3>
      <p className="yaymail-settings__description">
        {sprintf(
          /* translators: %s: brand name, e.g. YayMail or Email Builder */
          __(
            "Transfers data between different %s versions, ensuring compatibility whether you're upgrading to the latest release or reverting to a previous version.",
          ),
          brandName,
        )}
      </p>
      <div className="yaymail-settings__content">
        <div className="yaymail-settings-option-wrapper">
          <div className="yaymail-settings-label">
            <div className="yaymail-settings-label__primary">{__('Reset', 'yaymail')}</div>
            <div className="yaymail-settings-label__secondary">
              {sprintf(
                /* translators: %s: brand name, e.g. YayMail or Email Builder */
                __("Reverting to an earlier version of %s's data.", 'yaymail'),
                brandName,
              )}
            </div>
          </div>
          <div className="yaymail-settings-label secondary_column">
            <div className="yaymail-settings-label__primary">{__('Reset', 'yaymail')}</div>
            <div className="yaymail-settings-label__secondary">
              {onloadData.backups.length === 0 ? (
                <span className="yaymail-setting-info">{__('No backup available', 'yaymail')}</span>
              ) : (
                <div className="yaymail-setting-backups-wrapper">
                  <Select
                    className="yaymail-setting-backups-selector"
                    loading={isButtonLoading}
                    placeholder="Select backup"
                    options={onloadData.backups.map((backup) => ({
                      value: backup.name,
                      label: `${__('Patched in', 'yaymail')} ${backup.created_date}`,
                    }))}
                    value={backupName}
                    onChange={(value) => setBackupName(value)}
                  />
                  <Button
                    className="yaymail-setting-btn-reset-backup"
                    onClick={onReset}
                    loading={isButtonLoading}
                    disabled={isButtonLoading || isButtonDisabled || !backupName}
                    type="primary"
                  >
                    {__('Reset', 'yaymail')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="yaymail-settings-option-wrapper">
          <div className="yaymail-settings-label">
            <div className="yaymail-settings-label__primary">{__('Migrate', 'yaymail')}</div>
            <div className="yaymail-settings-label__secondary">
              {__('Migrating version data to the updated one.', 'yaymail')}
            </div>
          </div>
          <div className="yaymail-settings-label secondary_column">
            <div className="yaymail-settings-label__primary">{__('Migration', 'yaymail')}</div>
            <div className="yaymail-settings-label__secondary">
              <Space direction="vertical" size={1}>
                <Tooltip
                  placement="bottom"
                  title={
                    isButtonMigrateDisabled
                      ? undefined
                      : `${__(
                          'Migration is needed for: ',
                          'yaymail',
                        )} ${onloadData.required_migrations.join(', ')}`
                  }
                >
                  <Button
                    onClick={onMigrate}
                    type="primary"
                    disabled={isButtonMigrateDisabled}
                    loading={isButtonLoading}
                  >
                    {__('Migrate', 'yaymail')}
                  </Button>
                </Tooltip>
                {onloadData.required_migrations.length === 0 && (
                  <div className="yaymail-setting-info" style={{ marginTop: 5 }}>
                    {__('No migration needed', 'yaymail')}
                  </div>
                )}
              </Space>
            </div>
          </div>
        </div>
      </div>
      <MigrationConfirmModal
        headerText={modalHeaderText}
        onOk={onModalOk}
        onClose={onModalClose}
        isOpen={isModalOpen}
      />
    </>
  );
};

export default MigrationContent;
