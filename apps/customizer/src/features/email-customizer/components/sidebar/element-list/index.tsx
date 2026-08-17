import { PropsWithChildren, ReactNode, useMemo } from 'react';

import SortableContainer from '@src/features/email-customizer/components/sortable-container';

import classNames from 'classnames';

import { SIDEBAR_ELEMENT_CONTAINER_CLASS_NAME } from '../../../constants';
import { IElementListProps } from '../../../type';
import Element from '../element';

import './index.scss';

const ElementList = (props: PropsWithChildren<IElementListProps>) => {
  const { elements, isDragdropEnabled = true, itemClass, className } = props;

  const children = useMemo((): ReactNode => {
    if (props.children) return props.children;

    return elements
      ? elements.map((element) => {
          return (
            <Element
              className={itemClass}
              element={element}
              key={element.id}
              onClick={element.onClick}
            />
          );
        })
      : '';
  }, [elements]);

  if (isDragdropEnabled) {
    return (
      <SortableContainer
        list={elements}
        className={classNames(SIDEBAR_ELEMENT_CONTAINER_CLASS_NAME, className)}
        setList={() => false}
        clone
        sort={false}
      >
        {children}
      </SortableContainer>
    );
  }

  return <div className={SIDEBAR_ELEMENT_CONTAINER_CLASS_NAME}>{children}</div>;
};

export default ElementList;
