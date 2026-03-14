import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer, createAsyncReducerDynamic } from "@/src/utils/createAsyncReducer";
import { initState } from "@/src/services/interface";
import { getListEmployeeLetter, getListLetter, getListStatusLetter } from "./api";
import { getTypeAttendanceAbsences, getStatusAttendanceAbsences, getHistoryCheckin, getPersonalAttendance, getListAttendanceManagerAbsences } from "./api";

interface EventMessage {
    message: string | null;
}

interface AttendanceState {
    historyCheckin: initState<any[]>;
    letters: initState<any[]>;
    statusLetter: initState<any[]>;
    employeeLetter: initState<any[]>;
    totalEmployeeLetter: initState<any>;
    personalAttendance: initState<any[]>;
    detailPersonalAttendance: initState<any[]>;
    listAttendanceManagerAbsences: initState<any[]>;
    detailListAttendanceManagerAbsences: initState<any[]>;
    listTypeAttendanceAbsences: initState<any[]>;
    listStatusAttendanceAbsences: initState<any[]>;

}

const createInitState = () => ({ data: [], loading: false, error: null, status: null });

const initialState: AttendanceState = {
    historyCheckin: createInitState(),
    letters: createInitState(),
    statusLetter: createInitState(),
    employeeLetter: createInitState(),
    totalEmployeeLetter: createInitState(),
    personalAttendance: createInitState(),
    detailPersonalAttendance: createInitState(),
    listAttendanceManagerAbsences:  createInitState(),
    detailListAttendanceManagerAbsences:  createInitState(),
    listTypeAttendanceAbsences: createInitState(),
    listStatusAttendanceAbsences: createInitState(),

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
        createAsyncReducer(builder, getTypeAttendanceAbsences, "listTypeAttendanceAbsences");
        createAsyncReducer(builder, getStatusAttendanceAbsences, "listStatusAttendanceAbsences");


        createAsyncReducerDynamic(builder, getPersonalAttendance);
        createAsyncReducerDynamic(builder, getListAttendanceManagerAbsences);

        

        
    },
});

export const {} = attendanceSlice.actions;
export default attendanceSlice.reducer;