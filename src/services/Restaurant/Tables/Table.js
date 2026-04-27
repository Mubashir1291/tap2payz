import { Fetch } from '../../config';
import ENDPOINTS from '../../endPoints';
import URLS from '../../urls';

const BASE_PREFIX = `${URLS.RESTAURANT_SERVICE}/tables`;

export const GET_TABLES = ({
  page = 1,
  itemsPerPage = 10,
  floor_id = '',
  isAvailable = '',
  store_id = '',
} = {}) => {
  const response = Fetch.get(
    `${BASE_PREFIX}${ENDPOINTS.TABLES.GET_TABLES}?page=${page}&itemsPerPage=${itemsPerPage}&floor_id=${floor_id}&isAvailable=${isAvailable}&store_id=${store_id}`,
  );
  return response;
};

export const CREATE_TABLE = data => {
  const response = Fetch.post(`${BASE_PREFIX}${ENDPOINTS.TABLES.CREATE_TABLE}`, data);
  return response;
};

export const UPDATE_TABLE = (id, payload) => {
  const response = Fetch.put(`${BASE_PREFIX}${ENDPOINTS.TABLES.UPDATE_TABLE}/${id}`, payload);
  return response;
};
export const DELETE_TABLE = id => {
  const response = Fetch.delete(`${BASE_PREFIX}${ENDPOINTS.TABLES.DELETE_TABLE}/${id}`);
  return response;
};
