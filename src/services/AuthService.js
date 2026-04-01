import { Fetch } from './config';
import ENDPOINTS from './endPoints';
import URLS from './urls';

const BASE_PREFIX = `${URLS.EMPLOYEE_SERVICE}/auth`;

export const LOGIN_ACCOUNT = payload => {
  const response = Fetch.post(`${BASE_PREFIX}${ENDPOINTS.AUTH.LOGIN}`, payload);
  return response;
};

export const ME = () => {
  const response = Fetch.get(`${BASE_PREFIX}${ENDPOINTS.AUTH.ME}`);
  return response;
};
export const LOGOUT = () => {
  const response = Fetch.delete(`${BASE_PREFIX}${ENDPOINTS.AUTH.LOGOUT}`);
  return response;
};
