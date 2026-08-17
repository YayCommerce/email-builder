import React, {
  createContext,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useLocation } from 'react-router-dom';

import {
  ArrowLeftOutlined,
  CaretLeftOutlined,
  CrownFilled,
  HistoryOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { Button, CollapseProps, Tabs, TabsProps, Tooltip } from 'antd';

import Modal from '@src/components/upgrade/modal';
import DiscardChangesConfirmModal from '@src/features/email-customizer/components/discard-changes-confirm-modal';
import PatternPanel from '@src/features/email-customizer/components/sidebar/patterns-panel';
import { selectPatternCollapseItem } from '@src/features/email-customizer/components/sidebar/patterns-panel/collapse-selection';

import useNavigationWithConfirmation from '@src/hooks/useNavigationWithConfirmation';

import { ReactComponent as HistoryIcon } from '@src/assets/svgs/history-icon.svg';
import { isWpPlatform } from '@src/common/platform';
import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';

import CustomScrollbar from './custom-scrollbar';
import ElementEditor from './element-editor';
import SpecialEditorScreen from './element-editor/special-editor-screen';
import TabContentForActions from './tab-content-for-actions';
import TabContentForElements from './tab-content-for-elements';
import TabContentForPatterns from './tab-content-for-patterns';
import TabContentForRevisions from './tab-content-for-revisions';
import TabContentForSetting from './tab-content-for-setting';

import './index.scss';
import usePatternPanelStore from '@src/stores/patternPanelStore';

interface ElementCollapseContextProps {
  elementCollapseActiveKeys: CollapseProps['activeKey'];
  // eslint-disable-next-line no-unused-vars, no-undef
  setElementCollapseActiveKeys: React.Dispatch<React.SetStateAction<CollapseProps['activeKey']>>;
}
export const ElementCollapseContext = createContext<ElementCollapseContextProps | null>(null);

const itemsElement: TabsProps['items'] = [
  {
    key: 'elements',
    label: <span className="yaymail-tab-name">{__('Elements', 'yaymail')}</span>,

    children: (
      <CustomScrollbar>
        <TabContentForElements />
      </CustomScrollbar>
    ),
  },
  {
    key: 'patterns',
    label: <span className="yaymail-tab-name">{__('Patterns', 'yaymail')}</span>,
    children: (
      <CustomScrollbar>
        <TabContentForPatterns />
      </CustomScrollbar>
    ),
  },
  {
    key: 'settings',
    label: (
      <Tooltip title={__('Settings', 'yaymail')}>
        <SettingOutlined />
      </Tooltip>
    ),
    children: (
      <CustomScrollbar>
        <TabContentForSetting />
      </CustomScrollbar>
    ),
  },
];

const itemsHistory: TabsProps['items'] = [
  {
    key: 'actions',
    label: <span className="yaymail-tab-name">{__('Actions', 'yaymail')}</span>,
    children: (
      <CustomScrollbar>
        <TabContentForActions />
      </CustomScrollbar>
    ),
  },
  {
    key: 'revisions',
    label: <span className="yaymail-tab-name">{__('Revisions', 'yaymail')}</span>,
    children: (
      <CustomScrollbar>
        <TabContentForRevisions />
      </CustomScrollbar>
    ),
  },
  {
    key: 'elements',
    label: (
      <Tooltip title={__('Elements')}>
        <svg
          style={{
            verticalAlign: 'middle',
          }}
          xmlns="http://www.w3.org/2000/svg"
          width={20}
          height={20}
          fill="currentColor"
          version="1.1"
          id="Capa_1"
          viewBox="0 0 26.676 26.676"
        >
          <g>
            <path d="M26.105,21.891c-0.229,0-0.439-0.131-0.529-0.346l0,0c-0.066-0.156-1.716-3.857-7.885-4.59   c-1.285-0.156-2.824-0.236-4.693-0.25v4.613c0,0.213-0.115,0.406-0.304,0.508c-0.188,0.098-0.413,0.084-0.588-0.033L0.254,13.815   C0.094,13.708,0,13.528,0,13.339c0-0.191,0.094-0.365,0.254-0.477l11.857-7.979c0.175-0.121,0.398-0.129,0.588-0.029   c0.19,0.102,0.303,0.295,0.303,0.502v4.293c2.578,0.336,13.674,2.33,13.674,11.674c0,0.271-0.191,0.508-0.459,0.562   C26.18,21.891,26.141,21.891,26.105,21.891z" />
          </g>
        </svg>
      </Tooltip>
    ),
    children: (
      <CustomScrollbar>
        <TabContentForElements />
      </CustomScrollbar>
    ),
  },
];

const renderTabBar: TabsProps['renderTabBar'] = (props, DefaultTabBar): ReactElement => {
  return (
    <div className="yaymail-custom-tab-header">
      <DefaultTabBar {...props} />
    </div>
  );
};

interface ISidebarProps {
  onToggle: () => void;
}

const Sidebar = ({ onToggle }: ISidebarProps) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const chosenElementId = useTemplateContentStore((state) => state.chosenElement?.id);
  const unchooseElement = useTemplateContentStore((state) => state.unchooseElement);
  const specialEditorScreen = useTemplateContentStore((state) => state.specialEditorScreen);
  const deMultiSelect = useTemplateContentStore((state) => state.deMultiSelect);
  const [isElementMode, setIsElementMode] = useState<boolean>(true);
  const [activeKey, setActiveKey] = useState<string>(itemsElement[0].key);

  const tabItems = useMemo(() => (isElementMode ? itemsElement : itemsHistory), [isElementMode]);

  const handleViewHistory = () => {
    unchooseElement();
    setActiveKey(itemsHistory[0].key);
    setIsElementMode(false);
  };

  const openSectionTemplate = usePatternPanelStore((state) => state.openSectionTemplate);

  const handleChangeTab = (tabKey: string) => {
    if (!isElementMode && tabKey === 'elements') {
      unchooseElement();
      setIsElementMode(true);
    }
    if (tabKey === 'patterns') {
      const defaultSectionKey = 'header';
      if (openSectionTemplate(defaultSectionKey)) {
        requestAnimationFrame(() => selectPatternCollapseItem(defaultSectionKey));
      }
    }
    setActiveKey(tabKey);
  };

  const [elementCollapseActiveKeys, setElementCollapseActiveKeys] = useState<
    CollapseProps['activeKey']
  >([]);

  // Prevent browser scrollIntoView (e.g. TinyMCE focus) from shifting the editor header away.
  const editorWrapperRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    const wrapper = editorWrapperRef.current;
    if (!wrapper) return;

    const pinScroll = () => {
      if (wrapper.scrollTop !== 0) {
        wrapper.scrollTop = 0;
      }
    };

    pinScroll();
    wrapper.addEventListener('scroll', pinScroll, { passive: true });
    return () => wrapper.removeEventListener('scroll', pinScroll);
  }, [specialEditorScreen, chosenElementId]);

  const navigateWithConfirmation = useNavigationWithConfirmation();

  const handleBackToDashboard = useCallback(() => {
    unchooseElement();
    deMultiSelect();
    navigateWithConfirmation('/');
  }, [navigateWithConfirmation]);

  let headerText = __('WooCommerce', 'yaymail');
  let titleText = __('Email Customizer', 'yaymail');
  if (isWpPlatform()) {
    headerText = __('WordPress', 'yaymail');
    titleText = __('Email Builder', 'yaymail');
  }

  return (
    <>
      <section className="yaymail-customizer-sidebar__header">
        <h5 className="yaymail-customizer-sidebar__title">
          {__(`${headerText} ${titleText}`, 'yaymail')}
        </h5>
        <div className="yaymail-customizer-sidebar__button">
          <Button type="primary" size="small" onClick={handleOpenModal} icon={<CrownFilled />}>
            {__('Go Pro', 'yaymail')}
          </Button>
        </div>
        <div className="yaymail-customizer-sidebar__toggler" onClick={onToggle}>
          <CaretLeftOutlined className="yaymail-customizer-sidebar__toggler__icon" />
        </div>
      </section>

      {specialEditorScreen || chosenElementId ? (
        <section ref={editorWrapperRef} className="yaymail-customizer-sidebar__editor-wrapper">
          {specialEditorScreen ? <SpecialEditorScreen /> : <ElementEditor />}
        </section>
      ) : (
        <section className="yaymail-customizer-sidebar__body">
          <ElementCollapseContext.Provider
            value={{ elementCollapseActiveKeys, setElementCollapseActiveKeys }}
          >
            <Tabs
              activeKey={activeKey}
              animated={false}
              centered
              className={`yaymail-customizer-sidebar__main-tabs ${
                !isElementMode
                  ? 'yaymail-customizer-sidebar__main-tabs__history'
                  : 'yaymail-customizer-sidebar__main-tabs__element'
              }`}
              items={tabItems}
              onChange={handleChangeTab}
              renderTabBar={renderTabBar}
              tabBarGutter={10}
              type="card"
            />
          </ElementCollapseContext.Provider>
        </section>
      )}

      <section className="yaymail-customizer-sidebar__footer">
        <a onClick={handleBackToDashboard}>
          <span className="yaymail-customizer-sidebar__footer__btn-back">
            <ArrowLeftOutlined className="yaymail-customizer-sidebar__footer__icon-back" />
            <span>{__('Back to dashboard', 'yaymail')}</span>
          </span>
        </a>

        {isElementMode ? (
          <Tooltip title={__('View History', 'yaymail')}>
            <Button
              type="primary"
              shape="circle"
              onClick={handleViewHistory}
              size="large"
              className="yaymail-customizer-sidebar__footer__btn-history"
            >
              <HistoryIcon
                style={{
                  margin: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  width: '18px',
                  height: '18px',
                }}
              />
            </Button>
          </Tooltip>
        ) : (
          <Button type="primary" shape="circle" onClick={handleViewHistory} disabled size="large">
            <HistoryOutlined />
          </Button>
        )}
      </section>
      <DiscardChangesConfirmModal />
      <PatternPanel />
      <Modal isOpen={openModal} onOpen={handleOpenModal} onClose={handleCloseModal} />
    </>
  );
};

export default Sidebar;
