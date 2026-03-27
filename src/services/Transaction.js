import { useEffect } from 'react';
import { Fetch } from './config';
import ENDPOINTS from './endPoints';
import URLS from './urls';

const BASE_PREFIX = `${URLS.EMPLOYEE_SERVICE}`;

export const Create_Transaction = payload => {
  console.log(payload, 'checkpayload');
  const response = Fetch.post(`${BASE_PREFIX}${ENDPOINTS.TRANSACTION.CREATE_TRANSACTION}`, payload);
  return response;
};

export const Get_Inventory_Status = payload => {
  const response = Fetch.post(`${BASE_PREFIX}${ENDPOINTS.TRANSACTION.GET_INVENTORY}`, payload);
  return response;
};
