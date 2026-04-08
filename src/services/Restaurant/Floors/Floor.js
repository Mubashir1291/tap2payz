import { Fetch } from '../../config';
import ENDPOINTS from '../../endPoints';
import URLS from '../../urls';

const BASE_PREFIX = `${URLS.RESTAURANT_SERVICE}/floor`;

export const GET_FLOORS = ({ page = 1, itemsPerPage = 10, store_id = '' } = {}) => {
  const response = Fetch.get(
    `${BASE_PREFIX}${ENDPOINTS.Floors.GET_FLOORS}?page=${page}&itemsPerPage=${itemsPerPage}&store_id=${store_id}`,
  );
  return response;
};

export const CREATE_FLOORS = data => {
  const response = Fetch.post(`${BASE_PREFIX}${ENDPOINTS.Floors.CREATE_FLOOR}`, data);
  return response;
};

export const UPDATE_FLOORS = (id, payload) => {
  const response = Fetch.put(`${BASE_PREFIX}${ENDPOINTS.Floors.UPDATE_FLOOR}/${id}`, payload);
  return response;
};
