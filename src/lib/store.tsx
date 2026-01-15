import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/user/userSlice";
import announcementReducer from "../features/announcement/announcementSlice";
import eventReducer from "../features/event/eventSlice";
import policyReducer from "../features/policy/policySlice";
import projectReducer from "../features/project/projectSlice";
import competReducer from "../features/compet/competSlice";
import contactReducer from "../features/contact/contactSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";
import econosystemReducer from "../features/ecosystem/ecosystemSlice";

import tastReducer from "../features/task/taskSlice";

const store = configureStore({
  reducer: {
    user: userReducer, // Kết nối reducer của user với store
    announcement: announcementReducer,
    event: eventReducer,
    policy: policyReducer,
    project: projectReducer,
    compet: competReducer,
    contact: contactReducer,
    dashboard: dashboardReducer,
    econosystem: econosystemReducer,
    task: tastReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;;
export default store;
