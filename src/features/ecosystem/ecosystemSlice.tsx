
import { createSlice } from "@reduxjs/toolkit";
import {
    getDashboardEconosystem
} from "./api/api";
import { createAsyncReducer, createAsyncReducerDynamic } from "@/src/utils/createAsyncReducer";
import { initState } from "@/src/services/interface";


interface EconosystemState {
    listELearning: initState<any[]>;
    listTools: initState<any[]>;
    listCreative: initState<any[]>;
    listNews: initState<any[]>;
}
const createInitState = () => ({ data: [], loading: false, error: null, status: null });


const initialState: EconosystemState = {
    listELearning: createInitState(),
    listTools: createInitState(),
    listCreative: createInitState(),
    listNews: createInitState(),
};


const econosystemdSlice = createSlice({
    name: "econosystem",
    initialState: initialState,

    reducers: {

    },
    extraReducers: (builder) => {
        createAsyncReducerDynamic(builder, getDashboardEconosystem);
    },
});

export const {  } = econosystemdSlice.actions;
export default econosystemdSlice.reducer;
