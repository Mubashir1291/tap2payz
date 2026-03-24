import { endPoints } from './endPoints';
import { Fetch } from './config';



export const OPEN_REGISTER = async (payload) => {
  const response = await Fetch.post(`${endPoints.OPENREGISTER}`, payload);
  return response;
};

export const CLOSE_REGISTER = async (payload) => {
  const response = await Fetch.post(`${endPoints.CLOSEREGISTER}`, payload);
  return response;
};

export const VERIFY_DEVICE = async (payload) => {
  const response = await Fetch.put(`${endPoints.VERIFYDEVICE}`, payload);
  return response;
};

export { endPoints, Fetch };
