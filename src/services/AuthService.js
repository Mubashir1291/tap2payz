import { Fetch } from './config';
import ENDPOINTS from './endPoints';

// const BASE_PREFIX = '/employee-access/auth';
const BASE_PREFIX = ':6004/api/employee-access/auth';

export const LOGIN_ACCOUNT = payload => {
  const response = Fetch.post(`${BASE_PREFIX}${ENDPOINTS.AUTH.LOGIN}`, payload);
  return response;
};

export const ME = () => {
  const response = Fetch.get(`${BASE_PREFIX}${ENDPOINTS.AUTH.ME}`);
  return response;
};
