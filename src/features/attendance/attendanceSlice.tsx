import { createSlice } from "@reduxjs/toolkit";
import { createAsyncReducer, createAsyncReducerDynamic } from "@/src/utils/createAsyncReducer";
import { initState } from "@/src/services/interface";
import { getTypeAttendanceAbsences, getStatusAttendanceAbsences, getHistoryCheckin, getPersonalAttendance, getListAttendanceManagerAbsences } from "./api";

interface EventMessage {
    message: string | null;
}

interface AttendanceState {
    historyCheckin: initState<any[]>;
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
        createAsyncReducer(builder, getTypeAttendanceAbsences, "listTypeAttendanceAbsences");
        createAsyncReducer(builder, getStatusAttendanceAbsences, "listStatusAttendanceAbsences");


        createAsyncReducerDynamic(builder, getPersonalAttendance);
        createAsyncReducerDynamic(builder, getListAttendanceManagerAbsences);

        

        
    },
});

export const {} = attendanceSlice.actions;
export default attendanceSlice.reducer;