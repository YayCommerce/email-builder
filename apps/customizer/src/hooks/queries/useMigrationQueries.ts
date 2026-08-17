import { useQuery } from 'react-query';

import MigrationApi from '@src/common/api/migrationApi';

function useMigrationQueries() {
  const queryResult = useQuery({
    queryKey: ['migrations'],
    queryFn: async () => {
      const response = await MigrationApi.getOnloadData();
      if (response.data && response.data.isError) {
        throw new Error(response.data.message ?? 'Unknown error');
      }
      const result = response.data;
      return result;
    },
    retry: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return {
    ...queryResult,
  };
}

export default useMigrationQueries;
