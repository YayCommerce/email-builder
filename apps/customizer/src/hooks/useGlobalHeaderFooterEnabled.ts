import { getGlobalHeaderFooterEnabledKey } from '@src/common/platform';
import useCustomizerSettingsStore from '@src/stores/customizerSettings';

export function useGlobalHeaderFooterEnabled() {
  const key = getGlobalHeaderFooterEnabledKey();
  return useCustomizerSettingsStore((state) => state.settings?.[key] ?? false);
}
