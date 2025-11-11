import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import announcementReducer from "../features/announcement/announcementSlice";
import eventReducer from "../features/event/eventSlice";


const store = configureStore({
  reducer: {
    user: userReducer, // Kết nối reducer của user với store
    announcement: announcementReducer,
    event: eventReducer,
  },
});

export default store;
