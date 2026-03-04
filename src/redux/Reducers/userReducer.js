import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLogin: false,
};

export const userReducer = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setIsLogin: (state, action) => {
      state.isLogin = action.payload;
    },
    logout: state => {
      state.isLogin = false;
    },


  },
});

export const { setIsLogin , logout} = userReducer.actions;

export default userReducer.reducer;
export const selectLanguage = state => state.user.appLanguage;
