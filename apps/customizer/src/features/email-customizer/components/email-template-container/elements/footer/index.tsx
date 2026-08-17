/* eslint-disable no-restricted-imports */
import { CSSProperties, useMemo } from 'react';

import useShortcode from '@src/hooks/useShortcode';

import YAYMAIL_TOKENS from '@src/constants/tokens';
import { getDimensionValue } from '@src/features/email-customizer/utils';

import { ITemplateProps } from '../../../../type';
import ElementWrapper from '../../../element-wrapper';
import withMemo from '../with-memo';
import useCustomizerPageStore from '@src/stores/customizerPage';
import { useGlobalHeaderFooterEnabled } from '@src/hooks/useGlobalHeaderFooterEnabled';

const FooterContent = ({ element }: ITemplateProps<'footer'>) => {
  const data = element.data;

  const isInGlobalHeader = useCustomizerPageStore((state) =>
    state.globalHeaderFooter.globalFooterElements.find((el) => el.id === element.id),
  );
  const globalFooterSettings = useCustomizerPageStore(
    (state) => state.templateData?.global_footer_settings,
  );
  const isGlobalHeaderFooterEnabled = useGlobalHeaderFooterEnabled();

  const footerValue = useMemo(() => {
    if (!isGlobalHeaderFooterEnabled) {
      return data.rich_text;
    }
    if (!isInGlobalHeader) {
      return data.rich_text;
    }
    if (!globalFooterSettings?.content_override) {
      return data.rich_text;
    }
    return globalFooterSettings?.footer_content;
  }, [isInGlobalHeader, globalFooterSettings, data.rich_text, isGlobalHeaderFooterEnabled]);

  const { doShortcode } = useShortcode();
  const wrapperStyles: CSSProperties = useMemo(
    () => ({
      paddingTop: getDimensionValue(data.padding.top),
      paddingRight: getDimensionValue(data.padding.right),
      paddingBottom: getDimensionValue(data.padding.bottom),
      paddingLeft: getDimensionValue(data.padding.left),
      backgroundColor: data.background_color,
    }),
    [data.padding, data.background_color],
  );

  const textStyles: CSSProperties = useMemo(
    () => ({
      fontFamily: data.font_family ?? 'initial',
      color: data.text_color ?? YAYMAIL_TOKENS.color.black[700],
    }),
    [data.font_family, data.text_color],
  );

  const shortcodedContent = useMemo(
    () => doShortcode(footerValue) ?? '',
    [footerValue, doShortcode],
  );

  return (
    <ElementWrapper
      className="yaymail-customizer-element-footer"
      element={element}
      style={wrapperStyles}
    >
      <div style={textStyles} dangerouslySetInnerHTML={{ __html: shortcodedContent }} />
    </ElementWrapper>
  );
};

const Footer = withMemo(FooterContent);

export default Footer;
