import React, { useMemo } from 'react';

import UpgradeBadge from '@src/components/upgrade/upgrade-badge';
import ElementListTabContent from '@src/features/email-customizer/components/sidebar/element-list-tab-content';

import useCustomizerPageStore from '@src/stores/customizerPage';
import { toKebabCase } from '@src/utils';
import { __ } from '@wordpress/i18n';

const TabContentForElements = () => {
  const allElements = useCustomizerPageStore((state) => state.elements);
  const groupsMain = useMemo<Array<{ key: string; label: string | React.ReactNode }>>(
    () => [
      {
        key: 'basic',
        label: __('Basic', 'yaymail'),
      },
      {
        key: 'general',
        label: __('General', 'yaymail'),
      },
      {
        key: 'woocommerce',
        label: __('WooCommerce', 'yaymail'),
      },
      {
        key: 'block',
        label: (
          <>
            <span className="yaymail-collapse-item-name">{__('Blocks', 'yaymail')}</span>
            <span className="yaymail-collapse-item-name-badge">
              <UpgradeBadge />
            </span>
          </>
        ),
      },
    ],
    [],
  );

  const groupsThirdParty = useMemo<Array<{ key: string; label: string | React.ReactNode }>>(
    () =>
      [...new Set(allElements.map((element) => element.group))]
        .filter(
          (group) => group !== 'hidden' && !groupsMain.some((groupMain) => groupMain.key === group),
        )
        .map((group) => ({
          key: toKebabCase(group),
          label: __(group.charAt(0).toUpperCase() + group.slice(1)),
        })),
    [allElements, groupsMain],
  );

  const groups = groupsThirdParty.length > 0 ? [...groupsMain, ...groupsThirdParty] : groupsMain;

  return <ElementListTabContent allSearchableElements={allElements} groups={groups} />;
};

export default TabContentForElements;
