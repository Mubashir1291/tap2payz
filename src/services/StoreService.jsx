import { endPoints } from './endPoints';
import { Fetch } from './config';

export const OPEN_REGISTER = async payload => {
  const response = await Fetch.post(`${endPoints.OPEN_REGISTER}`, payload);
  return response;
};

export const CLOSE_REGISTER = async payload => {
  const response = await Fetch.post(`${endPoints.CLOSE_REGISTER}`, payload);
  return response;
};

export const VERIFY_DEVICE = async payload => {
  const response = await Fetch.put(`${endPoints.VERIFY_DEVICE}`, payload);
  return response;
};
