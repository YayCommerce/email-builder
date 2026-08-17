import { useCallback, useEffect } from 'react';

/**
 * Note: ignored elements only work when boundaryElementSelectors is undefined
 * Options for configuring the behavior of the outside click handler.
 */
export interface OutsideClickOptions {
  /**
   * An array of CSS selectors for elements that define the boundaries
   * within which clicks are considered inside. If a click occurs on an element
   * matching one of these selectors, it's considered inside.
   */
  boundaryElementSelectors?: string[];

  /**
   * An array of CSS selectors for elements to be ignored by the outside click handler.
   * If a click occurs on an element matching one of these selectors, it's ignored.
   */
  ignoredElementsCssSelectors?: string[];

  /**
   * An array of classnames for elements to be ignored by the outside click handler.
   * If a click occurs on an element with one of these classnames, it's ignored.
   */
  ignoredClassnames?: string[];
}
// TODO This hook needs to be tested on different browsers and devices
/**
 * Custom hook for handling outside click events.
 * @param callback A function to be called when an outside click is detected.
 * @param isActive A boolean indicating whether the outside click handler is active.
 * @param selector Options for configuring the behavior of the outside click handler.
 * @param additionalEventListenerSelectors Additional CSS selectors for elements to directly add click event listeners to.
 */
export const useOutsideClick = (
  callback: () => void,
  isActive: boolean = true,
  selector?: OutsideClickOptions,
  additionalEventListenerSelectors?: string,
) => {
  const { boundaryElementSelectors, ignoredElementsCssSelectors, ignoredClassnames } =
    selector || {};

  const isIgnoredByClassname = useCallback(
    (element: HTMLElement) => {
      return (
        ignoredClassnames &&
        ignoredClassnames.some((className) => element.classList.contains(className))
      );
    },
    [ignoredClassnames],
  );

  const isIgnoredBySelector = useCallback(
    (element: HTMLElement) => {
      return (
        ignoredElementsCssSelectors &&
        ignoredElementsCssSelectors.some((selector) => element.closest(selector))
      );
    },
    [ignoredElementsCssSelectors],
  );

  const isInsideBoundaryElements = useCallback(
    (element: HTMLElement) => {
      return (
        boundaryElementSelectors &&
        boundaryElementSelectors.some((selector) => element.matches(selector))
      );
    },
    [boundaryElementSelectors],
  );

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (!isActive) return;

      const target = event.target as HTMLElement;

      const isBoundaryElement = isInsideBoundaryElements(target);

      const isIgnoredElement = isBoundaryElement
        ? false
        : isIgnoredByClassname(target) || isIgnoredBySelector(target);

      if (isBoundaryElement || (!boundaryElementSelectors && !isIgnoredElement)) {
        callback();
      }
    },
    [
      isActive,
      isInsideBoundaryElements,
      isIgnoredByClassname,
      isIgnoredBySelector,
      boundaryElementSelectors,
      callback,
    ],
  );

  useEffect(() => {
    if (isActive) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    // In case there is any element doesn't work with the onClick event, directly add the click event to them
    const elements = additionalEventListenerSelectors
      ? document.querySelectorAll(additionalEventListenerSelectors)
      : '';
    if (elements) {
      elements.forEach(function (element) {
        element.addEventListener('click', (e) => handleClickOutside(e as any));
      });
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);

      if (elements) {
        elements.forEach(function (element) {
          element.removeEventListener('click', (e) => handleClickOutside(e as any));
        });
      }
    };
  }, [handleClickOutside]);
};
