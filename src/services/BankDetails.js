import { Fetch } from './config';
import ENDPOINTS from './endPoints';
import URLS from './urls';

const BASE_PREFIX = `${URLS.EMPLOYEE_SERVICE}/store`;
// Bank Details
export const GET_BANK_DETAILS = ({ business_id = '', store_id = '' }) => {
  {
  }
  return Fetch.get(
    `${BASE_PREFIX}${ENDPOINTS.BankDetails.GET_BANK_DETAILS}?business_id=${business_id}&store_id=${store_id}`,
  );
};

export const CREATE_BANK_DETAILS = ({ payload }) => {
  return Fetch.post(`${BASE_PREFIX}${ENDPOINTS.BankDetails.CREATE_BANK_DETAILS}`, payload);
};
export const UPDATE_BANK_DETAILS = ({ id, payload }) => {
  return Fetch.patch(`${BASE_PREFIX}${ENDPOINTS.BankDetails.UPDATE_BANK_DETAILS}/${id}`, payload);
};
