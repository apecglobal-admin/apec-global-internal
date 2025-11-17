import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import announcementReducer from "../features/announcement/announcementSlice";
import eventReducer from "../features/event/eventSlice";
import policyReducer from "../features/policy/policySlice";
import projectReducer from "../features/project/projectSlice";


const store = configureStore({
  reducer: {
    user: userReducer, // Kết nối reducer của user với store
    announcement: announcementReducer,
    event: eventReducer,
    policy: policyReducer,
    project: projectReducer
  },
});

export default store;
