import { Fetch } from './config';
import ENDPOINTS from './endPoints';
import URLS from './urls';

const BASE_PREFIX = `${URLS.EMPLOYEE_SERVICE}`;

export const GET_ALL_TRANSACTION = ({
  page = 1,
  itemsPerPage = 10,
  searchText = '',
  storeId = '',
  deviceId = '',
  transType = '',
}) => {
  const response = Fetch.post(
    `${BASE_PREFIX}${ENDPOINTS.Sales$Analytics.GET_Z_REPORT}?page=${page}&itemsPerPage=${itemsPerPage}&searchText=${searchText}&storeId=${storeId}&deviceId=${deviceId}&transType=${transType}`,
  );
  return response;
};
