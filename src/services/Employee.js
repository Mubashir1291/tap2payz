import { Fetch } from './config';
import ENDPOINTS from './endPoints';
import URLS from './urls';

const BASE_PREFIX = `${URLS.EMPLOYEE_SERVICE}`;

export const GET_EMPLOYEES = ({ page = 1, itemPerPage = 10, searchText, sort, storeid }) => {
  const response = Fetch.get(
    `${BASE_PREFIX}${ENDPOINTS.Employee.GET_EMPLOYEES}?page=${page}&itemsPerPage=${itemPerPage}&searchText=${searchText}&sort=${sort}&storeId=${storeid}`,
  );
  return response;
};

export const GET_EMPLOYEE = id => {
  const response = Fetch.get(`${BASE_PREFIX}${ENDPOINTS.Employee.GET_EMPLOYEE}/${id}`);
  return response;
};
export const CREATE_EMPLOYEE = data => {
  const response = Fetch.post(`${BASE_PREFIX}${ENDPOINTS.Employee.CREATE_EMPLOYEE}`, data);

  return response;
};
export const UPDATE_EMPLOYEE = (id, payload) => {
  const response = Fetch.put(`S{BaSE_PREFIX}${ENDPOINTS.Employee.UPDATE_EMPLOYEE}/${id}`, payload);
};
export const DELETE_EMPLOYEE = id => {
  const response = `${BASE_PREFIX}${ENDPOINTS.Employee.DELETE_EMPLOYEE}/${id}`;
  return response;
};
