import { CSSProperties, useEffect, useMemo } from 'react';

import useCustomizerPageStore from '@src/stores/customizerPage';
import useCustomizerSettingsStore from '@src/stores/customizerSettings';
import useTemplateContentStore from '@src/stores/templateContent';
import { getDimensionValue } from '@yaymail/utilities/src/functions';
import { shallow } from 'zustand/shallow';
import { replaceObjectById } from '../../utils';
import { setTextAlign } from '../element-wrapper/utils';

import Notice from '../notice';
import SortableContainer from '../sortable-container';
import EmailRecursiveElements from './email-recursive-element';
import GlobalHeaderFooterSection from './global-header-footer-section';

import { useDirection } from '@src/hooks/useDirection';
import { __ } from '@wordpress/i18n';
import './index.scss';

const EmailTemplateContainer = () => {
  const settings = useCustomizerSettingsStore((state) => state.settings);
  const currentTemplate = useCustomizerPageStore((state) => state.currentTemplate);
  const templateData = useCustomizerPageStore((state) => state.templateData);
  const containerDirection = useDirection();
  const list = useTemplateContentStore((state) => state.list);
  const setList = useTemplateContentStore((state) => state.updateList);
  useEffect(() => {
    // Update the list whenever chosenElement is updated
    const unsubscribeChosenElement = useTemplateContentStore.subscribe(
      (state) => state.chosenElement,
      (chosenElement) => {
        if (chosenElement?.id) {
          const newList = structuredClone(list);
          replaceObjectById(chosenElement?.id || 0, newList, chosenElement);
          useTemplateContentStore.setState(() => ({
            list: newList,
          }));
        }
      },
      { equalityFn: shallow },
    );

    return () => {
      unsubscribeChosenElement();
    };
  }, [list]);

  const unchooseElement = useTemplateContentStore((state) => state.unchooseElement);

  useEffect(() => {
    unchooseElement();
  }, []);

  const containerWidth = useMemo(() => {
    if (!settings || !settings.container_width || isNaN(settings.container_width)) {
      return 605;
    }
    return settings?.container_width;
  }, [settings]);

  const containerStyle: CSSProperties = useMemo(
    () => ({
      width: getDimensionValue(containerWidth),
      direction: containerDirection as 'rtl' | 'ltr',
    }),
    [containerWidth, containerDirection],
  );

  useEffect(() => {
    if (containerDirection == 'rtl') {
      setTextAlign('right');
    }
    if (containerDirection == 'ltr') {
      setTextAlign('left');
    }
  }, [containerDirection]);

  return (
    <>
      <Notice />
      <CustomCSS />
      <GlobalHeaderFooterSection section="header" style={containerStyle} />
      <SortableContainer
        list={list}
        setList={setList}
        useHandle
        style={containerStyle}
        className={`yaymail-customizer-email-template-container yaymail-template-${currentTemplate} ${
          templateData?.support_status !== 'already_supported' && 'yaymail-uneditable-template'
        }`}
      >
        <ContentWrapper list={list} style={containerStyle}>
          <EmailRecursiveElements list={list} />
        </ContentWrapper>
      </SortableContainer>
      <GlobalHeaderFooterSection section="footer" style={containerStyle} />
    </>
  );
};

function ContentWrapper({
  children,
  list,
  style,
}: {
  children: React.ReactNode;
  list: any[];
  style: CSSProperties;
}) {
  return (
    <>
      {list.length > 0 ? (
        children
      ) : (
        <div className="yaymail-customizer-email-template-container__empty" style={style}>
          <h2>{__('Your template is empty', 'yaymail')}</h2>
          <p>{__('Drag elements here to start customizing', 'yaymail')}</p>
        </div>
      )}
    </>
  );
}

const CustomCSS = () => {
  const customCSS = useCustomizerSettingsStore((state) => state.settings?.custom_css ?? '');
  if (customCSS == '') {
    return null;
  }
  return (
    <style className="yaymail-setting-custom_css">
      {`
          .yaymail-customizer-email-template-container {
            ${customCSS}
          }
        `}
    </style>
  );
};

export default EmailTemplateContainer;
