const URLS = {
  LOCAL: {
    EMPLOYEE_SERVICE: 'http://192.168.100.10:6004/api/employee-access',
    STORE_SERVICE: 'http://192.168.100.10:6003/api/store-inventory',
    RESTAURANT_SERVICE: 'http://192.168.100.10:6005/api/restaurant',
  },
  LIVE: {
    EMPLOYEE_SERVICE: 'https://psp-backend.webevis.com/api/employee-access',
    STORE_SERVICE: 'https://psp-backend.webevis.com/api/store-inventory',
    RESTAURANT_SERVICE: 'https://psp-backend.webevis.com/api/restaurant',
  },
};

export default URLS.LIVE;
