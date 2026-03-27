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
