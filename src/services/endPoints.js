const ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    ME: '/me',
  },
  CASH_REGISTER: {
    OPEN_REGISTER: '/create-cash-register',
    CLOSE_REGISTER: '/close-cash-register',
    GET_CASH_REGISTER: '/get-cash-register',
  },
  DEVICE: {
    VERIFY_DEVICE: '/verify-device',
  },
  PRODUCTS: {
    GET_ALL_PRODUCTS_WITH_INVENTORY: '/get-all-products-with-inventory',
    GET_ALL_CATEGORIES: '/get-all-categories',
  },
};

export default ENDPOINTS;
