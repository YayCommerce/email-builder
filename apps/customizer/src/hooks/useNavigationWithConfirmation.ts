import { useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import useTemplateContentStore from '@src/stores/templateContent';

/**
 * Custom React hook for handling navigation with discard-changes confirmation.
 *
 * @returns {Function} navigateWithConfirmation - A function to navigate to a given path with confirmation.
 * @throws Will throw an error if used outside a React component.
 *
 * @example
 * // In your React component:
 * const handleNavigate = useNavigationWithConfirmation();
 * // Use handleNavigate('/dashboard') in your component where needed.
 */
const useNavigationWithConfirmation = () => {
  const navigate = useNavigate();
  const hasChanged = useTemplateContentStore((state) => state.hasChanged);
  const displayDiscardChangesConfirmModal = useTemplateContentStore(
    (state) => state.displayDiscardChangesConfirmModal,
  );

  const customEventCallback = useRef<CustomEvent['detail']>(() => {});
  /**
   * Navigates to the specified path with discard-changes confirmation.
   *
   * @param {string} path - The path to navigate to.
   */
  const navigateWithConfirmation = useCallback(
    (path: string) => {
      if (hasChanged) {
        displayDiscardChangesConfirmModal(path);
        return;
      }
      if (path) navigate(path);
      customEventCallback.current();
    },
    [hasChanged, displayDiscardChangesConfirmModal, navigate, customEventCallback.current],
  );

  return navigateWithConfirmation;
};

export default useNavigationWithConfirmation;
