import { Fetch } from '../../config';
import ENDPOINTS from '../../endPoints';
import URLS from '../../urls';

const BASE_PREFIX = `${URLS.RESTAURANT_SERVICE}/orders`;

export const GET_ORDERS = ({
  page = 1,
  itemsPerPage = 10,
  store_id = '',
  status = '',
  type = '',
  sort = '',
} = {}) => {
  const response = Fetch.get(
    `${BASE_PREFIX}${ENDPOINTS.Order.GET_ORDERS}?page=${page}&itemsPerPage=${itemsPerPage}&store_id=${store_id} &status=${status}&type=${type}&sort=${sort}`,
  );
  return response;
};
export const CREATE_RES_ORDER = payload => {
  const response = Fetch.post(`${BASE_PREFIX}${ENDPOINTS.Order.CREATE_ORDER}`, payload);
  return response;
};

export const GET_RES_ORDER_DETAIL = id => {
  const response = Fetch.get(`${BASE_PREFIX}${ENDPOINTS.Order.GET_ORDER_DETAIL}/${id}`);
  return response;
};
export const GET_RES_ACTIVE_ORDERS = id => {
  const response = Fetch.get(`${BASE_PREFIX}${ENDPOINTS.Order.GET_ACTIVE_ORDERS}/${id}`);
  return response;
};

export const CREATE_TABLE = data => {
  const response = Fetch.post(`${BASE_PREFIX}${ENDPOINTS.Order.CREATE_ORDER}`, data);
  return response;
};

export const UPDATE_TABLE = (id, payload) => {
  const response = Fetch.put(`${BASE_PREFIX}${ENDPOINTS.Order.UPDATE_ORDER}/${id}`, payload);
  return response;
};
export const CHANGE_RES_ORDER_STATUS = (id, payload) => {
  const response = Fetch.put(`${BASE_PREFIX}${ENDPOINTS.Order.CHANGE_ORDER_STATUS}/${id}`, payload);
  return response;
};
