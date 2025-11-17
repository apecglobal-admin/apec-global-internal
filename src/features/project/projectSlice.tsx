import { createSlice } from "@reduxjs/toolkit";
import {
    getListProject,
    getStatProject,
} from "./api/api";
import { createAsyncReducer } from "@/src/utils/createAsyncReducer";

interface initState<T> {
    data: T;
    loading: boolean;
    error: string | null;
    status: number | null;
}

interface PolicyState {
    listProject: initState<any[]>;
    statProject: initState<any[]>;
}

const initialState: PolicyState = {
    listProject: { data: [], loading: false, error: null, status: null },
    statProject: { data: [], loading: false, error: null, status: null },
};

const projectSlice = createSlice({
    name: "project",
    initialState: initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        createAsyncReducer(builder, getListProject, "listProject");
        createAsyncReducer(builder, getStatProject, "statProject");
        
    },
});

export const {  } = projectSlice.actions;
export default projectSlice.reducer;
