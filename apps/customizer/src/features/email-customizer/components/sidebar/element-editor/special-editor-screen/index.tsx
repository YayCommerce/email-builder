import { ArrowLeftOutlined } from '@ant-design/icons';
import useTemplateContentStore from '@src/stores/templateContent';
import { useEffect, useRef } from 'react';
import Scrollbars from 'react-custom-scrollbars-2';
import CustomScrollbar from '../../custom-scrollbar';
import GlobalFooterEditorScreen from './global-footer-editor-screen';
import GlobalHeaderEditorScreen from './global-header-editor-screen';
import { useOutsideClick } from '@src/hooks/useOutsideClick';

export default function SpecialEditorScreen() {
  const setSpecialEditorScreen = useTemplateContentStore((state) => state.setSpecialEditorScreen);
  const specialEditorScreen = useTemplateContentStore((state) => state.specialEditorScreen);
  const chosenElementId = useTemplateContentStore((state) => state.chosenElement?.id);
  const handleExitScreen = () => {
    setSpecialEditorScreen(null);
  };
  const scrollbarRef = useRef<Scrollbars>(null);
  useEffect(() => {
    scrollbarRef.current?.scrollTop(0);
  }, [specialEditorScreen]);
  useEffect(() => {
    if (chosenElementId) {
      setSpecialEditorScreen(null);
    }
  }, [chosenElementId, setSpecialEditorScreen]);
  useOutsideClick(
    () => {
      setSpecialEditorScreen(null);
    },
    true,
    {
      boundaryElementSelectors: [
        '.yaymail-customizer-template-section',
        '[class^=yaymail-email-customizer__header]',
        '.yaymail-customizer-main',
      ],
    },
  );
  return (
    <div className="yaymail-customizer-sidebar-editor">
      <div className="yaymail-customizer-sidebar-editor__header">
        <span className="yaymail-btn-back" onClick={handleExitScreen}>
          <ArrowLeftOutlined className="yaymail-btn-back__icon" />
          <span className="yaymail-btn-back__label">Edit {specialEditorScreen?.title}</span>
        </span>
      </div>
      <CustomScrollbar ref={scrollbarRef}>
        <main className={`yaymail-customizer-sidebar-editor__main`}>
          {specialEditorScreen?.key === 'global_header' ? <GlobalHeaderEditorScreen /> : null}
          {specialEditorScreen?.key === 'global_footer' ? <GlobalFooterEditorScreen /> : null}
        </main>
      </CustomScrollbar>
    </div>
  );
}
