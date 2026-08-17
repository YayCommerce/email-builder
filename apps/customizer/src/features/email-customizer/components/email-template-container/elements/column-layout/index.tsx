import { CSSProperties, MouseEvent, useCallback, useMemo } from 'react';

import { ComponentChildren } from '@src/types';
import { underscoreToSpace } from '@src/utils';
import { getDimensionValue } from '@yaymail/utilities/src/functions';
import debounce from 'lodash.debounce';

import { ITemplateProps } from '../../../../type';
import ElementWrapper from '../../../element-wrapper';
import useResizingStore from '../../resizingStore';

import './index.scss';
interface IElementColumnLayoutProps extends ITemplateProps<'column_layout'> {
  children: ComponentChildren;
}

const ColumnLayout = ({ children, element }: IElementColumnLayoutProps) => {
  const data = element.data;

  const image_url = data?.background_image?.url;
  const DEFAULT_BORDER_RADIUS = {
    topLeft: 0,
    topRight: 0,
    bottomRight: 0,
    bottomLeft: 0,
  };

  const backgroundPosition = useMemo(() => {
    const position = data?.background_image?.position;

    if (!position || position === 'default') return 'unset';

    if (position === 'custom') {
      const x_position = data.background_image?.x_position ?? 0;
      const y_position = data.background_image?.y_position ?? 0;

      return `${x_position}% ${y_position}%`;
    }

    return underscoreToSpace(position);
  }, [data.background_image]);

  const backgroundRepeat = useMemo(() => {
    const repeat = data.background_image?.repeat;

    if (!repeat || repeat === 'default') return 'unset';
    return repeat;
  }, [data.background_image]);

  const backgroundSize = useMemo(() => {
    const size = data.background_image?.size;

    if (!size || size === 'default') return 'unset';

    if (size === 'custom') {
      const custom_size = data.background_image?.custom_size ?? 100;
      return `${custom_size}%`;
    }
    return size;
  }, [data.background_image]);

  const wrapperStyles: CSSProperties = useMemo(
    () => ({
      paddingTop: getDimensionValue(data.padding?.top),
      paddingRight: getDimensionValue(data.padding?.right),
      paddingBottom: getDimensionValue(data.padding?.bottom),
      paddingLeft: getDimensionValue(data.padding?.left),

      backgroundColor: data.background_color || 'transparent',

      borderTopLeftRadius: getDimensionValue(
        data.border_radius?.top_left ?? DEFAULT_BORDER_RADIUS.topLeft,
      ),
      borderTopRightRadius: getDimensionValue(
        data.border_radius?.top_right ?? DEFAULT_BORDER_RADIUS.topRight,
      ),
      borderBottomLeftRadius: getDimensionValue(
        data.border_radius?.bottom_left ?? DEFAULT_BORDER_RADIUS.bottomLeft,
      ),
      borderBottomRightRadius: getDimensionValue(
        data.border_radius?.bottom_right ?? DEFAULT_BORDER_RADIUS.bottomRight,
      ),

      overflow: 'hidden',

      ...(image_url
        ? {
            backgroundImage: `url(${image_url})`,
            backgroundPosition,
            backgroundRepeat,
            backgroundSize,
          }
        : {}),
    }),
    [
      element.data.padding,
      element.data.border_radius,
      element.data.background_color,
      element.data.background_image,
      image_url,
    ],
  );

  // Handle resizing
  const stopResizing = useResizingStore((state) => state.stopResizing);
  const resize = useResizingStore((state) => state.resize);

  const handleMouseMove = useCallback(
    debounce((e: MouseEvent<HTMLDivElement>) => {
      resize(e.clientX);
    }, 0),
    [resize],
  );

  return (
    <ElementWrapper
      element={element}
      className="yaymail-customizer-element-column_layout"
      style={wrapperStyles}
      onMouseMove={handleMouseMove}
      onMouseUp={stopResizing}
    >
      <table
        style={{ width: '100%', backgroundColor: 'inherit' }}
        cellPadding={0}
        cellSpacing={0}
      >
        <tbody>
          <tr>{children}</tr>
        </tbody>
      </table>
    </ElementWrapper>
  );
};
export default ColumnLayout;
