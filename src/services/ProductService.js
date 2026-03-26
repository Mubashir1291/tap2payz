import { Fetch } from './config';
import ENDPOINTS from './endPoints';

// const BASE_PRODUCT_PREFIX = '/store-inventory/product';
const BASE_PRODUCT_PREFIX = ':6003/api/store-inventory/product';
// const BASE_CATEGORY_PREFIX = '/store-inventory/category';
const BASE_CATEGORY_PREFIX = ':6003/api/store-inventory/category';

export const GET_ALL_PRODUCTS = payload => {
  const response = Fetch.get(
    `${BASE_PRODUCT_PREFIX}${ENDPOINTS.PRODUCTS.GET_ALL_PRODUCTS}`,
    payload,
  );
  return response;
};

export const GET_ALL_CATEGORIES = ({
  page = 1,
  itemsPerPage = 25,
  searchText = '',
  getAll = 'false',
  limited = 'false',
  storeId = '',
}) => {
  const response = Fetch.get(
    `${BASE_CATEGORY_PREFIX}${ENDPOINTS.PRODUCTS.GET_ALL_CATEGORIES}?page=${page}&itemsPerPage=${itemsPerPage}&searchText=${searchText}&getAll=${getAll}&limited=${limited}&storeId=${storeId}&status=Active`,
  );
  return response;
};
