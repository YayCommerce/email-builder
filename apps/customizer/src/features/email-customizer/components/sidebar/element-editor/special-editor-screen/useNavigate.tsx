import useNavigationWithConfirmation from '@src/hooks/useNavigationWithConfirmation';

import { getGlobalHeaderFooterKey } from '@src/common/platform';

export default function useGlobalHeaderFooterNavigation() {
  const navigateWithConfirmation = useNavigationWithConfirmation();
  const goToGlobalHeaderFooterCustomizer = () => {
    navigateWithConfirmation(`/customizer/?template=${getGlobalHeaderFooterKey()}`);
  };

  return goToGlobalHeaderFooterCustomizer;
}
