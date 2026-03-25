import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  deviceId: null,
  isDeviceRegistered: false,
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
    clearDevice: (state) => {
      state.deviceId = null;
      state.isDeviceRegistered = false;
    },
  },
});

export const { setDeviceId, setIsDeviceRegistered, clearDevice } = deviceReducer.actions;

export default deviceReducer.reducer;
