import ENDPOINTS from './endPoints';
import { Fetch } from './config';

export const OPEN_REGISTER = async payload => {
  const response = await Fetch.post(`${ENDPOINTS.CASH_REGISTER.OPEN_REGISTER}`, payload);
  return response;
};

export const GET_CASH_REGISTER = async ({ device_id, employee_id, store_id }) => {
  const response = await Fetch.get(
    `${ENDPOINTS.CASH_REGISTER.GET_CASH_REGISTER}?device_id=${device_id}&employee_id=${employee_id}&store_id=${store_id}`,
  );
  return response;
};

export const CLOSE_REGISTER = async payload => {
  const response = await Fetch.post(`${ENDPOINTS.CASH_REGISTER.CLOSE_REGISTER}`, payload);
  return response;
};

export const VERIFY_DEVICE = async payload => {
  const response = await Fetch.put(`${ENDPOINTS.DEVICE.VERIFY_DEVICE}`, payload);
  return response;
};
