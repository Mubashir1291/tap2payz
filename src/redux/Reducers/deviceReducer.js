import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  deviceId: null,
  isDeviceRegistered: false,
  cashRegister: null,
};

export const deviceReducer = createSlice({
  name: 'device',
  initialState,
  reducers: {
    setDeviceId: (state, action) => {
      state.deviceId = action.payload;
    },
    setIsDeviceRegistered: (state, action) => {
      state.isDeviceRegistered = action.payload;
    },
    setCashRegisterData: (state, action) => {
      state.cashRegister = action.payload;
    },
    clearDevice: state => {
      state.deviceId = null;
      state.isDeviceRegistered = false;
    },
  },
});

export const { setDeviceId, setIsDeviceRegistered, clearDevice, setCashRegisterData } =
  deviceReducer.actions;

export default deviceReducer.reducer;
