import { Fetch } from './config';
import ENDPOINTS from './endPoints';
import URLS from './urls';

const BASE_PREFIX = `${URLS.EMPLOYEE_SERVICE}/store`;

export const VERIFY_DISCOUNT_CODE = ({ discountCode }) => {
  return Fetch.get(
    `${BASE_PREFIX}${ENDPOINTS.DEVICE_RECEIPTS.VERIFY_DISCOUNT_CODE}/${discountCode}`,
  );
};

export const GET_RECEIPT = ({ ref }) => {
  return Fetch.get(`${BASE_PREFIX}${ENDPOINTS.DEVICE_RECEIPTS.GET_RECEIPT}/${ref}`);
};

export const GET_SALE = ({ ref }) => {
  return Fetch.get(`${BASE_PREFIX}${ENDPOINTS.DEVICE_RECEIPTS.GET_SALE}/${ref}`);
};

export const CHECK_STORE_DISCOUNT = ({ store_id }) => {
  return Fetch.get(
    `${BASE_PREFIX}${ENDPOINTS.DEVICE_RECEIPTS.CHECK_STORE_DISCOUNT}?store_id=${store_id}`,
  );
};
