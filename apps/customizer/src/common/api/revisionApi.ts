import { ResponseType, RevisionListType } from '@src/common/api/types';

import restApi from './api';

const RevisionApi = {
  getAll: async (templateName: string) => {
    const revisions = await restApi.get<ResponseType<RevisionListType>>(
      `/revisions/query-by-template-name`,
      {
        params: {
          template_name: templateName,
        },
      },
    );
    return revisions;
  },
  delete: async (templateName: string) => {
    const response = await restApi.delete<ResponseType<RevisionListType>>(
      `/revisions/delete-by-template-name`,
      {
        params: {
          template_name: templateName,
        },
      },
    );
    return response;
  },
};

export default RevisionApi;
