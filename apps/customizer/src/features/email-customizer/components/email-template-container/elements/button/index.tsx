import { CSSProperties, useMemo } from 'react';

import EditZone from '@src/components/edit-zone';
import useShortcode from '@src/hooks/useShortcode';

import YAYMAIL_TOKENS from '@src/constants/tokens';
// eslint-disable-next-line no-restricted-imports
import { getDimensionValue } from '@src/features/email-customizer/utils';
import { getBorderStyle } from '@yaymail/utilities/src/functions';

import { ITemplateProps } from '../../../../type';
import ElementWrapper from '../../../element-wrapper';
import withMemo from '../with-memo';

import './index.scss';

const ButtonContent = ({ element }: ITemplateProps<'button'>) => {
  const data = element.data;
  const align = data.align;

  const buttonPadding =
    data.button_padding !== undefined
      ? data.button_padding
      : {
          top: '12',
          right: '20',
          bottom: '12',
          left: '20',
        };

  const { doShortcode } = useShortcode();

  const wrapperStyles: CSSProperties = useMemo(
    () => ({
      textAlign: 'center',
      backgroundColor: data.background_color || 'transparent',
    }),
    [data.background_color],
  );

  const parsedWidth = useMemo(() => {
    const widthVal = data.width as unknown as string | number;
    if (widthVal === 'custom') {
      return getDimensionValue((data as any).custom_width ?? 50, '%');
    }
    if (['auto', '25%', '50%', '75%', '100%'].includes(widthVal as string)) {
      return widthVal === 'auto' ? 'auto' : (widthVal as string);
    }
    return getDimensionValue(widthVal ?? 50, '%');
  }, [data.width, (data as any).custom_width]);

  const buttonHolderStyles: CSSProperties = useMemo(
    () => ({
      paddingTop: getDimensionValue(data.padding.top),
      paddingRight: getDimensionValue(data.padding.right),
      paddingBottom: getDimensionValue(data.padding.bottom),
      paddingLeft: getDimensionValue(data.padding.left),
      width: parsedWidth,
      margin: align === 'center' ? '0 auto' : 'auto',
      float: align === 'left' || align === 'right' ? align : 'unset',
    }),
    [element.data.padding, parsedWidth, align],
  );

  const linkStyles: CSSProperties = useMemo(
    () => ({
      display: 'inline-block',
      width: '100%',
      borderTopLeftRadius: getDimensionValue(data.border_radius.top_left ?? 0),
      borderTopRightRadius: getDimensionValue(data.border_radius.top_right ?? 0),
      borderBottomRightRadius: getDimensionValue(data.border_radius.bottom_right ?? 0),
      borderBottomLeftRadius: getDimensionValue(data.border_radius.bottom_left ?? 0),
      backgroundColor: data.button_background_color || YAYMAIL_TOKENS.color.wcPurple.default,
      ...getBorderStyle(data.border),
    }),
    [data.border_radius, data.button_background_color, data.border],
  );

  const textStyles: CSSProperties = useMemo(
    () => ({
      display: 'block',
      fontFamily: data.font_family ?? 'initial',
      lineHeight: getDimensionValue(data.height ?? 21),
      color: data.text_color || YAYMAIL_TOKENS.color.white,
      fontSize: getDimensionValue(data.font_size ?? 13),
      fontWeight: data.weight || 'inherit',
      paddingTop: getDimensionValue(buttonPadding.top),
      paddingRight: getDimensionValue(buttonPadding.right),
      paddingBottom: getDimensionValue(buttonPadding.bottom),
      paddingLeft: getDimensionValue(buttonPadding.left),
    }),
    [data.font_family, data.height, data.text_color, data.font_size, data.weight, buttonPadding],
  );

  const shortcodedText = useMemo(() => doShortcode(data.text ?? ''), [data.text, doShortcode]);
  const shortcodedUrl = useMemo(() => doShortcode(data.url ?? ''), [data.url, doShortcode]);

  return (
    <ElementWrapper
      className="yaymail-customizer-element-button"
      element={element}
      style={wrapperStyles}
    >
      <table className="yaymail-element-button" style={buttonHolderStyles} align={align}>
        <tbody>
          <tr>
            <td style={{ padding: 0 }}>
              <div style={linkStyles}>
                <a
                  className="yaymail-customizer-element-button__anchor"
                  href={shortcodedUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  <EditZone
                    element={element}
                    valuePath="text"
                    displayHtml={shortcodedText}
                    contentType="plain_text"
                    attributeLabel="Button text"
                    style={textStyles}
                  />
                </a>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </ElementWrapper>
  );
};

const Button = withMemo(ButtonContent);

export default Button;
