import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: false,
  accessToken: null,
  userData: null,
  store_id: null,
};

export const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
      state.store_id = action.payload?.store_id;
    },
    logout: state => {
      state.isLogin = false;
      state.accessToken = null;
      state.store_id = null;
    },
  },
});

export const { setIsLogin, logout, setAccessToken, setUserData } = userReducer.actions;

export default userReducer.reducer;
export const selectLanguage = state => state.user.appLanguage;
