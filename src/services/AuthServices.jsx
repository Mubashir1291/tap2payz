import { Fetch } from './config';
import { endPoints } from './endPoints';


export const LOGIN_ACCOUNT = (payload) => {
  const response = Fetch.post(`/auth${endPoints.LOGIN}`, payload);
  return response;
};

export const ME = () => {
  const response = Fetch.get(`/auth${endPoints.ME}`);
  return response;
};

