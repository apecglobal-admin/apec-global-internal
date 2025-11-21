import { createSlice } from "@reduxjs/toolkit";
import {
    getListProject,
    getStatProject,
    getStatusProject,
} from "./api/api";
import { createAsyncReducer } from "@/src/utils/createAsyncReducer";
import { initState } from "@/src/services/interface";

interface PolicyState {
    listProject: initState<any[]>;
    statProject: initState<any[]>;
    statusProject: initState<any[]>;
}

const createInitState = () => ({ data: [], loading: false, error: null, status: null });

const initialState: PolicyState = {
    listProject: createInitState(),
    statProject: createInitState(),
    statusProject: createInitState(),
};

const projectSlice = createSlice({
    name: "project",
    initialState: initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        createAsyncReducer(builder, getListProject, "listProject");
        createAsyncReducer(builder, getStatProject, "statProject");
        createAsyncReducer(builder, getStatusProject, "statusProject");
    },
});

export const {  } = projectSlice.actions;
export default projectSlice.reducer;
