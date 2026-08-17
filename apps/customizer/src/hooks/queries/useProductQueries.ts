import { QueryFunctionContext, useInfiniteQuery, UseQueryOptions } from 'react-query';

import ProductApi from '@src/common/api/productApi';
import { EntityType, PagingListRequestType } from '@src/common/api/types';

const CONFIG: Omit<UseQueryOptions<any, any, any, any>, 'queryKey' | 'queryFn'> = {
  refetchOnWindowFocus: false,
  retry: false,
  keepPreviousData: true,
};

/**
 * Query to get Products/ Categories/ Tags
 */
export const useGetEntitiesInfiniteQuery = (
  payload: PagingListRequestType<{ type: EntityType }>,
) => {
  const restrictedPayload: PagingListRequestType = {
    ...payload,
    page_size: payload.page_size || 20,
  };
  const queryKey = ['featuredProductCriteriaEntities', restrictedPayload];

  return useInfiniteQuery(queryKey, fetchEntities, {
    ...(CONFIG as any),
    getNextPageParam: (lastPage) =>
      lastPage.data.next_page
        ? { ...restrictedPayload, page_num: lastPage.data.next_page }
        : undefined,
  });
};
/**
 * Fetches entities of various types, including products, tags, and categories
 */
const fetchEntities = async (
  queryContext: QueryFunctionContext<(string | PagingListRequestType)[], any>,
) => {
  return await ProductApi.getEntities(queryContext.pageParam ?? queryContext.queryKey[1]);
};
