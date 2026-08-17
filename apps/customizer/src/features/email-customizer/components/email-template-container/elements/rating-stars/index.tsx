import { CSSProperties, useMemo } from 'react';

import ElementWrapper from '@src/features/email-customizer/components/element-wrapper';

import { ITemplateProps } from '@src/features/email-customizer/type';
import { getDimensionValue } from '@yaymail/utilities/src/functions';

import withMemo from '../with-memo';

const RatingStarsContent = ({ element }: ITemplateProps<'rating_stars'>) => {
  const data = element.data;

  const wrapperStyles: CSSProperties = useMemo(
    () => ({
      textAlign: data.align ?? 'center',
      paddingTop: getDimensionValue(data.padding.top ?? 0),
      paddingRight: getDimensionValue(data.padding.right ?? 0),
      paddingBottom: getDimensionValue(data.padding.bottom ?? 0),
      paddingLeft: getDimensionValue(data.padding.left ?? 0),
      backgroundColor: data.background_color || 'transparent',
    }),
    [data.align, data.padding, data.background_color],
  );

  const tableStyles: CSSProperties = useMemo(
    () => ({
      display: 'inline-table',
      borderCollapse: 'collapse',
    }),
    [],
  );

  const ratingValue = useMemo(() => {
    return data.active_stars;
  }, [data.active_stars]);

  const totalStars = useMemo(() => {
    return Math.round(data.total_stars);
  }, [data.total_stars]);

  const size = useMemo(() => {
    return getDimensionValue(data.size);
  }, [data.size]);

  return (
    <ElementWrapper
      className="yaymail-customizer-element-rating-stars"
      element={element}
      style={wrapperStyles}
    >
      <table className="yaymail-element-rating-stars" cellPadding="0" cellSpacing="0" role="presentation" style={tableStyles}>
        <tbody>
          <tr>
            <td>
              {Array.from({ length: totalStars }).map((_, index) => {
                const isFilled = index < Math.floor(ratingValue);

                const cellStyles: CSSProperties = {
                  color: isFilled ? data.active_stars_color : data.inactive_stars_color,
                  fontSize: size,
                  lineHeight: 1,
                  padding: 0,
                  paddingLeft: getDimensionValue((data.spacing ?? 10) / 2),
                  paddingRight: getDimensionValue((data.spacing ?? 10) / 2),
                };

                return (
                  <span key={index} style={cellStyles}>
                    &#9733;
                  </span>
                );
              })}
            </td>
          </tr>
        </tbody>
      </table>
    </ElementWrapper>
  );
};

const RatingStars = withMemo(RatingStarsContent);

export default RatingStars;
