import { CSSProperties, useMemo } from 'react';

import useShortcode from '@src/hooks/useShortcode';

import YAYMAIL_TOKENS from '@src/constants/tokens';
import { getDimensionValue } from '@yaymail/utilities/src/functions';

import { ITemplateProps } from '../../../../type';
import ElementWrapper from '../../../element-wrapper';
import { TITLE_SIZE_OPTIONS } from '../../../sidebar/element-editor/editor-builder/element-property/utils';
import withMemo from '../with-memo';

const getFontSize = (size: string, isSubtitle: boolean = false) => {
  const selectedSize = TITLE_SIZE_OPTIONS.find((s) => s.value === size)?.size ?? 16;
  if (size === 'default' && isSubtitle) {
    return 13;
  }
  return selectedSize;
};

const TitleContent = ({ element }: ITemplateProps<'title'>) => {
  const { doShortcode } = useShortcode();
  const data = element.data;

  const titleSize = useMemo(() => getFontSize(data.title_size), [data.title_size]);
  const subtitleSize = useMemo(() => getFontSize(data.subtitle_size, true), [data.subtitle_size]);

  const wrapperStyles: CSSProperties = useMemo(
    () => ({
      textAlign: data.align ?? 'center',
      paddingTop: getDimensionValue(data.padding.top),
      paddingRight: getDimensionValue(data.padding.right),
      paddingBottom: getDimensionValue(data.padding.bottom),
      paddingLeft: getDimensionValue(data.padding.left),
      backgroundColor: data.background_color || 'transparent',
      lineHeight: 'normal',
    }),
    [data.align, data.padding, data.background_color],
  );

  const titleStyles: CSSProperties = useMemo(
    () => ({
      textAlign: data.align ?? 'center',
      fontFamily: data.font_family ?? 'initial',
      color: data.text_color ?? YAYMAIL_TOKENS.color.black[700],
      fontSize: getDimensionValue(titleSize),
      margin: 0,
    }),
    [data.text_color, data.font_family, titleSize, data.align],
  );

  const subtitleStyles: CSSProperties = useMemo(
    () => ({
      fontFamily: data.font_family ?? 'initial',
      color: data.text_color ?? YAYMAIL_TOKENS.color.black[700],
      fontSize: getDimensionValue(subtitleSize),
      margin: 0,
    }),
    [data.text_color, data.font_family, subtitleSize],
  );

  const titleShortcodedContent = useMemo(() => {
    return doShortcode(data.title ?? '');
  }, [data.title, doShortcode]);

  const subtitleShortcodedContent = useMemo(() => {
    return doShortcode(data.subtitle ?? '');
  }, [data.subtitle, doShortcode]);

  return (
    <ElementWrapper
      className="yaymail-customizer-element-title"
      element={element}
      style={wrapperStyles}
    >
      <h1
        className="yaymail-customizer-element-title__title"
        style={titleStyles}
        dangerouslySetInnerHTML={{ __html: titleShortcodedContent }}
      ></h1>
      <h4
        className="yaymail-customizer-element-title__subtitle"
        style={subtitleStyles}
        dangerouslySetInnerHTML={{ __html: subtitleShortcodedContent }}
      ></h4>
    </ElementWrapper>
  );
};

const Title = withMemo(TitleContent);

export default Title;
