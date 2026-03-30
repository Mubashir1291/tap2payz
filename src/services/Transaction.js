import { Fetch } from './config';
import ENDPOINTS from './endPoints';
import URLS from './urls';

const BASE_PREFIX = `${URLS.EMPLOYEE_SERVICE}`;

export const CREATE_TRANSACTION = payload => {
  const response = Fetch.post(`${BASE_PREFIX}${ENDPOINTS.TRANSACTION.CREATE_TRANSACTION}`, payload);
  return response;
};

export const GET_INVENTORY_STATUS = payload => {
  const response = Fetch.post(
    `${BASE_PREFIX}${ENDPOINTS.TRANSACTION.GET_INVENTORY_STATUS}`,
    payload,
  );
  return response;
};
export const GET_TRANSACTION_DETAIL = ({ id, store_id }) => {
  const response = Fetch.get(
    `${BASE_PREFIX}${ENDPOINTS.TRANSACTION.GET_TRANSACTION_DETAIL}/${id}/${store_id}`,
  );
  return response;
};

export const VERIFY_DEVICE = payload => {
  const response = Fetch.put(`${BASE_PREFIX}${ENDPOINTS.DEVICE.VERIFY_DEVICE}`, payload);
  return response;
};
