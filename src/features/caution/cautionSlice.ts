import { createSlice } from "@reduxjs/toolkit";
import {

    createCaution,
    getCaution,
    getCautionKPI,
    getListCaution,
} from "./api";
import { createAsyncReducer } from "@/src/utils/createAsyncReducer";
import { initState } from "@/src/services/interface";

interface EventMessage{
    message: string | null;
}

interface CautionState {
    caution: initState<any[]>;
    listCautionKPI: initState<any[]>;
    listCaution: initState<any[]>;
    
}

const createInitState = () => ({ data: [], loading: false, error: null, status: null });



const initialState: CautionState = {
    listCautionKPI: createInitState(),
    listCaution: createInitState(),
    caution: createInitState(),

};

const cautionSlice = createSlice({
    name: "caution",
    initialState: initialState,

    reducers: {

    },
    extraReducers: (builder) => {
        createAsyncReducer(builder, createCaution);
        createAsyncReducer(builder, getCautionKPI, "listCautionKPI");
        createAsyncReducer(builder, getListCaution, "listCaution");
        createAsyncReducer(builder, getCaution, "caution");

        
        

    },
});

export const {  } = cautionSlice.actions;
export default cautionSlice.reducer;
