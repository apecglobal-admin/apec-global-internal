import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserInfo,
  fetchUserKPI,
  getListEmployeeDepartment,
  getTotalKpiSkill,
  listAchievements,
  listCard,
  listDepartments,
  listLink,
  listPositions,
  listProjects,
  listTypePersonal,
  getListStatusPersonal,
  listTypeTask,
  loginWeb,
  personalRequest,
  personCareer,
  personTasks,
  uploadAvatar,
  personalRequestAssign,
  personalRequestHonor
} from "../../services/api";
import { createAsyncReducer, createAsyncReducerDynamic } from "@/src/utils/createAsyncReducer";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface UserState {
  token: string | null;
  userInfo: InitState<any | null>;
  departments: InitState<any[]>;
  positions: InitState<any[]>;
  careers: InitState<any[]>;
  tasks: InitState<any[]>;
  typeTask: InitState<any[]>;
  personals: InitState<any[]>;
  typePersonal: InitState<any[]>;
  achievements: InitState<any[]>;
  projects: InitState<any | null>;
  cards: InitState<any[]>;
  links: InitState<any[]>;
  userKpi: InitState<any | null>;
  listEmployeeDepartment: InitState<any[]>;
  totalKpiSkill: InitState<any[]>;
  listPersonalRequestAssign: InitState<any[]>;
  detailPersonalRequestAssign: InitState<any[]>;
  listStatusPersonal: InitState<any[]>;
}

const initialState: UserState = {
  token: null,
  userInfo: { data: null, loading: false, error: null, status: null },
  userKpi: { data: null, loading: false, error: null, status: null },
  departments: { data: [], loading: false, error: null, status: null },
  positions: { data: [], loading: false, error: null, status: null },
  careers: { data: [], loading: false, error: null, status: null },
  tasks: { data: [], loading: false, error: null, status: null },
  typeTask: { data: [], loading: false, error: null, status: null },
  personals: { data: [], loading: false, error: null, status: null },
  typePersonal: { data: [], loading: false, error: null, status: null },
  achievements: { data: [], loading: false, error: null, status: null },
  projects: { data: null, loading: false, error: null, status: null },
  cards: { data: [], loading: false, error: null, status: null },
  links: { data: [], loading: false, error: null, status: null },
  listEmployeeDepartment: { data: [], loading: false, error: null, status: null },
  totalKpiSkill: { data: [], loading: false, error: null, status: null },
  listPersonalRequestAssign: { data: [], loading: false, error: null, status: null },
  detailPersonalRequestAssign: { data: [], loading: false, error: null, status: null },
  listStatusPersonal: { data: [], loading: false, error: null, status: null },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: (state) => {
      // Clear localStorage khi logout
      if (typeof window !== "undefined") {
        localStorage.removeItem("userToken");
      }
      return initialState;
    },
    loadTokenFromStorage: (state) => {
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("userToken");
        if (token) {
          state.token = token;
        }
      }
    },
    // Reducer để set token (khi login)
    setToken: (state, action) => {
      state.token = action.payload;
      // Đồng bộ với localStorage
      if (typeof window !== "undefined") {
        
        localStorage.setItem("userToken", action.payload);
      }
    },
  },
  extraReducers: (builder) => {
    // API call chỉ quan tâm status/loading, không cần lưu payload
    createAsyncReducer(builder, loginWeb);
    createAsyncReducer(builder, uploadAvatar);
    createAsyncReducer(builder, personalRequestHonor);


    // API call cần lưu dữ liệu
    createAsyncReducer(builder, fetchUserInfo, "userInfo");
    createAsyncReducer(builder, fetchUserKPI, "userKpi");
    createAsyncReducer(builder, listPositions, "positions");
    createAsyncReducer(builder, listDepartments, "departments");
    createAsyncReducer(builder, personCareer, "careers");
    createAsyncReducer(builder, personTasks, "tasks");
    createAsyncReducer(builder, listTypeTask, "typeTask");
    createAsyncReducer(builder, personalRequest, "personals");
    createAsyncReducer(builder, listTypePersonal, "typePersonal");
    createAsyncReducer(builder, getListStatusPersonal, "listStatusPersonal");

    
    createAsyncReducer(builder, listAchievements, "achievements");
    createAsyncReducer(builder, listProjects, "projects");
    createAsyncReducer(builder, listCard, "cards");
    createAsyncReducer(builder, listLink, "links");
    createAsyncReducer(builder, getListEmployeeDepartment, "listEmployeeDepartment");
    createAsyncReducer(builder, getTotalKpiSkill, "totalKpiSkill");
    createAsyncReducerDynamic(builder, personalRequestAssign);
  },
});

export const { logout, loadTokenFromStorage, setToken } = userSlice.actions;
export default userSlice.reducer;
