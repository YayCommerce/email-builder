import { CSSProperties, useCallback, useEffect, useRef } from 'react';
import { ReactSortable, ReactSortableProps, SortableEvent } from 'react-sortablejs';

import { IChangeInfo } from '@src/stores/templateContentHistory';
import { ComponentChildren } from '@src/types';

import { DISABLED_ELEMENT_CLASS_NAME } from '../../constants';
import { IElement } from '../../type';
import { addElement, findObjectById, replaceObjectById, sortElements } from '../../utils';
import { IElementColumnProps } from '../email-template-container/elements/column';

interface IWrappedComponentProps extends Pick<ReactSortableProps<IElement>, 'onStart' | 'onEnd'> {
  list: IElement[];
  // eslint-disable-next-line no-unused-vars
  setList: (data: IElement[], changeInfo: IChangeInfo) => void;
  parentList?: IElement[] | null;
  clone?: boolean;
  className?: string;
  parentId?: IElementColumnProps['parentId'] | null;
  columnIndex?: IElementColumnProps['columnIndex'] | null;
  children: ComponentChildren;
  sort?: boolean;
  style?: CSSProperties;
  useHandle?: boolean;
}

const SortableContainer = ({
  list,
  setList,
  clone = false,
  parentList = null,
  parentId = null,
  columnIndex = null,
  className = '',
  sort = true,
  children,
  style,
  useHandle = false,
}: IWrappedComponentProps) => {
  const sortableRef = useRef<any>(null);
  const isUpdatingRef = useRef(false);

  // Cleanup function to prevent memory leaks
  useEffect(() => {
    return () => {
      if (sortableRef.current && sortableRef.current.sortable) {
        try {
          sortableRef.current.sortable.destroy();
        } catch (error) {
          console.warn('Error destroying sortable:', error);
        }
      }
    };
  }, []);

  const handleOnAdd = useCallback(
    (e: SortableEvent) => {
      if (isUpdatingRef.current) return;

      try {
        isUpdatingRef.current = true;

        if (
          e.to?.querySelector('.yaymail-customizer-email-global-header-footer-container') != null
        ) {
          e.oldIndex = e.oldIndex ? e.oldIndex - 1 : 0;
          e.newIndex = e.newIndex ? e.newIndex - 1 : 0;
        }
        let result;
        if (parentList != null && parentId != null && columnIndex != null) {
          result = addElement(e, parentList, parentId, columnIndex);
        } else {
          result = addElement(e, list);
        }
        if (result) {
          // Use immediate update to prevent React 18 concurrent rendering conflicts
          setList(result.addedList ?? [], {
            elementName: result.addedElementName ?? '',
            action: 'added',
          });
        }
      } catch (error) {
        console.error('Error in handleOnAdd:', error);
      } finally {
        // Reset the flag after a delay
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 200);
      }
    },
    [list, setList, parentList],
  );

  const handleOnSort = useCallback(
    (e: SortableEvent) => {
      if (isUpdatingRef.current) return;

      try {
        isUpdatingRef.current = true;

        if (
          e.to?.querySelector('.yaymail-customizer-email-global-header-footer-container') != null
        ) {
          e.oldIndex = e.oldIndex ? e.oldIndex - 1 : 0;
          e.newIndex = e.newIndex ? e.newIndex - 1 : 0;
        }
        const selectedElementId = e.item.dataset.yaymailElementId as IElement['id'];
        if (!selectedElementId) {
          console.debug('YayMail: Please provide Element data in data attribute');
          return null;
        }

        const sortedList = sortElements(e, list);
        if (null == sortedList) {
          return;
        }
        const elementName = findObjectById(selectedElementId, sortedList)?.name;

        if (null === parentList) {
          // Use immediate update to prevent React 18 concurrent rendering conflicts
          setList(sortedList, { elementName: elementName, action: 'moved' } as IChangeInfo);
          return;
        }

        const parentId = sortedList[0]?.parentId;

        if (null == parentId) {
          return;
        }

        const cloneParentList = structuredClone<IElement[]>(parentList);

        let currentColumnObject = findObjectById(parentId, cloneParentList);

        if (!currentColumnObject) return;

        currentColumnObject = {
          ...currentColumnObject,
          children: sortedList,
        };

        replaceObjectById(parentId, cloneParentList, currentColumnObject);

        // Use immediate update to prevent React 18 concurrent rendering conflicts
        setList(cloneParentList, { elementName: elementName, action: 'moved' } as IChangeInfo);
      } catch (error) {
        console.error('Error in handleOnSort:', error);
      } finally {
        // Reset the flag after a delay
        setTimeout(() => {
          isUpdatingRef.current = false;
        }, 200);
      }
      const selectedElementId = e.item.dataset.yaymailElementId as IElement['id'];
      if (!selectedElementId) {
        console.debug('YayMail: Please provide Element data in data attribute');
        return null;
      }

      const sortedList = sortElements(e, list);
      if (null == sortedList) {
        return;
      }

      const elementName = findObjectById(selectedElementId, sortedList)?.name;

      if (null === parentList) {
        setList(sortedList, { elementName: elementName, action: 'moved' } as IChangeInfo);
        return;
      }

      const parentId = sortedList[0]?.parentId;

      if (null == parentId) {
        return;
      }

      const cloneParentList = structuredClone<IElement[]>(parentList);

      let currentColumnObject = findObjectById(parentId, cloneParentList);

      if (!currentColumnObject) return;

      currentColumnObject = {
        ...currentColumnObject,
        children: sortedList,
      };

      replaceObjectById(parentId, cloneParentList, currentColumnObject);

      setList(cloneParentList, { elementName: elementName, action: 'moved' } as IChangeInfo);
    },
    [list, setList, parentList],
  );

  return (
    <ReactSortable
      ref={sortableRef}
      group={{ name: 'yaymail', ...(clone ? { pull: 'clone', put: false } : {}) }}
      list={list}
      onAdd={handleOnAdd}
      onSort={handleOnSort}
      setList={() => false}
      filter={`.${DISABLED_ELEMENT_CLASS_NAME},.yaymail-sortable-static`}
      preventOnFilter={true}
      ghostClass="yaymail-sortable-ghost"
      {...(!clone ? { animation: 100, easing: 'ease-in-out' } : {})}
      className={className}
      sort={sort}
      swapThreshold={1}
      invertSwap
      direction="vertical"
      handle={useHandle ? '.yaymail-chosen-element__handle-drag' : undefined}
      style={style}
      onMove={(e) => e.related.className.indexOf('yaymail-sortable-static') === -1}
    >
      {children}
    </ReactSortable>
  );
};

export default SortableContainer;
