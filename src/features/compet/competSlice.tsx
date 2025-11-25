
import { createSlice } from "@reduxjs/toolkit";
import {
    getRankingCompet,
    getTopRankingCompet
} from "./api/api";
import { createAsyncReducer } from "@/src/utils/createAsyncReducer";
import { initState } from "@/src/services/interface";




interface CompetState {
    listRankingCompet: initState<any[]>;
    topRank: initState<any[]>;
}
const createInitState = () => ({ data: [], loading: false, error: null, status: null });


const initialState: CompetState = {
    listRankingCompet: createInitState(),
    topRank: createInitState()
};


const competSlice = createSlice({
    name: "compet",
    initialState: initialState,

    reducers: {

    },
    extraReducers: (builder) => {
        createAsyncReducer(builder, getRankingCompet, "listRankingCompet")
        createAsyncReducer(builder, getTopRankingCompet, "topRank")
    },
});

export const {  } = competSlice.actions;
export default competSlice.reducer;
