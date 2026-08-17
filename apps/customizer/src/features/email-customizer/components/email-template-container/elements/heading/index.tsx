import { CSSProperties, useMemo } from 'react';

import EditZone from '@src/components/edit-zone';
import useShortcode from '@src/hooks/useShortcode';
import { useGlobalHeaderFooterEnabled } from '@src/hooks/useGlobalHeaderFooterEnabled';
import useCustomizerPageStore from '@src/stores/customizerPage';
import { getDimensionValue } from '@yaymail/utilities/src/functions';

import { ITemplateProps } from '../../../../type';
import ElementWrapper from '../../../element-wrapper';
import withMemo from '../with-memo';

const DEFAULT_PADDING = {
  top: 15,
  right: 50,
  bottom: 15,
  left: 50,
};

const HeadingContent = ({ element }: ITemplateProps<'heading'>) => {
  const data = element.data;
  const { doShortcode } = useShortcode();
  const isInGlobalHeader = useCustomizerPageStore((state) =>
    state.globalHeaderFooter.globalHeaderElements.find((el) => el.id === element.id),
  );
  const globalHeaderSettings = useCustomizerPageStore(
    (state) => state.templateData?.global_header_settings,
  );
  const isGlobalHeaderFooterEnabled = useGlobalHeaderFooterEnabled();

  const isUsingGlobalHeaderOverride = Boolean(
    isGlobalHeaderFooterEnabled && isInGlobalHeader && globalHeaderSettings?.content_override,
  );

  const headingValue = useMemo(() => {
    if (!isGlobalHeaderFooterEnabled) {
      return data.rich_text;
    }
    if (!isInGlobalHeader) {
      return data.rich_text;
    }
    if (!globalHeaderSettings?.content_override) {
      return data.rich_text;
    }
    return globalHeaderSettings?.heading_content;
  }, [isInGlobalHeader, globalHeaderSettings, data.rich_text, isGlobalHeaderFooterEnabled]);

  const wrapperStyles: CSSProperties = useMemo(
    () => ({
      paddingTop: getDimensionValue(data.padding.top ?? DEFAULT_PADDING.top),
      paddingRight: getDimensionValue(data.padding.right ?? DEFAULT_PADDING.right),
      paddingBottom: getDimensionValue(data.padding.bottom ?? DEFAULT_PADDING.bottom),
      paddingLeft: getDimensionValue(data.padding.left ?? DEFAULT_PADDING.left),
      backgroundColor: data.background_color || 'transparent',
    }),
    [data],
  );

  const shortcodedContent = useMemo(
    () => doShortcode(headingValue) ?? '',
    [headingValue, doShortcode],
  );

  const scope = `yaymail-heading-font-${element.id}`;
  const cleanedHtml = shortcodedContent.replace(/font-family\s*:[^;"]+;?/gi, '');
  const font = data.font_family ?? 'inherit';
  const forcedCss = `.${scope}, .${scope} * { font-family: ${font} !important; }`;

  return (
    <ElementWrapper
      className="yaymail-customizer-element-heading"
      element={element}
      style={wrapperStyles}
    >
      <style>{forcedCss}</style>
      <EditZone
        element={element}
        valuePath="rich_text"
        displayHtml={cleanedHtml}
        className={scope}
        style={{ color: data.text_color ?? '#fff' }}
        disabled={isUsingGlobalHeaderOverride}
      />
    </ElementWrapper>
  );
};

const Heading = withMemo(HeadingContent);

export default Heading;
