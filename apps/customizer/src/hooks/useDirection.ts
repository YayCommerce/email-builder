import useCustomizerSettingsStore from '@src/stores/customizerSettings';
import { useMemo } from 'react';

export function useDirection() {
  const settings = useCustomizerSettingsStore((state) => state.settings);
  const direction = useMemo(() => {
    return settings?.direction ?? 'ltr';
  }, [settings]);
  return direction;
}
