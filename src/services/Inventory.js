import { Fetch } from './config';
import ENDPOINTS from './endPoints';
import URLS from './urls';

const BASE_PREFIX = `${URLS.EMPLOYEE_SERVICE}/inventory`;

export const GET_ALL_INVENTORY = ({
  page = 1,
  itemsPerPage = 10,
  getAll = 'false',
  searchText = '',
  limited = 'false',
  sort = '',
  storeId = '',
  businessId = '',
}) => {
  const response = Fetch.get(
    `${BASE_PREFIX}${ENDPOINTS.INVENTORY.GET_ALL_INVENTORY}?page=${page}&itemsPerPage=${itemsPerPage}&getAll=${getAll}&searchText=${searchText}&limited=${limited}&sort=${sort}&storeId=${storeId}&businessId=${businessId}&bypass_cache=${bypass_cache}`,
  );
  return response;
};

export const UPDATE_INVENTORY = (id, payload) => {
  const response = Fetch.put(
    `${BASE_PREFIX}${ENDPOINTS.INVENTORY.UPDATE_INVENTORY}/${id}`,
    payload,
  );
  return response;
};
