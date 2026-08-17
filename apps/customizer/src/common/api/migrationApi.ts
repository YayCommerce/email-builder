import { MigrationOnloadData, ResponseType } from '@src/common/api/types';

import restApi from './api';

const MigrationApi = {
  getOnloadData: async () => {
    const response = await restApi.get<ResponseType<MigrationOnloadData>>(
      `/migrations/get-onload-data`,
    );
    return response;
  },
  migrate: async () => {
    const response = await restApi.post<
      ResponseType<Pick<MigrationOnloadData, 'is_critical_migration_required'>>
    >(`/migrations/migrate`);
    return response;
  },
  reset: async (backupName: string) => {
    const response = await restApi.post<
      ResponseType<Pick<MigrationOnloadData, 'is_critical_migration_required'>>
    >(`/migrations/reset/${backupName}`);
    return response;
  },
};

export default MigrationApi;
