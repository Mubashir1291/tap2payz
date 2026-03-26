import { Fetch } from './config';
import ENDPOINTS from './endPoints';

export const GET_ALL_PRODUCTS = payload => {
  const response = Fetch.get(`/auth${ENDPOINTS.PRODUCTS.GET_ALL_PRODUCTS}`, payload);
  return response;
};

export const GET_ALL_CATEGORIES = payload => {
  const response = Fetch.get(`/auth${ENDPOINTS.PRODUCTS.GET_ALL_CATEGORIES}`, payload);
  return response;
};
