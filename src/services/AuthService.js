import { Fetch } from './config';
import ENDPOINTS from './endPoints';

export const LOGIN_ACCOUNT = payload => {
  const response = Fetch.post(`/auth${ENDPOINTS.AUTH.LOGIN}`, payload);
  return response;
};

export const ME = () => {
  const response = Fetch.get(`/auth${ENDPOINTS.AUTH.ME}`);
  return response;
};
