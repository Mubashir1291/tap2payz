import { Fetch } from './config';
import ENDPOINTS from './endPoints';
import URLS from './urls';

const BASE_PREFIX = `${URLS.STORE_SERVICE}/store`;

// Terminals
export const GET_STORE_TERMINAL = id => {
  return Fetch.get(`${BASE_PREFIX}${ENDPOINTS.Terminals.GET_STORE_TERMINAL}/${id}`);
};

export const CREATE_STORE_TERMINAL = ({ payload }) => {
  return Fetch.post(`${BASE_PREFIX}${ENDPOINTS.Terminals.CREATE_STORE_TERMINAL}`, payload);
};

export const TOGGLE_STORE_TERMINAL = payload => {
  return Fetch.patch(`${BASE_PREFIX}${ENDPOINTS.Terminals.TOGGLE_STORE_TERMINAL}`, payload);
};
