import { Fetch } from './config';
import ENDPOINTS from './endPoints';
import URLS from './urls';

const BASE_PRODUCT_PREFIX = `${URLS.EMPLOYEE_SERVICE}`;
const BASE_CATEGORY_PREFIX = `${URLS.STORE_SERVICE}/category`;
const BASE_INVENTORY_PREFIX = `${URLS.STORE_SERVICE}`;

export const GET_ALL_PRODUCTS_WITH_INVENTORY = ({
  page = 1,
  itemsPerPage = 20,
  searchText = '',
  getAll = 'false',
  limited = 'false',
  storeId = '',
  category_id = '',
}) => {
  const response = Fetch.get(
    `${BASE_PRODUCT_PREFIX}${ENDPOINTS.PRODUCTS.GET_ALL_PRODUCTS_WITH_INVENTORY}?page=${page}&itemsPerPage=${itemsPerPage}&searchText=${searchText}&getAll=${getAll}&limited=${limited}&storeId=${storeId}&status=Active&category_id=${category_id}`,
  );
  return response;
};

export const GET_ALL_CATEGORIES = ({
  page = 1,
  itemsPerPage = 10,
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

export const CREATE_PRODUCT = data => {
  const response = Fetch.post(`${BASE_INVENTORY_PREFIX}${ENDPOINTS.PRODUCTS.CREATE_PRODUCT}`, data);
  return response;
};
