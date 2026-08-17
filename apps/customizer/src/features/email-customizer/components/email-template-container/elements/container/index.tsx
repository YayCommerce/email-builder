import { CSSProperties, MouseEvent, useCallback, useMemo } from 'react';

// eslint-disable-next-line no-restricted-imports
import { getDimensionValue } from '@src/features/email-customizer/utils';
import useTemplateContentStore from '@src/stores/templateContent';
import { ComponentChildren } from '@src/types';
import { underscoreToSpace } from '@src/utils';
import debounce from 'lodash.debounce';

import { CONTAINER_CLASS_NAME } from '../../../../constants';
import { IElement, ITemplateProps } from '../../../../type';
import ElementWrapper from '../../../element-wrapper';
import SortableContainer from '../../../sortable-container';
import useResizingStore from '../../resizingStore';
import withMemo from '../with-memo';

import './index.scss';

interface IElementContainerProps extends ITemplateProps<'container'> {
  children: ComponentChildren;
  list?: IElement['children'];
}

const ContainerContent = ({ children, element, list = [] }: IElementContainerProps) => {
  const data = element.data;

  const mainList = useTemplateContentStore((state) => state.list);
  const setList = useTemplateContentStore((state) => state.updateList);
  const hasChildren = useMemo(
    () => Boolean(children && list?.length && list.length > 0),
    [children, list],
  );

  const image_url = data?.background_image?.url;
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
      paddingTop: getDimensionValue(data.padding.top),
      paddingRight: getDimensionValue(data.padding.right),
      paddingBottom: getDimensionValue(data.padding.bottom),
      paddingLeft: getDimensionValue(data.padding.left),
      backgroundColor: data.background_color || 'transparent',
      ...(image_url
        ? {
            backgroundImage: `url(${image_url})`,
            backgroundPosition,
            backgroundRepeat,
            backgroundSize,
          }
        : {}),
    }),
    [data.background_color, data.padding, image_url, backgroundPosition, backgroundRepeat, backgroundSize],
  );

  const containerChildrenStyles: CSSProperties = useMemo(
    () => ({
      display: 'flex',
      flexDirection: data.direction === 'horizontal' ? 'row' : 'column',
      justifyContent: 'center',
      alignItems: 'center',
    }),
    [data.direction],
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
      className="yaymail-customizer-element-container"
      style={wrapperStyles}
      onMouseMove={handleMouseMove}
      onMouseUp={stopResizing}
    >
      <div className="yaymail-inner-customizer-element-container">
        <table
          style={{ width: '100%', backgroundColor: 'inherit' }}
          cellPadding={0}
          cellSpacing={0}
        >
          <tbody>
            {/*
             * SortableContainer renders a <div>; it must sit inside a <td> (not directly
             * in <tbody>) or the HTML5 parser foster-parents it — and every sibling after
             * the container — outside the root template node. Mirrors column_layout's <tr><td>.
             */}
            <tr>
              <td>
                <SortableContainer
                  list={list}
                  setList={setList}
                  className={`${CONTAINER_CLASS_NAME} ${
                    data.direction === 'horizontal'
                      ? 'yaymail-container-element-horizontal'
                      : 'yaymail-container-element-vertical'
                  }`}
                  parentList={mainList}
                  parentId={element.id}
                  columnIndex={0}
                  style={hasChildren ? { border: 'none' } : containerChildrenStyles}
                >
                  {children}
                </SortableContainer>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </ElementWrapper>
  );
};

const Container = withMemo(ContainerContent);

export default Container;
