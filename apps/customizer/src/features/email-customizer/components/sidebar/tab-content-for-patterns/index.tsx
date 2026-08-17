/* eslint-disable no-restricted-imports */
import { useMemo } from 'react';

import ElementListTabContent from '@src/features/email-customizer/components/sidebar/element-list-tab-content';

import useCustomizerPageStore from '@src/stores/customizerPage';
import { __ } from '@wordpress/i18n';

import './index.scss';

const TabContentForPatterns = () => {
  const allPatterns = Object.values(window.yaymailData.builder.section_templates);

  const groups = [
    {
      key: 'header',
      label: __('Header', 'yaymail'),
    },
    {
      key: 'footer',
      label: __('Footer', 'yaymail'),
    },
    {
      key: 'banner',
      label: __('Banner', 'yaymail'),
    },
    {
      key: 'gallery',
      label: __('Gallery', 'yaymail'),
    },
    {
      key: 'shipping',
      label: __('Shipping', 'yaymail'),
    },
    {
      key: 'offer',
      label: __('Offer', 'yaymail'),
    },
    {
      key: 'intro',
      label: __('Intro', 'yaymail'),
    },
  ];

  const templateData = useCustomizerPageStore((state) => state.templateData);
  const templateName = templateData?.name;

  const filteredGroups = useMemo(() => {
    if (templateName?.startsWith('wp-core-')) {
      return groups.filter((group) => {
        return group.key !== 'shipping';
      });
    }
    return groups;
  }, [templateName]);
  return (
    <ElementListTabContent
      allSearchableElements={allPatterns}
      groups={filteredGroups}
      tabFor="patterns"
      itemClass="yaymail-section-template"
    />
  );
};

export default TabContentForPatterns;
