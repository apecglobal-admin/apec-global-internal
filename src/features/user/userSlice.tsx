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

const userSlice = createSlice({
    name: "user",
    initialState: {
        userInfo: null,
        departments: [],
        positions: [],
        careers: [],
        tasks: [],
        typeTask: [],
        personals: [],
        typePersonal: [],
        achievements: [],
        projects: null,
        cards: [],
        links: [],
        loading: false,
        error: null,
        status: "idle",
    },

    reducers: {
        logout: (state) => {
            state.userInfo = null;
            state.loading = false;
            state.error = null;
            state.status = "idle";
        },
    },
    extraReducers: (builder) => {
        createAsyncReducer(builder, loginWeb); // không có stateKey vì không cần lưu payload
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
        createAsyncReducer(builder, uploadAvatar); // nếu chỉ quan tâm trạng thái, không lưu payload
    },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
