import { useContext } from 'react';

import { SettingOutlined } from '@ant-design/icons';
import { Button, Empty, Switch } from 'antd';

import { __ } from '@wordpress/i18n';

import { AddonsContext, IAddon } from '../addons-provider';
import useAddonMutations from '../queries/useAddonMutations';

import './grid.scss';

export default function AddonsTableGrid() {
  const { listingAddons } = useContext(AddonsContext);
  return (
    <div className="yaymail-addons-table-grid">
      {listingAddons.map((addon) => (
        <AddonItem key={addon.plugin_name} addon={addon} />
      ))}
    </div>
  );
}

const placeholderImage = '#';

const AddonItem = ({ addon }: { addon: IAddon }) => {
  const { activateAddonMutation, deactivateAddonMutation } = useAddonMutations();

  const addonSettingsInfo = window.yaymailData.yaymailHooks.applyFilters(
    'yaymail_addon_settings_info',
    '',
    addon,
  );

  return (
    <div className="yaymail-addons-table-grid__item" key={addon.plugin_slug ?? ''}>
      <div className="yaymail-addons-table-grid__item-info">
        <img
          src={addon.image ?? placeholderImage}
          alt={addon.plugin_name}
          className="yaymail-addons-table-grid__item-image"
        />
        <h3 className="yaymail-addons-table-grid__item-info-title">{addon.plugin_name}</h3>
        <p
          className="yaymail-addons-table-grid__item-info-description"
          dangerouslySetInnerHTML={{ __html: addon.description }}
        />
      </div>
      <div className="yaymail-addons-table-grid__item-actions">
        <div className="yaymail-addons-table-grid__item-actions-head">
          <Button
            size="small"
            className="yaymail-addons-table-grid__item-view-details"
            href={addon.link_upgrade ?? ''}
            target="_blank"
          >
            {__('View Details', 'yaymail')}
          </Button>
          {addon.installation_status.is_active && addonSettingsInfo && (
            <Button
              className="yaymail-addons-table-grid__item-view-settings"
              href={addonSettingsInfo.url}
              icon={
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.61565 17.9888C6.21935 17.5731 4.97648 16.8013 3.99234 15.7787C4.35948 15.3436 4.58073 14.7814 4.58073 14.1675C4.58073 12.7868 3.46144 11.6675 2.08073 11.6675C1.99721 11.6675 1.91464 11.6716 1.83323 11.6796C1.72231 11.1373 1.66406 10.5759 1.66406 10.0008C1.66406 9.12974 1.79772 8.28987 2.04564 7.50057C2.05732 7.50074 2.06901 7.50083 2.08073 7.50083C3.46144 7.50083 4.58073 6.38153 4.58073 5.00083C4.58073 4.60445 4.48848 4.22962 4.32431 3.89665C5.28802 3.00056 6.46427 2.32995 7.7691 1.96875C8.18256 2.77919 9.02519 3.33416 9.9974 3.33416C10.9696 3.33416 11.8122 2.77919 12.2257 1.96875C13.5305 2.32995 14.7068 3.00056 15.6705 3.89665C15.5063 4.22962 15.4141 4.60445 15.4141 5.00083C15.4141 6.38153 16.5334 7.50083 17.9141 7.50083C17.9258 7.50083 17.9375 7.50074 17.9491 7.50057C18.1971 8.28987 18.3307 9.12974 18.3307 10.0008C18.3307 10.5759 18.2725 11.1373 18.1616 11.6796C18.0801 11.6716 17.9976 11.6675 17.9141 11.6675C16.5334 11.6675 15.4141 12.7868 15.4141 14.1675C15.4141 14.7814 15.6353 15.3436 16.0024 15.7787C15.0183 16.8013 13.7754 17.5731 12.3791 17.9888C12.0569 16.9807 11.1124 16.2508 9.9974 16.2508C8.8824 16.2508 7.9379 16.9807 7.61565 17.9888Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M10.0026 12.9173C11.6134 12.9173 12.9193 11.6115 12.9193 10.0007C12.9193 8.38982 11.6134 7.08398 10.0026 7.08398C8.39177 7.08398 7.08594 8.38982 7.08594 10.0007C7.08594 11.6115 8.39177 12.9173 10.0026 12.9173Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                </svg>
              }
            ></Button>
          )}
        </div>
        <div className="yaymail-addons-table-grid__item-actions-tail">
          {addon.installation_status.is_installed ? (
            <Switch
              checked={addon.installation_status.is_active}
              loading={activateAddonMutation.isLoading || deactivateAddonMutation.isLoading}
              onChange={() =>
                addon.installation_status.is_active
                  ? deactivateAddonMutation.mutate(addon.plugin_slug)
                  : activateAddonMutation.mutate(addon.plugin_slug)
              }
            />
          ) : (
            <span className="yaymail-addons-not-installed-badge">
              {__('Not installed', 'yaymail')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
