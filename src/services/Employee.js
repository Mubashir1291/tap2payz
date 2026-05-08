import { Fetch } from './config';
import ENDPOINTS from './endPoints';
import URLS from './urls';

const BASE_PREFIX = `${URLS.EMPLOYEE_SERVICE}`;

export const GET_EMPLOYEES = ({ page = 1, itemPerPage = 10, searchText, sort, storeid }) => {
  const response = Fetch.get(
    `${BASE_PREFIX}${ENDPOINTS.EMPLOYEE.GET_EMPLOYEES}?page=${page}&itemsPerPage=${itemPerPage}&searchText=${searchText}&sort=${sort}&storeId=${storeid}`,
  );
  return response;
};


export const GET_EMPLOYEE = id => {
  const response = Fetch.get(`${BASE_PREFIX}${ENDPOINTS.EMPLOYEE.GET_EMPLOYEE}/${id}`);
  return response;
};
export const CREATE_EMPLOYEE = data => {
  const response = Fetch.post(`${BASE_PREFIX}${ENDPOINTS.EMPLOYEE.CREATE_EMPLOYEE}`, data);

  return response;
};
export const UPDATE_EMPLOYEE = (id, payload) => {
  const response = Fetch.put(`${BASE_PREFIX}${ENDPOINTS.EMPLOYEE.UPDATE_EMPLOYEE}/${id}`, payload);
  return response;
};
export const DELETE_EMPLOYEE = id => {
  const response = Fetch.delete(`${BASE_PREFIX}${ENDPOINTS.EMPLOYEE.DELETE_EMPLOYEE}/${id}`);
  return response;
};
