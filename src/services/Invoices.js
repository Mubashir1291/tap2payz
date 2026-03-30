import { Fetch } from './config';
import ENDPOINTS from './endPoints';
import URLS from './urls';

const BASE_PREFIX = `${URLS.STORE_SERVICE}`;
export const GET_STORE_INVOICES = ({
  page = 1,
  itemsPerPage = 10,
  sort = '',
  status = '',
  store_id = '',
  business_id = '',
}) => {
  const query = `?page=${page}&itemsPerPage=${itemsPerPage}&sort=${sort}&status=${status}&store_id=${store_id}&business_id=${business_id}`;

  return Fetch.get(`${BASE_PREFIX}${ENDPOINTS.INVOICES.GET_STORE_INVOICES}${query}`);
};

export const CHANGE_INVOICE_STATUS = ({ id, payload }) => {
  return Fetch.post(`${BASE_PREFIX}${ENDPOINTS.INVOICES.CHANGE_INVOICE_STATUS}/${id}`, payload);
};

export const GENERATE_INVOICE_PDF = ({ id }) => {
  return Fetch.get(`${BASE_PREFIX}${ENDPOINTS.INVOICES.GENERATE_INVOICE_PDF}/${id}`);
};

export const SEND_INVOICE_PDF_EMAIL = ({ id, payload }) => {
  return Fetch.post(`${BASE_PREFIX}${ENDPOINTS.INVOICES.SEND_INVOICE_PDF_EMAIL}/${id}`, payload);
};
