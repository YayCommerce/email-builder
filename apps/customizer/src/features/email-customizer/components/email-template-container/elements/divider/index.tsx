import { CSSProperties, useMemo } from 'react';

// eslint-disable-next-line no-restricted-imports
import { getDimensionValue } from '@src/features/email-customizer/utils';

import { ITemplateProps } from '../../../../type';
import ElementWrapper from '../../../element-wrapper';
import withMemo from '../with-memo';

const DividerContent = ({ element }: ITemplateProps<'divider'>) => {
  const data = element.data;

  const wrapperStyles: CSSProperties = useMemo(
    () => ({
      paddingTop: getDimensionValue(data.padding.top),
      paddingRight: getDimensionValue(data.padding.right),
      paddingBottom: getDimensionValue(data.padding.bottom),
      paddingLeft: getDimensionValue(data.padding.left),
      backgroundColor: data.background_color || 'transparent',
    }),
    [data.background_color, data.padding],
  );

  const getTableCellStyles = useMemo(() => {
    const margin = data.align === 'center' ? '0 auto' : data.align === 'right' ? '0 0 0 auto' : '0';
    return {
      width: getDimensionValue(data.width ?? 100, '%'),
      borderTopWidth: getDimensionValue(data.height ?? 6),
      borderTopColor: data.divider_color || '#333',
      borderTopStyle: (data.divider_type as CSSProperties['borderTopStyle']) || 'solid',
      padding: 0,
      margin: margin,
      lineHeight: 0,
    };
  }, [data]);

  const tableStyles: CSSProperties = useMemo(
    () => ({
      borderCollapse: 'collapse',
      width: getDimensionValue(data.width ?? 100, '%'),
      margin: data.align === 'center' ? '0 auto' : data.align === 'right' ? '0 0 0 auto' : '0',
    }),
    [data],
  );

  return (
    <ElementWrapper
      className="yaymail-customizer-element-divider"
      element={element}
      style={wrapperStyles}
    >
      <table cellPadding="0" cellSpacing="0" role="presentation" style={tableStyles}>
        <tbody>
          <tr>
            <td style={getTableCellStyles}>&nbsp;</td>
          </tr>
        </tbody>
      </table>
    </ElementWrapper>
  );
};

const Divider = withMemo(DividerContent);

export default Divider;
