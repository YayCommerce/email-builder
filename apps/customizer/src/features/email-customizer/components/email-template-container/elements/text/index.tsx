import { CSSProperties, useMemo } from 'react';

import EditZone from '@src/components/edit-zone';
import useShortcode from '@src/hooks/useShortcode';

import YAYMAIL_TOKENS from '@src/constants/tokens';
import { getDimensionValue } from '@yaymail/utilities/src/functions';

import { ITemplateProps } from '../../../../type';
import ElementWrapper from '../../../element-wrapper';
import withMemo from '../with-memo';

const TextContent = ({ element }: ITemplateProps<'text'>) => {
  const data = element.data;

  const { doShortcode } = useShortcode();
  const wrapperStyles: CSSProperties = useMemo(
    () => ({
      paddingTop: getDimensionValue(data.padding.top),
      paddingRight: getDimensionValue(data.padding.right),
      paddingBottom: getDimensionValue(data.padding.bottom),
      paddingLeft: getDimensionValue(data.padding.left),
      backgroundColor: data.background_color || 'transparent',
    }),
    [data],
  );

  const textStyles: CSSProperties = useMemo(
    () => ({
      fontFamily: data.font_family ?? 'initial',
      color: data.text_color ?? YAYMAIL_TOKENS.color.black[700],
    }),
    [data.font_family, data.text_color],
  );

  const shortcodedContent = useMemo(() => {
    return doShortcode(data.rich_text ?? '');
  }, [data.rich_text, doShortcode]);

  return (
    <ElementWrapper
      className="yaymail-customizer-element-text"
      element={element}
      style={wrapperStyles}
    >
      <EditZone
        element={element}
        valuePath="rich_text"
        displayHtml={shortcodedContent}
        style={textStyles}
      />
    </ElementWrapper>
  );
};

const Text = withMemo(TextContent);

export default Text;
