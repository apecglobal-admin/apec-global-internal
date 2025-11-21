import { createSlice } from "@reduxjs/toolkit";
import {
    getStatPolicy,
    getListPolicy
} from "./api/api";
import { createAsyncReducer } from "@/src/utils/createAsyncReducer";
import { initState } from "@/src/services/interface";


interface PolicyState {
    statPolicy: initState<any[]>;
    listPolicy: initState<any[]>
}
const createInitState = () => ({ data: [], loading: false, error: null, status: null });


const initialState: PolicyState = {
    listPolicy: createInitState(),
    statPolicy: createInitState(),
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
