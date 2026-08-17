import { CSSProperties, useCallback, useMemo } from 'react';

import { getDimensionValue } from '@yaymail/utilities/src/functions';

import { ITemplateProps } from '../../../../type';
import ElementWrapper from '../../../element-wrapper';
import withMemo from '../with-memo';
import { useImageListStore } from './store';

import './index.scss';

const ImageListContent = ({ element }: ITemplateProps<'image_list'>) => {
  const numberColumn = useMemo(() => {
    return +element.data.number_column;
  }, [element.data.number_column]);

  const widthColumn = useMemo(() => {
    return 100 / numberColumn;
  }, [numberColumn]);

  const wrapperStyles: CSSProperties = useMemo(
    () => ({
      backgroundColor: element.data.background_color || 'transparent',
    }),
    [element.data.background_color],
  );

  const column1Styles: CSSProperties = useMemo(
    () => ({
      paddingTop: getDimensionValue(element.data.image_list.column_1?.padding.value.top ?? 0),
      paddingRight: getDimensionValue(element.data.image_list.column_1?.padding.value.right ?? 0),
      paddingBottom: getDimensionValue(element.data.image_list.column_1?.padding.value.bottom ?? 0),
      paddingLeft: getDimensionValue(element.data.image_list.column_1?.padding.value.left ?? 0),
      textAlign: element.data.image_list.column_1?.align.value || 'center',
    }),
    [element.data.image_list.column_1.padding.value, element.data.image_list.column_1.align.value],
  );

  const column2Styles: CSSProperties = useMemo(
    () => ({
      paddingTop: getDimensionValue(element.data.image_list.column_2?.padding.value.top ?? 0),
      paddingRight: getDimensionValue(element.data.image_list.column_2?.padding.value.right ?? 0),
      paddingBottom: getDimensionValue(element.data.image_list.column_2?.padding.value.bottom ?? 0),
      paddingLeft: getDimensionValue(element.data.image_list.column_2?.padding.value.left ?? 0),
      textAlign: element.data.image_list.column_2?.align.value || 'center',
    }),
    [element.data.image_list.column_2.padding.value, element.data.image_list.column_2.align.value],
  );

  const column3Styles: CSSProperties = useMemo(
    () => ({
      paddingTop: getDimensionValue(element.data.image_list.column_3?.padding.value.top ?? 0),
      paddingRight: getDimensionValue(element.data.image_list.column_3?.padding.value.right ?? 0),
      paddingBottom: getDimensionValue(element.data.image_list.column_3?.padding.value.bottom ?? 0),
      paddingLeft: getDimensionValue(element.data.image_list.column_3?.padding.value.left ?? 0),
      textAlign: element.data.image_list.column_3?.align.value || 'center',
    }),
    [element.data.image_list.column_3.padding.value, element.data.image_list.column_3.align.value],
  );

  const img1Styles: CSSProperties = useMemo(
    () => ({
      width:
        element.data.image_list.column_1?.full_width?.value === true
          ? '100%'
          : getDimensionValue(element.data.image_list.column_1?.width.value ?? 100),
    }),
    [element.data.image_list.column_1.full_width?.value, element.data.image_list.column_1.width.value],
  );

  const img2Styles: CSSProperties = useMemo(
    () => ({
      width:
        element.data.image_list.column_2?.full_width?.value === true
          ? '100%'
          : getDimensionValue(element.data.image_list.column_2?.width.value ?? 100),
    }),
    [element.data.image_list.column_2.full_width?.value, element.data.image_list.column_2.width.value],
  );

  const img3Styles: CSSProperties = useMemo(
    () => ({
      width:
        element.data.image_list.column_3?.full_width?.value === true
          ? '100%'
          : getDimensionValue(element.data.image_list.column_3?.width.value ?? 100),
    }),
    [element.data.image_list.column_3.full_width?.value, element.data.image_list.column_3.width.value],
  );

  const selectColumn = useImageListStore((state) => state.selectColumn);
  const selectedColumn = useImageListStore((state) => state.selectedColumn);

  const changeActiveColumn = useCallback(
    (column: number) => {
      selectColumn(column);
    },
    [selectColumn],
  );

  return (
    <>
      <ElementWrapper
        className="yaymail-customizer-element-image-list"
        element={element}
        style={wrapperStyles}
      >
        <table className="yaymail-table-image-list" style={{ width: '100%', tableLayout: 'fixed' }}>
          <tbody>
            <tr>
              {/* Column 1 */}
              <td
                onClick={() => changeActiveColumn(1)}
                valign="top"
                style={{ width: getDimensionValue(widthColumn, '%'), boxSizing: 'border-box' }}
                data-column="1"
                className={`yaymail-table-image-list-column ${
                  selectedColumn === 1 ? 'active' : ''
                }`}
              >
                <table style={{ width: '100%', tableLayout: 'fixed' }}>
                  <tbody>
                    <tr>
                      <td style={column1Styles}>
                        <a
                          className="yaymail-customizer-element-image-list__anchor"
                          href={element.data.image_list.column_1.url.value}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <img
                            style={{
                              ...img1Styles,
                              display: 'inline-block',
                              maxWidth: '100%',
                              height: 'auto',
                            }}
                            src={element.data.image_list.column_1.image.value}
                            alt={element.data.image_list.column_1.alt?.value ?? ''}
                          />
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
              {/* Column 2 */}
              {numberColumn > 1 && (
                <td
                  onClick={() => changeActiveColumn(2)}
                  valign="top"
                  data-column="2"
                  style={{ width: getDimensionValue(widthColumn, '%'), boxSizing: 'border-box' }}
                  className={`yaymail-table-image-list-column ${
                    selectedColumn === 2 ? 'active' : ''
                  }`}
                >
                  <table style={{ width: '100%', tableLayout: 'fixed' }}>
                    <tbody>
                      <tr>
                        <td style={column2Styles}>
                          <a
                            className="yaymail-customizer-element-image-list__anchor"
                            href={element.data.image_list.column_2.url.value}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              style={{
                                ...img2Styles,
                                display: 'inline-block',
                                maxWidth: '100%',
                                height: 'auto',
                              }}
                              src={element.data.image_list.column_2.image.value}
                              alt={element.data.image_list.column_2.alt?.value ?? ''}
                            />
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              )}
              {/* Column 3 */}
              {numberColumn === 3 && (
                <td
                  onClick={() => changeActiveColumn(3)}
                  valign="top"
                  data-column="3"
                  style={{ width: getDimensionValue(widthColumn, '%'), boxSizing: 'border-box' }}
                  className={`yaymail-table-image-list-column ${
                    selectedColumn === 3 ? 'active' : ''
                  }`}
                >
                  <table style={{ width: '100%', tableLayout: 'fixed' }}>
                    <tbody>
                      <tr>
                        <td style={column3Styles}>
                          <a
                            className="yaymail-customizer-element-image-list__anchor"
                            href={element.data.image_list.column_3.url.value}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img
                              style={{
                                ...img3Styles,
                                display: 'inline-block',
                                maxWidth: '100%',
                                height: 'auto',
                              }}
                              src={element.data.image_list.column_3.image.value}
                              alt={element.data.image_list.column_3.alt?.value ?? ''}
                            />
                          </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </ElementWrapper>
    </>
  );
};

const ImageList = withMemo(ImageListContent);

export default ImageList;
