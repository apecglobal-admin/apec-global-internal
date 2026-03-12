import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer, createAsyncReducerDynamic } from "@/src/utils/createAsyncReducer";
import { initState } from "@/src/services/interface";
import { getHistoryCheckin, getListEmployeeLetter, getListLetter, getListStatusLetter } from "./api";

interface EventMessage {
    message: string | null;
}

interface AttendanceState {
    historyCheckin: initState<any[]>;
    letters: initState<any[]>;
    statusLetter: initState<any[]>;
    employeeLetter: initState<any[]>;
    totalEmployeeLetter: initState<any>;

}

const createInitState = () => ({ data: [], loading: false, error: null, status: null });

const initialState: AttendanceState = {
    historyCheckin: createInitState(),
    letters: createInitState(),
    statusLetter: createInitState(),
    employeeLetter: createInitState(),
    totalEmployeeLetter: createInitState(),

};

const attendanceSlice = createSlice({
    name: "attendance",
    initialState: initialState,
    reducers: {},
    extraReducers: (builder) => {
        createAsyncReducer(builder, getHistoryCheckin, "historyCheckin");
        createAsyncReducer(builder, getListLetter, "letters");
        createAsyncReducer(builder, getListStatusLetter, "statusLetter");
        createAsyncReducer(builder, getListEmployeeLetter, ["employeeLetter", "totalEmployeeLetter"]);
    },
});

export const {} = attendanceSlice.actions;
export default attendanceSlice.reducer;