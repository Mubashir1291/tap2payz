import { CHECK_STORE_DISCOUNT, VERIFY_DISCOUNT_CODE } from './DiscountReceipts';

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
    GET_ALL_CASH_REGISTER: '/get-all-cash-registers',
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
  Floors: {
    GET_FLOORS: '/get-floors',
    CREATE_FLOOR: '/create-floor',
    UPDATE_FLOOR: '/update-floor',
  },
  Order: {
    GET_ORDERS: '/get-orders',
    GET_ORDER_DETAIL: '/get-order-details',
    GET_ACTIVE_ORDERS: '/get-active-order',
    CREATE_ORDER: '/create-order',
    UPDATE_ORDER: '/update-order-status',
    CHANGE_ORDER_STATUS: '/change-order-status',
  },

  Sales$Transaction: {
    CHECK_TERMINAL_STATUS: '/get-terminal-status',
    CREATE_TRANSACTION: '/create-transaction',
  },
  BankDetails: {
    GET_BANK_DETAILS: '/get-bank-details',
    CREATE_BANK_DETAILS: '/create-bank-details',
    UPDATE_BANK_DETAILS: '/update-bank-details',
  },
  Terminals: {
    GET_STORE_TERMINAL: '/get-store-terminals',
    CREATE_STORE_TERMINAL: '/create-store-terminal',
    TOGGLE_STORE_TERMINAL: '/toggle-store-terminal',
  },
  Devices: {
    GET_DEVICES: '/get-devices',
    CREATE_DEVICE: '/create-device',
    UPDATE_DEVICE: '/update-device',
    DELETE_DEVICE: '/delete-device',
  },
  Communication: {
    SEND_DETAILS_EMAIL: '/send-details-email',
  },
  Sales$Analytics: {
    GET_WEEKLY_SALES: '/get-weekly-sales',
    GET_WEEKLY_TIPS: '/get-weekly-tips',
    GET_ALL_SALES_BY_TYPE: '/get-all-sales-by-type',
    GET_X_REPORT: '/get-x-report',
    GET_Z_REPORT: '/get-z-report',
    GENERATE_X_REPORT: '/generate-x-report',
    GENERATE_Z_REPORT: '/generate-z-report',
  },
  Discount: {
    VERIFY_DISCOUNT_CODE: '/verify-discount-code',
    CHECK_STORE_DISCOUNT: '/check-store-discount',
  },
};

export default ENDPOINTS;
