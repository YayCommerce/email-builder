import { EntityPage, EntityType, PagingListRequestType, ResponseType } from '@src/common/api/types';

import restApi from './api';

const ProductApi = {
  getEntities: async (payload: PagingListRequestType<{ type: EntityType }>) => {
    const { type, ...params } = payload;
    const path = type === 'products' ? '/product' : `/product/${type}`;
    const response = await restApi.get<ResponseType<EntityPage>>(path, {
      params,
    });
    return response;
  },

  getProductAttributes: async (payload: PagingListRequestType) => {
    const response = await restApi.get<ResponseType<EntityPage>>('/product/attributes', {
      params: payload,
    });
    return response;
  },
};

export default ProductApi;
