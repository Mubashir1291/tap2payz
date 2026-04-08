import { Fetch } from './config';
import ENDPOINTS from './endPoints';
import URLS from './urls';

const BASE_PREFIX = `${URLS.EMPLOYEE_SERVICE}/store`;

export const SEND_DETAILS_EMAIL = ({ payload }) => {
  return Fetch.post(`${BASE_PREFIX}${ENDPOINTS.Communication.SEND_DETAILS_EMAIL}`, payload);
};
