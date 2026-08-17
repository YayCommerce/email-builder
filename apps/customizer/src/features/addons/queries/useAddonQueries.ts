import { useQuery } from 'react-query';

import { getAddons } from '@src/common/api/addonApi';

function useAddonQueries() {
  const queryResult = useQuery({
    queryKey: ['addons'],
    queryFn: async () => {
      const response = await getAddons();
      if (response.data && response.data.isError) {
        throw new Error(response.data.message ?? 'Unknown error');
      }
      // Non-array bodies (nonce-failure object, WAF/cache page) would crash the
      // addons list which filters this value during render.
      if (!Array.isArray(response.data)) {
        throw new Error(response.data?.message ?? 'Unexpected addons response');
      }
      return response.data;
    },
    retry: false,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  return {
    ...queryResult,
  };
}

export default useAddonQueries;
