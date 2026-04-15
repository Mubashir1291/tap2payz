import ENDPOINTS from './endPoints';
import { Fetch } from './config';
import URLS from './urls';
import { useEffect } from 'react';

const BASE_PREFIX = `${URLS.EMPLOYEE_SERVICE}`;

export const OPEN_REGISTER = async payload => {
  const response = await Fetch.post(
    `${BASE_PREFIX}${ENDPOINTS.CASH_REGISTER.OPEN_REGISTER}`,
    payload,
  );
  return response;
};

export const GET_CASH_REGISTER = async ({ device_id, employee_id, store_id }) => {
  const response = await Fetch.get(
    `${BASE_PREFIX}${ENDPOINTS.CASH_REGISTER.GET_CASH_REGISTER}?device_id=${device_id}&employee_id=${employee_id}&store_id=${store_id}`,
  );
  return response;
};

export const CLOSE_REGISTER = async payload => {
  const response = await Fetch.post(
    `${BASE_PREFIX}${ENDPOINTS.CASH_REGISTER.CLOSE_REGISTER}`,
    payload,
  );
  return response;
};
export const GET_ALL_CASH_REGISTER = async ({ device_id, employee_id, store_id }) => {
  const response = await Fetch.get(
    `${BASE_PREFIX}${ENDPOINTS.CASH_REGISTER.GET_ALL_CASH_REGISTER}?device_id=${device_id}&employee_id=${employee_id}&store_id=${store_id}`,
  );
  return response;
};

export const VERIFY_DEVICE = async payload => {
  const response = await Fetch.put(`${BASE_PREFIX}${ENDPOINTS.DEVICE.VERIFY_DEVICE}`, payload);
  return response;
};

export const VERIFY_STORE_PASSKEY = async (id, payload) => {
  const response = await Fetch.post(
    `${BASE_PREFIX}/auth${ENDPOINTS.AUTH.VERIFY_STORE_PASSKEY}/${id}`,
    payload,
  );
  return response;
};
