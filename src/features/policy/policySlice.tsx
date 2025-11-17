import { createSlice } from "@reduxjs/toolkit";
import {
    getStatPolicy,
    getListPolicy
} from "./api/api";
import { createAsyncReducer } from "@/src/utils/createAsyncReducer";

interface initState<T> {
    data: T;
    loading: boolean;
    error: string | null;
    status: number | null;
}

interface PolicyState {
    statPolicy: initState<any[]>;
    listPolicy: initState<any[]>
}

const initialState: PolicyState = {
    listPolicy: { data: [], loading: false, error: null, status: null },
    statPolicy: { data: [], loading: false, error: null, status: null },
};

const policySlice = createSlice({
    name: "policy",
    initialState: initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        createAsyncReducer(builder, getStatPolicy, "statPolicy");
        createAsyncReducer(builder, getListPolicy, "listPolicy");
    },
});

export const {  } = policySlice.actions;
export default policySlice.reducer;
