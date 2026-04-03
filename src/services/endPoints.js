const ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    ME: '/me',
    VERIFY_STORE_PASSKEY: '/verify-employee',
    LOGOUT: '/logout',
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
    CREATE_PRODUCT: '/product/create-product',
    UPDATE_PRODUCT: '/product/update-product',
    DELETE_PRODUCT: '/product/delete-product',
  },
  TRANSACTION: {
    CREATE_TRANSACTION: '/create-transaction',
    GET_INVENTORY_STATUS: '/get-inventory-status',
    GET_TRANSACTION_DETAIL: '/transaction-detail',
    VERIFY_DEVICE: '/verify-device',
  },

  DEVICE_RECEIPTS: {
    VERIFY_DISCOUNT_CODE: '/verify-discount-code',
    GET_RECEIPT: '/get-receipt',
    GET_SALE: '/get-sale',
    CHECK_STORE_DISCOUNT: '/check-store-discount',
  },
  BUYERS: {
    ADD_BUYER: '/add-buyer',
    GET_BUYER: '/get-buyer',
  },
  INVOICES: {
    GET_STORE_INVOICES: '/get-store-invoices',
    CHANGE_INVOICE_STATUS: '/change-invoice-status',
    GENERATE_INVOICE_PDF: '/generate-invoice-pdf',
    SEND_INVOICE_PDF_EMAIL: '/send-invoice-pdf-email',
  },
  STORE: {
    CREATE_STORE: '/create-store',
    GET_ALL_STORES: '/get-all-stores-info',
    UPDATE_STORE: '/update-store',
    DELETE_STORE: '/delete-store',
    VERIFY_PIN: '/verify-pin',
    SETUP_PROGRESS: '/setup-progress',
  },
  INVENTORY: {
    GET_ALL_INVENTORY: '/get-all-inventory',
    UPDATE_INVENTORY: '/update-inventory',
  },
  category: {
    CREATE_CATEGORY: '/create-category',
    UPDATE_CATEGORY: '/update-category',
    DELETE_CATEGORY: '/delete-category',
  },
  Employee: {
    GET_EMPLOYEES: '/get-employees',
    GET_EMPLOYEE: '/get-employee',
    CREATE_EMPLOYEE: '/create-employee',
    UPDATE_EMPLOYEE: '/update-employee',
    DELETE_EMPLOYEE: '/delete-employee',
  },
  Tables: {
    GET_TABLES: '/get-tables',
    CREATE_TABLE: '/create-tables',
    UPDATE_TABLE: '/update-table',
    DELETE_TABLE: '/delete-table',
  },
};

export default ENDPOINTS;
