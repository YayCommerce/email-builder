import { CSSProperties, useMemo } from 'react';

// eslint-disable-next-line no-restricted-imports
import { getDimensionValue } from '@src/features/email-customizer/utils';

import { ITemplateProps } from '../../../../type';
import ElementWrapper from '../../../element-wrapper';
import withMemo from '../with-memo';

const SpaceContent = ({ element }: ITemplateProps<'space'>) => {
  const data = element.data;

  const wrapperStyles: CSSProperties = useMemo(
    () => ({
      backgroundColor: data.background_color || 'transparent',
    }),
    [data.background_color],
  );

  const spaceStyles: CSSProperties = useMemo(
    () => ({
      height: getDimensionValue(data.height ?? 40),
      fontSize: 0,
      backgroundColor: data.background_color || 'transparent',
    }),
    [data.height, data.background_color],
  );

  return (
    <ElementWrapper
      className="yaymail-customizer-element-space"
      element={element}
      style={wrapperStyles}
    >
      <table
        cellPadding="0"
        cellSpacing="0"
        role="presentation"
        style={{ borderCollapse: 'collapse', width: '100%' }}
      >
        <tbody>
          <tr>
            <td style={spaceStyles}>&nbsp;</td>
          </tr>
        </tbody>
      </table>
    </ElementWrapper>
  );
};

const Space = withMemo(SpaceContent);

export default Space;
