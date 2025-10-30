import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";

const store = configureStore({
  reducer: {
    user: userReducer, // Kết nối reducer của user với store
  },
});

export default store;
