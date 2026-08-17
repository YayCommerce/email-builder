import { Tabs, TabsProps } from 'antd';

import UpgradeBadge from '@src/components/upgrade/upgrade-badge';

import { useOutsideClick } from '@src/hooks/useOutsideClick';

import YAYMAIL_TOKENS from '@src/constants/tokens';
import usePatternPanelStore from '@src/stores/patternPanelStore';
import { __ } from '@wordpress/i18n';
import classNames from 'classnames';

import PatternTabContent from './block-tab-content';
import LibraryTabContent from './library-tab-content';

import './index.scss';

const PatternPanel = () => {
  const items: TabsProps['items'] = [
    {
      key: 'patterns',
      label: <span className="yaymail-tab-name">{__('Patterns', 'yaymail')}</span>,
      children: <PatternTabContent />,
    },
    {
      key: 'library',
      label: (
        <span className="yaymail-tab-name">
          {__('Library', 'yaymail')}
          <UpgradeBadge />
        </span>
      ),
      children: <LibraryTabContent />,
      className: 'yaymail-library-tab-content',
    },
  ];

  const isOpen = usePatternPanelStore((state) => state.isOpen);
  const closePanel = usePatternPanelStore((state) => state.closePanel);
  const activeTab = usePatternPanelStore((state) => state.activeTab);
  const setActiveTab = usePatternPanelStore((state) => state.setActiveTab);

  useOutsideClick(
    () => {
      const removeActiveClassForPatternCollapseItem = () => {
        document
          .querySelector('.yaymail-pattern-collapses .is-selected')
          ?.classList.remove('yaymail-collapse-item-active', 'is-selected');
      };
      closePanel?.();
      removeActiveClassForPatternCollapseItem();
    },
    isOpen,
    {
      ignoredElementsCssSelectors: [
        '.yaymail-customizer-sidebar__patterns-panel',
        '.yaymail-section-template',
        '.yaymail-global__modal',
        '.yaymail-context-menu-item',
        '.yaymail-pattern-collapses',
        '.yaymail-close-circle-filled-icon',
        '.yaymail-save-to-library-notification__view-library',
      ],
    },
    [
      '.yaymail-tabs-nav-wrap',
      '.yaymail-customizer-email-template-container .yaymail-customizer-element',
    ].join(','),
  );

  return (
    <div style={{ position: 'relative' }}>
      <div
        className={classNames(
          'yaymail-customizer-sidebar__patterns-panel',
          isOpen ? 'yaymail-pattern-panel-open' : '',
        )}
      >
        <div style={{ margin: YAYMAIL_TOKENS.sidebar.padding }}>
          <h2 className="yaymail-patterns-panel__title">{__('DRAG TO USE', 'yaymail')}</h2>
          <div className="yaymail-patterns-panel__tabs">
            <Tabs
              activeKey={activeTab}
              onChange={(key) => setActiveTab(key as 'patterns' | 'library')}
              centered
              defaultActiveKey={items[0].key}
              items={items}
              className="yaymail-patterns-panel__tabs_tabs"
              destroyInactiveTabPane
            />
          </div>
          <div></div>
        </div>
      </div>
    </div>
  );
};

export default PatternPanel;
