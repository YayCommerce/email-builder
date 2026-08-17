import useCustomizerPageStore from '@src/stores/customizerPage';
import { __ } from '@wordpress/i18n';

import { IElement } from '../../../type';
import { ElementBuilder } from '../elements/ElementBuilder';

interface IEmailRecursiveElementsProps {
  list: IElement[];
  parentId?: IElement['id'];
}

const EmailRecursiveElements = ({ list, parentId }: IEmailRecursiveElementsProps) => {
  const allElements = useCustomizerPageStore((state) => state.elements);
  const allElementsType = allElements?.map((e) => e.type);

  return (
    <>
      {list?.map((element, index) => {
        if (allElementsType.includes(element.type)) {
          return (
            <ElementBuilder
              element={element}
              columnIndex={index}
              parentId={parentId}
              key={element.id}
            />
          );
        }
        return null;
      })}
    </>
  );
};

export default EmailRecursiveElements;
