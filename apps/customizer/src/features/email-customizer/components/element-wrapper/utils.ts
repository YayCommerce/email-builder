import { IElement } from '@src/features/email-customizer/type';

// namespace JQuery {}
const jQuery = window.jQuery;
const animation = {
  firstMoveSpeed: 300,
  secondMoveSpeed: 100,
};
export const moveUp = (type = 'element') => {
  return new Promise((resolve) => {
    const customizerContentElement = jQuery('.yaymail-customizer-main');
    const chosenElement =
      type === 'element'
        ? jQuery('.yaymail-customizer-main .yaymail-chosen-element')
        : jQuery('.yaymail-customizer-main .yaymail-multi-selected');
    const previousElement = jQuery(chosenElement).first().prev();
    chosenElement.css('z-index', '40');

    const position = previousElement.innerHeight();

    customizerContentElement.animate(
      {
        scrollTop:
          Number(customizerContentElement.scrollTop()) - Number(previousElement.innerHeight()),
      },
      'slow',
    );

    chosenElement.animate(
      {
        bottom: position,
        opacity: 0.7,
      },
      animation.firstMoveSpeed,
      function () {
        const heightElActive = chosenElement.innerHeight();
        previousElement.animate(
          {
            top: heightElActive,
            opacity: 0.7,
          },
          type === 'element' ? animation.secondMoveSpeed : 0,
          function () {
            chosenElement.css({
              bottom: '',
              zIndex: '',
              opacity: '',
            });
            previousElement.css({
              top: '',
              opacity: '',
            });
            resolve(true);
          },
        );
      },
    );
  });
};

export const moveDown = (type = 'element') => {
  return new Promise((resolve) => {
    const customizerContentElement = jQuery('.yaymail-customizer-main');
    const chosenElement =
      type === 'element'
        ? jQuery('.yaymail-customizer-main .yaymail-chosen-element')
        : jQuery('.yaymail-customizer-main .yaymail-multi-selected');
    const nextElement = jQuery(chosenElement).last().next();
    chosenElement.css('z-index', '40');

    const position = nextElement.innerHeight() ?? 0;

    customizerContentElement.animate(
      {
        scrollTop: Number(nextElement.height()) + Number(customizerContentElement.scrollTop()),
      },
      'slow',
    );

    chosenElement.animate(
      {
        top: position,
        opacity: 0.7,
      },
      animation.firstMoveSpeed,
      function () {
        const heightElActive = chosenElement.innerHeight();
        nextElement.animate(
          {
            bottom: heightElActive,
            opacity: 0.7,
          },
          type === 'element' ? animation.secondMoveSpeed : 0,
          function () {
            chosenElement.css({
              top: '',
              zIndex: '',
              opacity: '',
            });
            nextElement.css({
              bottom: '',
              opacity: '',
            });
            resolve(true);
          },
        );
      },
    );
  });
};

export const isElementAvailable = (elements: IElement[], comparingElement: IElement | null) => {
  const getElement = elements.filter((element) => element.type === comparingElement?.type);
  if (getElement && getElement.length > 0) {
    return getElement[0].available;
  }
  return false;
};

export const isElementPasteStyleAvailable = (
  chosenElement: IElement | null,
  copiedStylesElement: IElement | null,
) => {
  if (copiedStylesElement === null || chosenElement === null) return false;
  if (chosenElement.type === copiedStylesElement.type) return true;
  return false;
};
export const setTextAlign = (textAlign: string) => {
  jQuery('.yaymail-customizer-email-template-container table').each((_, element) => {
    const $element = jQuery(element);
    if (!$element.css('text-align')) {
      $element.css('text-align', textAlign);
    }
  });
};

export const clearSelection = () => {
  if (window.getSelection) {
    if (window.getSelection()?.empty) {
      // Chrome
      window.getSelection()?.empty();
    } else if (window.getSelection()?.removeAllRanges) {
      // Firefox
      window.getSelection()?.removeAllRanges();
    }
  }
};

export const isElementInCurrentSelection = (
  elementId: string | number,
  chosenElement: IElement | null,
  multiSelectedList: IElement[],
) => {
  if (multiSelectedList.length > 1) {
    return multiSelectedList.some((el) => el.id === elementId);
  }
  return chosenElement?.id === elementId;
};

export const isConsecutive = (list: IElement[], elements: IElement[]) => {
  if (elements.length < 2) return false;
  return elements.every((element, index) => {
    if (index === 0) return true;
    const previousElement = elements[index - 1];
    const currentElement = element;
    const previousElementPosition = list.findIndex((i) => i.id === previousElement.id);
    const currentElementPosition = list.findIndex((i) => i.id === currentElement.id);
    if (currentElementPosition < 0) {
      return false;
    }
    if (previousElementPosition < 0) {
      return false;
    }
    return currentElementPosition === previousElementPosition + 1;
  });
};