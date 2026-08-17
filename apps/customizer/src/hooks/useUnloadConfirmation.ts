/* eslint-disable no-unused-vars */
import { unstable_usePrompt as usePrompt, useBeforeUnload } from 'react-router-dom';

import useTemplateContentStore from '@src/stores/templateContent';
import { __ } from '@wordpress/i18n';

const useUnloadConfirmation = () => {
  const hasChanged = useTemplateContentStore((state) => state.hasChanged);

  const confirmationMessage = __(
    'You have unsaved changes. Are you sure you want to leave?',
    'yaymail',
  );

  const handleBeforeUnload = (e: BeforeUnloadEvent) => {
    if (hasChanged) {
      e.returnValue = confirmationMessage;
      return confirmationMessage;
    }
  };

  usePrompt({
    message: confirmationMessage,
    when: hasChanged,
  });

  useBeforeUnload(handleBeforeUnload);

  // TODO handle the case when user changes the url manually
};
export default useUnloadConfirmation;
