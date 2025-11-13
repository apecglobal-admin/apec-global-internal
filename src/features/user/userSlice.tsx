import { createSlice } from "@reduxjs/toolkit";
import {
  fetchUserInfo,
  listAchievements,
  listCard,
  listDepartments,
  listLink,
  listPositions,
  listProjects,
  listTypePersonal,
  listTypeTask,
  loginWeb,
  personalRequest,
  personCareer,
  personTasks,
  uploadAvatar,
} from "../../services/api";
import { createAsyncReducer } from "@/src/utils/createAsyncReducer";

interface InitState<T> {
  data: T;
  loading: boolean;
  error: string | null;
  status: number | null;
}

interface UserState {
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

}

const initialState: UserState = {
  userInfo: { data: null, loading: false, error: null, status: null },
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
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logout: () => initialState,
  },
  extraReducers: (builder) => {
    // API call chỉ quan tâm status/loading, không cần lưu payload
    createAsyncReducer(builder, loginWeb);
    createAsyncReducer(builder, uploadAvatar);

    // API call cần lưu dữ liệu
    createAsyncReducer(builder, fetchUserInfo, "userInfo");
    createAsyncReducer(builder, listPositions, "positions");
    createAsyncReducer(builder, listDepartments, "departments");
    createAsyncReducer(builder, personCareer, "careers");
    createAsyncReducer(builder, personTasks, "tasks");
    createAsyncReducer(builder, listTypeTask, "typeTask");
    createAsyncReducer(builder, personalRequest, "personals");
    createAsyncReducer(builder, listTypePersonal, "typePersonal");
    createAsyncReducer(builder, listAchievements, "achievements");
    createAsyncReducer(builder, listProjects, "projects");
    createAsyncReducer(builder, listCard, "cards");
    createAsyncReducer(builder, listLink, "links");
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
