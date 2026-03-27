const URLS = {
  LOCAL: {
    EMPLOYEE_SERVICE: 'http://192.168.100.52:6004/api/employee-access',
    STORE_SERVICE: 'http://192.168.100.52:6003/api/store-inventory',
  },
  LIVE: {
    EMPLOYEE_SERVICE: 'https://psp-backend.webevis.com/api/employee-access',
    STORE_SERVICE: 'https://psp-backend.webevis.com/api/store-inventory',
  },
};

export default URLS.LIVE;
