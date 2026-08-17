import { useCallback, useEffect, useRef } from 'react';
import { ConfigProvider } from 'antd';
import Scrollbars from 'react-custom-scrollbars-2';

import { ArrowLeftOutlined } from '@ant-design/icons';

import useTemplateContentStore from '@src/stores/templateContent';
import { SIDEBAR_ANTD_THEME } from '@src/constants/theme';

import CustomScrollbar from '../custom-scrollbar';
import EditorBuilder from './editor-builder';

import './index.scss';
import { __ } from '@wordpress/i18n';

const ElementEditor = () => {
  const unchooseElement = useTemplateContentStore((state) => state.unchooseElement);
  const handleExitEditor = useCallback(() => {
    unchooseElement();
  }, [unchooseElement]);

  const chosenElementName = useTemplateContentStore((state) => state.chosenElement?.name);
  // const chosenElementType = useTemplateContentStore((state) => state.chosenElement?.type);
  const chosenElementId = useTemplateContentStore((state) => state.chosenElement?.id);

  const scrollbarRef = useRef<Scrollbars>(null);
  useEffect(() => {
    scrollbarRef.current?.scrollTop(0);
  }, [chosenElementId]);
  return (
    <ConfigProvider theme={SIDEBAR_ANTD_THEME}>
      <div className="yaymail-customizer-sidebar-editor">
        <div className="yaymail-customizer-sidebar-editor__header">
          <span className="yaymail-btn-back" onClick={handleExitEditor}>
            <ArrowLeftOutlined className="yaymail-btn-back__icon" />
            <span className="yaymail-btn-back__label">
              {__('Edit', 'yaymail')} {chosenElementName}
            </span>
          </span>
        </div>
        <CustomScrollbar ref={scrollbarRef}>
          <main className={`yaymail-customizer-sidebar-editor__main`}>
            <EditorBuilder />
          </main>
        </CustomScrollbar>
      </div>
    </ConfigProvider>
  );
};

export default ElementEditor;
