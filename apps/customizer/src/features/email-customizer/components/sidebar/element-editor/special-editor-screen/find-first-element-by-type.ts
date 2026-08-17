import { ElementType, IElement } from '@src/features/email-customizer/type';

export const findFirstElementByType = <T extends ElementType>(
  elements: IElement[] | undefined,
  type: T,
): IElement<T> | undefined => {
  if (!elements?.length) {
    return undefined;
  }

  for (const element of elements) {
    if (element.type === type) {
      return element as IElement<T>;
    }

    const childMatch = findFirstElementByType(element.children, type);
    if (childMatch) {
      return childMatch;
    }
  }

  return undefined;
};
