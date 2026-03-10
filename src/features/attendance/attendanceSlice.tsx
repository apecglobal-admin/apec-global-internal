import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer, createAsyncReducerDynamic } from "@/src/utils/createAsyncReducer";
import { initState } from "@/src/services/interface";
import { getHistoryCheckin } from "./api";

interface EventMessage {
    message: string | null;
}

interface AttendanceState {
    historyCheckin: initState<any[]>;

}

const createInitState = () => ({ data: [], loading: false, error: null, status: null });

const initialState: AttendanceState = {
    historyCheckin: createInitState(),

};

const attendanceSlice = createSlice({
    name: "attendance",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {

        createAsyncReducer(builder, getHistoryCheckin, "historyCheckin");
    },
});

export const {} = attendanceSlice.actions;
export default attendanceSlice.reducer;