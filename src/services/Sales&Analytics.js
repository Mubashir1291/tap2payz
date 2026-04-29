import { Fetch } from './config';
import ENDPOINTS from './endPoints';
import URLS from './urls';

const BASE_PREFIX = `${URLS.EMPLOYEE_SERVICE}`;

// export const GET_WEEKLY_SALES = ({ type = 'SALE' }) => {
//   return Fetch.get(`${BASE_PREFIX}${ENDPOINTS.Sales$Analytics.GET_WEEKLY_SALES}?type=${type}`);
// };
// export const GET_WEEKLY_TIPS = ({ type = 'SALE' }) => {
//   return Fetch.get(`${BASE_PREFIX}${ENDPOINTS.Sales$Analytics.GET_WEEKLY_TIPS}?type=${type}`);
// };
// export const GET_ALL_SALES_BY_TYPE = ({
//   page = 1,
//   itemsPerPage = 10,
//   getAll = 'false',
//   limited = 'false',
//   type = 'SALE',
// }) => {
//   return Fetch.get(
//     `${BASE_PREFIX}${ENDPOINTS.Sales$Analytics.GET_ALL_SALES_BY_TYPE}?page=${page}&itemsPerPage=${itemsPerPage}&getAll=${getAll}&limited=${limited}&type=${type}`,
//   );
// };

export const GET_X_REPORT = ({
  fromDate = '',
  fromTime = '',
  toDate = '',
  toTime = '',
  businessId = '',
  transType = '',
  storeId = '',
  page = 1,
  itemsPerPage = 10,
}) => {
  return Fetch.post(
    `${BASE_PREFIX}${ENDPOINTS.SALES$ANALYTICS.GET_X_REPORT}?business_id=${businessId}&store_id=${storeId}&fromDate=${fromDate}&fromTime=${fromTime}&toDate=${toDate}&toTime=${toTime}&transType=${transType}&page=${page}&itemsPerPage=${itemsPerPage}`,
  );
};

// // export const GET_Z_REPORT = ({ business_id = '', store_id = '' }) => {
// //   return Fetch.get(
// //     `${BASE_PREFIX}${ENDPOINTS.Sales$Analytics.GET_Z_REPORT}?business
// // _id=${business_id}&store_id=${store_id}`,
// //   );
// // };

export const GENERATE_X_REPORT = ({ device_id = '', store_id = '', timeFrame = '' }) => {
  return Fetch.get(
    `${BASE_PREFIX}${ENDPOINTS.SALES$ANALYTICS.GENERATE_X_REPORT}?device_id=${device_id}&store_id=${store_id}&timeFrame=${timeFrame}`,
  );
};
// export const GENERATE_Z_REPORT = ({ business_id = '', store_id = '' }) => {
//   return Fetch.post(
//     `${BASE_PREFIX}${ENDPOINTS.Sales$Analytics.GENERATE_Z_REPORT}?business_id=${business_id}&store_id=${store_id}`,
//   );
// };

export const GET_WEEKLY_ANALYTICS = ({  storeId = '',timeFram='',totalSalesFilter='' }) => {
  return Fetch.get(
    `${BASE_PREFIX}${ENDPOINTS.SALES$ANALYTICS.GET_WEEKLY_ANALYTICS}?storeId=${storeId}&timeFram=${timeFram}&totalSalesFilter=${totalSalesFilter}`,
  );
};
