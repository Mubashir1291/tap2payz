import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: false,
  isRegisterOpen: false,
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
    },
    setIsRegisterOpen: (state, action) => {
      state.isRegisterOpen = action.payload;
    },
    logout: state => {
      state.isLogin = false;
      state.accessToken = null;
    },


  },
});

export const { setIsLogin, logout, setAccessToken, setUserData, setIsRegisterOpen } = userReducer.actions;

export default userReducer.reducer;
export const selectLanguage = state => state.user.appLanguage;
