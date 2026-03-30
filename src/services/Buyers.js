import { Fetch } from './config';
import ENDPOINTS from './endPoints';
import URLS from './urls';

const BASE_PREFIX = `${URLS.EMPLOYEE_SERVICE}`;

export const ADD_BUYER = payload => {
  const response = Fetch.post(`${BASE_PREFIX}${ENDPOINTS.BUYERS.ADD_BUYER}`, payload);
  return response;
};
export const GET_BUYER = ({ email }) => {
  const response = Fetch.get(`${BASE_PREFIX}${ENDPOINTS.BUYERS.GET_BUYER}/${email}`);
  return response;
};
