import { Fetch } from './config';
import ENDPOINTS from './endPoints';
import URLS from './urls';

const BASE_PREFIX = `${URLS.STORE_SERVICE}/store`;

export const GET_DEVICES = ({ business_id = '', store_id = '' }) => {
  return Fetch.get(
    `${BASE_PREFIX}${ENDPOINTS.Devices.GET_DEVICES}?business_id=${business_id}&store_id=${store_id}`,
  );
};

export const CREATE_DEVICE = ({ payload }) => {
  return Fetch.post(`${BASE_PREFIX}${ENDPOINTS.Devices.CREATE_DEVICE}`, payload);
};

export const UPDATE_DEVICE = ({ id, payload }) => {
  return Fetch.patch(`${BASE_PREFIX}${ENDPOINTS.Devices.UPDATE_DEVICE}/${id}`, payload);
};

export const DELETE_DEVICE = id => {
  return Fetch.delete(`${BASE_PREFIX}${ENDPOINTS.Devices.DELETE_DEVICE}/${id}`);
};
