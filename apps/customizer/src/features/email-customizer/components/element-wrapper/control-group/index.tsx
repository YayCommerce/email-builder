/* eslint-disable no-restricted-imports */
import { CaretDownOutlined, CaretUpOutlined, DragOutlined } from '@ant-design/icons';

import { moveDown, moveUp } from '@src/features/email-customizer/components/element-wrapper/utils';

import useTemplateContentStore from '@src/stores/templateContent';

import './index.scss';
import { useMemo } from 'react';

const ControlGroup = ({ reference }: { reference: string }) => {
  const { isFirst, isLast, handleMoveElementUp, handleMoveElementDown } = useControls(reference);

  return (
    <div
      className="yaymail-chosen-element__control-bar"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="control-group">
        <span className={isFirst ? 'disabled' : ''}>
          <CaretUpOutlined onClick={handleMoveElementUp} />
        </span>
        {reference === 'element' && (
          <span className="yaymail-chosen-element__handle-drag">
            <DragOutlined />
          </span>
        )}
        <span className={isLast ? 'disabled' : ''}>
          <CaretDownOutlined onClick={handleMoveElementDown} />
        </span>
      </div>
    </div>
  );
};

export default ControlGroup;

const useControls = (reference: string) => {
  const elementId = useTemplateContentStore((state) => state.chosenElement?.id);
  const swapWithNextElement = useTemplateContentStore((state) => state.swapWithNextElement);
  const swapWithPreviousElement = useTemplateContentStore((state) => state.swapWithPreviousElement);
  const swapGroupWithPreviousElement = useTemplateContentStore(
    (state) => state.swapGroupWithPreviousElement,
  );
  const swapGroupWithNextElement = useTemplateContentStore(
    (state) => state.swapGroupWithNextElement,
  );
  const list = useTemplateContentStore((state) => state.list);
  const multiSelectedList = useTemplateContentStore((state) => state.multiSelectedList);

  const isFirst =
    reference === 'element'
      ? useMemo(() => {
          if (!elementId) return false;
          return list[0].id === elementId;
        }, [elementId, list, multiSelectedList])
      : useMemo(() => {
          if (multiSelectedList.length < 1) return false;
          return list[0].id === multiSelectedList[0].id;
        }, [multiSelectedList, list]);

  const isLast =
    reference === 'element'
      ? useMemo(() => {
          if (!elementId) return false;
          return list[list.length - 1].id === elementId;
        }, [elementId, list, multiSelectedList])
      : useMemo(() => {
          if (multiSelectedList.length < 1) return false;
          return list[list.length - 1].id === multiSelectedList[multiSelectedList.length - 1].id;
        }, [multiSelectedList, list]);

  const handleMoveElementUp = () => {
    moveUp(reference).then(() => {
      if (reference === 'element') {
        swapWithPreviousElement(elementId ?? '');
      } else {
        swapGroupWithPreviousElement(multiSelectedList);
      }
    });
  };

  const handleMoveElementDown = () => {
    moveDown(reference).then(() => {
      if (reference === 'element') {
        swapWithNextElement(elementId ?? '');
      } else {
        swapGroupWithNextElement(multiSelectedList);
      }
    });
  };

  return {
    isFirst,
    isLast,
    handleMoveElementUp,
    handleMoveElementDown,
  };
};
