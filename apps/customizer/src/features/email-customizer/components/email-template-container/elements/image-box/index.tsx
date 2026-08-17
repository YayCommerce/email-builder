/* eslint-disable no-restricted-imports */
import { CSSProperties, useMemo, useState } from 'react';

import { publishCustomEvent } from '@src/hooks/useCustomEvent';
import useShortcode from '@src/hooks/useShortcode';

import YAYMAIL_TOKENS from '@src/constants/tokens';
import { getDimensionValue } from '@src/features/email-customizer/utils';
import { __ } from '@wordpress/i18n';

import { ElementDataTypeMap, ITemplateProps } from '../../../../type';
import ElementWrapper from '../../../element-wrapper';
import withMemo from '../with-memo';

import './index.scss';

const ImageBoxContent = ({ element }: ITemplateProps<'image_box'>) => {
  const data = element.data as ElementDataTypeMap['image_box'];

  const { doShortcode } = useShortcode();

  const wrapperStyles: CSSProperties = useMemo(
    () => ({
      backgroundColor: data.background_color || 'transparent',
    }),
    [data.background_color],
  );

  const imageColumnStyles: CSSProperties = useMemo(
    () => ({
      paddingTop: getDimensionValue(data.image_box.column_1?.padding.value.top),
      paddingRight: getDimensionValue(data.image_box.column_1?.padding.value.right),
      paddingBottom: getDimensionValue(data.image_box.column_1?.padding.value.bottom),
      paddingLeft: getDimensionValue(data.image_box.column_1?.padding.value.left),
    }),
    [data.image_box.column_1.padding.value],
  );

  const textColumnStyles: CSSProperties = useMemo(
    () => ({
      paddingTop: getDimensionValue(data.image_box.column_2?.padding.value.top),
      paddingRight: getDimensionValue(data.image_box.column_2?.padding.value.right),
      paddingBottom: getDimensionValue(data.image_box.column_2?.padding.value.bottom),
      paddingLeft: getDimensionValue(data.image_box.column_2?.padding.value.left),
    }),
    [data.image_box.column_2.padding.value],
  );

  const imgStyles: CSSProperties = useMemo(
    () => ({
      width:
        data.image_box.column_1.full_width?.value === true
          ? '100%'
          : getDimensionValue(data.image_box.column_1.width.value),
    }),
    [data.image_box.column_1.full_width?.value, data.image_box.column_1.width.value],
  );

  const textStyles: CSSProperties = useMemo(
    () => ({
      fontFamily: data.image_box.column_2.font_family.value ?? 'initial',
      color: data.text_color ?? YAYMAIL_TOKENS.color.black[700],
    }),
    [data.image_box.column_2.font_family.value, data.text_color],
  );

  const shortcodedContent = useMemo(() => {
    return doShortcode(data.image_box.column_2.rich_text.value);
  }, [data.image_box.column_2.rich_text.value, doShortcode]);

  const [activeColumn, setActiveColumn] = useState<'column_1' | 'column_2' | null>(null);
  const changeActiveColumn = (column: 'column_1' | 'column_2') => {
    publishCustomEvent('onYayMailImageBoxColumnSelected', column);
    setActiveColumn(column);
  };

  return (
    <ElementWrapper
      className="yaymail-customizer-element-image-box"
      element={element}
      style={wrapperStyles}
    >
      <table className="yaymail-table-image-box">
        <tbody>
          <tr>
            <td
              onClick={() => changeActiveColumn('column_1')}
              align={data.image_box.column_1.align.value}
              style={imageColumnStyles}
              className={`yaymail-table-image-box-column ${
                activeColumn === 'column_1' ? 'active' : ''
              }`}
            >
              <div>
                <a
                  className="yaymail-customizer-element-image-box__anchor"
                  href={data.image_box.column_1.url.value}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    style={imgStyles}
                    src={data.image_box.column_1.image.value}
                    alt={data.image_box.column_1.alt?.value ?? ''}
                  />
                </a>
              </div>
            </td>
            <td
              onClick={() => changeActiveColumn('column_2')}
              style={textColumnStyles}
              className={`yaymail-table-image-box-column ${
                activeColumn === 'column_2' ? 'active' : ''
              }`}
            >
              <div style={textStyles} dangerouslySetInnerHTML={{ __html: shortcodedContent }}></div>
            </td>
          </tr>
        </tbody>
      </table>
    </ElementWrapper>
  );
};

const ImageBox = withMemo(ImageBoxContent);

export default ImageBox;
