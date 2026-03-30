import { Fetch } from './config';
import ENDPOINTS from './endPoints';
import URLS from './urls';

const BASE_PREFIX = `${URLS.EMPLOYEE_SERVICE}/store`;

export const CREATE_STORE = payload => {
  return Fetch.post(`${BASE_PREFIX}${ENDPOINTS.STORE.CREATE_STORE}`, payload);
};

export const GET_STORE = () => {
  return Fetch.get(`${BASE_PREFIX}${ENDPOINTS.STORE.CREATE_STORE}`);
};

export const GET_ALL_STORES = ({ page = 1, itemsPerPage = 10, searchText = '' }) => {
  const query = new URLSearchParams({
    page,
    itemsPerPage,
    searchText,
  }).toString();

  return Fetch.get(`${BASE_PREFIX}${ENDPOINTS.STORE.GET_ALL_STORES}?${query}`);
};
export const UPDATE_STORE = ({ id, payload }) => {
  //   if (!id) throw new Error('Store id is required');

  return Fetch.patch(`${BASE_PREFIX}${ENDPOINTS.STORE.UPDATE_STORE}/${id}`, payload);
};
export const DELETE_STORE = ({ id }) => {
  //   if (!id) throw new Error('Store id is required');

  return Fetch.delete(`${BASE_PREFIX}${ENDPOINTS.STORE.DELETE_STORE}/${id}`);
};
export const VERIFY_PIN = ({ id, payload }) => {
  //   if (!id) throw new Error('Store id is required');

  return Fetch.post(`${BASE_PREFIX}${ENDPOINTS.STORE.VERIFY_PIN}/${id}`, payload);
};
export const GET_SETUP_PROGRESS = ({ storeId }) => {
  return Fetch.get(`${BASE_PREFIX}${ENDPOINTS.STORE.SETUP_PROGRESS}?storeId=${storeId}`);
};
