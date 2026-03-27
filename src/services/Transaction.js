import { Fetch } from './config';
import ENDPOINTS from './endPoints';
import URLS from './urls';

const BASE_PREFIX = `${URLS.EMPLOYEE_SERVICE}`;

export const Create_Transaction = payload => {
  const response = Fetch.post(`${BASE_PREFIX}${ENDPOINTS.TRANSACTION.CREATE_TRANSACTION}`, payload);
  return response;
};
