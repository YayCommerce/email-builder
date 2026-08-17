// TODO
// eslint-disable-next-line no-restricted-imports
import { IGeneralSettingData } from '@src/features/email-customizer/components/sidebar/type';

import restApi from './api';

export async function getSettings() {
  const templates = await restApi.get('/settings');
  return templates;
}

export async function updateSettings(data: IGeneralSettingData) {
  const response = await restApi.post('/settings', {
    data: JSON.stringify(data),
  });
  return response.data;
}
