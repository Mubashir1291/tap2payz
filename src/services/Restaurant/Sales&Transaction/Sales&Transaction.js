import { Fetch } from '../../config';
import ENDPOINTS from '../../endPoints';
import URLS from '../../urls';

const BASE_PREFIX = `${URLS.RESTAURANT_SERVICE}/sales`;

export const GET_TERMINAL_STATUS = payload => {
  const response = Fetch.post(
    `${BASE_PREFIX}${ENDPOINTS.SALES$TRANSACTION.CHECK_TERMINAL_STATUS}`,
    payload,
  );
  return response;
};

export const CREATE_RES_TRANSACTION = payload => {
  const response = Fetch.post(
    `${BASE_PREFIX}${ENDPOINTS.SALES$TRANSACTION.CREATE_TRANSACTION}`,
    payload,
  );
  return response;
};
