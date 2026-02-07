
import { createSlice } from "@reduxjs/toolkit";
import {
    getDashboard,
    getDashboardManagerTasks,
    getDashboardTasks
} from "./api/api";
import { createAsyncReducer, createAsyncReducerDynamic } from "@/src/utils/createAsyncReducer";
import { initState } from "@/src/services/interface";


interface DashboardState {
    listStatistic: initState<any[]>;
    listHumanResource: initState<any[]>;
    listMaintain: initState<any[]>;
    listAchievement: initState<any[]>;
    listGrowth: initState<any[]>;
    listTopProduct: initState<any[]>;
    listDashboardTasks: initState<any[]>;
    listDashboardManagerTasks: initState<any[]>;
}
const createInitState = () => ({ data: [], loading: false, error: null, status: null });


const initialState: DashboardState = {
    listStatistic: createInitState(),
    listHumanResource: createInitState(),
    listMaintain: createInitState(),
    listAchievement: createInitState(),
    listGrowth: createInitState(),
    listTopProduct: createInitState(),
    listDashboardTasks: createInitState(),
    listDashboardManagerTasks: createInitState(),

};


const dashboardSlice = createSlice({
    name: "dashboard",
    initialState: initialState,

    reducers: {

    },
    extraReducers: (builder) => {
        createAsyncReducerDynamic(builder, getDashboard);
        createAsyncReducer(builder, getDashboardTasks, "listDashboardTasks")
        createAsyncReducer(builder, getDashboardManagerTasks, "listDashboardManagerTasks")

        
    },
});

export const {  } = dashboardSlice.actions;
export default dashboardSlice.reducer;
