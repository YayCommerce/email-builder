/* eslint-disable no-restricted-imports */
import { getPlatform } from '@src/common/platform';

import restApi from './api';

type AddonFilter = {
  category?: string;
  status?: string;
  search?: string;
};

export async function getAddons(filter?: AddonFilter | null) {
  const platform = getPlatform();
  const addons = await restApi.get('/addons', {
    params: filter
      ? {
          category: filter.category,
          status: filter.status,
          search: filter.search,
          platform: platform,
        }
      : {
          platform: platform,
        },
  });
  return addons;
}

export async function activateAddon(addon: string) {
  const response = await restApi.post('/addons/activate', {
    addon,
  });
  return response;
}

export async function deactivateAddon(addon: string) {
  const response = await restApi.post('/addons/deactivate', {
    addon,
  });
  return response;
}
