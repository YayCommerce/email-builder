import { CSSProperties, useMemo } from 'react';

import useShortcode from '@src/hooks/useShortcode';

import YAYMAIL_TOKENS from '@src/constants/tokens';
import { getDimensionValue } from '@yaymail/utilities/src/functions';

import { ITemplateProps } from '../../../../type';
import ElementWrapper from '../../../element-wrapper';
import withMemo from '../with-memo';
import { useTextListStore } from './store';

import './index.scss';

const TextListContent = ({ element }: ITemplateProps<'text_list'>) => {
  const data = element.data;

  const widthColumn = useMemo(() => {
    return 100 / Number(data.number_column);
  }, [data.number_column]);

  const wrapperStyles: CSSProperties = useMemo(
    () => ({
      backgroundColor: data.background_color || 'transparent',
    }),
    [data.background_color],
  );

  const textColorStyles: CSSProperties = useMemo(
    () => ({
      color: data.text_color || 'transparent',
    }),
    [data.text_color],
  );

  const selectColumn = useTextListStore((state) => state.selectColumn);
  const selectElement = useTextListStore((state) => state.selectElement);

  const handleSelect = (column: number, element: number) => {
    selectColumn(column);
    selectElement(element);
  };

  return (
    <ElementWrapper
      className="yaymail-customizer-element-text-list"
      element={element}
      style={wrapperStyles}
    >
      <table className="yaymail-table-text-list">
        <tbody>
          <tr style={textColorStyles}>
            {[...Array(Number(data.number_column)).keys()].map((index) => (
              <Column
                key={index + 1}
                index={index + 1}
                columnWidth={widthColumn}
                columnSettings={(element.data as any)['text_list'][`column_${index + 1}`]}
                onSelect={handleSelect}
              />
            ))}
          </tr>
        </tbody>
      </table>
    </ElementWrapper>
  );
};

function Column({
  columnWidth,
  index,
  columnSettings,
  onSelect,
}: {
  columnWidth: number;
  index: number;
  columnSettings: any;
  onSelect: any;
}) {
  const { doShortcode } = useShortcode();
  const isSelected = useTextListStore((state) => state.selectedColumn === index);
  const selectedElement = useTextListStore((state) => state.selectedElement);
  const buttonAlign = useMemo(() => {
    return columnSettings.button_align.value;
  }, [columnSettings.button_align.value]);
  const columnTextStyles: CSSProperties = useMemo(
    () => ({
      paddingTop: getDimensionValue(columnSettings?.padding.value.top ?? 0),
      paddingRight: getDimensionValue(columnSettings?.padding.value.right ?? 0),
      paddingBottom: getDimensionValue(columnSettings?.padding.value.bottom ?? 0),
      paddingLeft: getDimensionValue(columnSettings?.padding.value.left ?? 0),
      fontFamily: columnSettings?.font_family.value ?? 'initial',
    }),
    [columnSettings?.padding.value, columnSettings?.font_family.value],
  );

  const buttonHolderStyles: CSSProperties = useMemo(
    () => ({
      paddingTop: getDimensionValue(columnSettings.button_padding.value.top || 0),
      paddingRight: getDimensionValue(columnSettings.button_padding.value.right || 0),
      paddingBottom: getDimensionValue(columnSettings.button_padding.value.bottom || 0),
      paddingLeft: getDimensionValue(columnSettings.button_padding.value.left || 0),
      width: getDimensionValue(columnSettings.button_width.value ?? 50, '%'),
      margin: buttonAlign === 'center' ? '0 auto' : 'auto',
      float: buttonAlign === 'left' || buttonAlign === 'right' ? buttonAlign : 'unset',
    }),
    [columnSettings.button_padding.value, columnSettings.button_width.value, buttonAlign],
  );

  const buttonLinkStyles: CSSProperties = useMemo(
    () => ({
      borderTopLeftRadius: getDimensionValue(
        columnSettings.button_border_radius.value?.top_left ?? 5,
      ),
      borderTopRightRadius: getDimensionValue(
        columnSettings.button_border_radius.value?.top_right ?? 5,
      ),
      borderBottomRightRadius: getDimensionValue(
        columnSettings.button_border_radius.value?.bottom_right ?? 5,
      ),
      borderBottomLeftRadius: getDimensionValue(
        columnSettings.button_border_radius.value?.bottom_left ?? 5,
      ),
      fontSize: getDimensionValue(columnSettings.button_font_size.value ?? 13),
      fontWeight: columnSettings.button_weight.value || 'inherit',
      backgroundColor:
        columnSettings.button_background_color.value || YAYMAIL_TOKENS.color.wcPurple.default,
      textAlign: 'center',
    }),
    [
      columnSettings.button_border_radius.value,
      columnSettings.button_font_size.value,
      columnSettings.button_weight.value,
      columnSettings.button_background_color.value,
    ],
  );

  const buttonTextStyles: CSSProperties = useMemo(
    () => ({
      fontFamily: columnSettings.button_font_family.value ?? 'initial',
      lineHeight: getDimensionValue(columnSettings.button_height.value ?? 21),
      color: columnSettings.button_text_color.value || YAYMAIL_TOKENS.color.white,
    }),
    [
      columnSettings.button_font_family.value,
      columnSettings.button_height.value,
      columnSettings.button_text_color.value,
    ],
  );

  const columnTextContent = useMemo(() => {
    return doShortcode(columnSettings?.rich_text.value ?? '');
  }, [columnSettings.rich_text.value, doShortcode]);

  return (
    <td valign="top" style={{ width: getDimensionValue(columnWidth, '%') }} data-column={index}>
      <table style={{ width: '100%', tableLayout: 'fixed' }}>
        <tbody>
          <tr>
            <td>
              <div
                onClick={() => onSelect(index, 1)}
                className={`yaymail-table-text-list-column ${
                  isSelected && selectedElement === 1 ? 'active' : ''
                }`}
                style={columnTextStyles}
                dangerouslySetInnerHTML={{ __html: columnTextContent }}
              ></div>
            </td>
          </tr>
          {columnSettings?.show_button && (
            <tr>
              <td
                onClick={() => onSelect(index, 2)}
                className={`yaymail-table-text-list-column ${
                  isSelected && selectedElement === 2 ? 'active' : ''
                }`}
              >
                <table style={buttonHolderStyles} align={buttonAlign}>
                  <tbody>
                    <tr>
                      <td>
                        <a
                          className="yaymail-customizer-element-text-list-button__anchor"
                          href={columnSettings.button_url.value}
                          style={buttonLinkStyles}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <span style={buttonTextStyles}>{columnSettings.button_text.value}</span>
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </td>
  );
}

const TextList = withMemo(TextListContent);

export default TextList;
