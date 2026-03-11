import { createAsyncThunk } from "@reduxjs/toolkit";
import apiAxiosInstance from "@/src/services/axios";



export const checkin = createAsyncThunk(
    "attendance/checkin",
    async (payload: any, thunkAPI) => {
        try {
            const { long, lat, token }: any = payload;

            const response = await apiAxiosInstance.post("/attendance/check", 
                {long, lat}, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return {
                data: response.data,
            };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error?.response?.data || error?.message
            );
        }
    }
);

export const getHistoryCheckin = createAsyncThunk(
    "attendance/getHistoryCheckin",
    async (payload: any, thunkAPI) => {
        try {
            const {time, token} = payload

            const params = Object.fromEntries(
                Object.entries({ time }).filter(
                    ([key, value]) => value != null
                )
            );

            const response = await apiAxiosInstance.get("/attendance/history", 
                {
                    params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return {
                data: response.data,
            };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error?.response?.data || error?.message
            );
        }
    }
);


export const getPersonalAttendance = createAsyncThunk(
    "attendance/getPersonalAttendance",
    async (payload: any, thunkAPI) => {
        try {
            const {time, id, token} = payload

            const params = Object.fromEntries(
                Object.entries({ time, id }).filter(
                    ([key, value]) => value != null
                )
            );

            const response = await apiAxiosInstance.get("/attendance/time/sheet", 
                {
                    params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return {
                data: response.data,
            };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error?.response?.data || error?.message
            );
        }
    }
);


export const getTypeAttendanceAbsences = createAsyncThunk(
    "attendance/getTypeAttendanceAbsences",
    async (_, thunkAPI) => {
        try {
            const response = await apiAxiosInstance.get("/attendance/absence");
            return {
                data: response.data,
            };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error?.response?.data || error?.message
            );
        }
    }
);

export const getStatusAttendanceAbsences = createAsyncThunk(
    "attendance/getStatusAttendanceAbsences",
    async (_, thunkAPI) => {
        try {
            const response = await apiAxiosInstance.get("/attendance/status");
            return {
                data: response.data,
            };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error?.response?.data || error?.message
            );
        }
    }
);

export const getListAttendanceManagerAbsences = createAsyncThunk(
    "attendance/getListAttendanceManagerAbsences",
    async (payload: any, thunkAPI) => {
        try {
            const {id, status, page, search, absence_id, token} = payload

            const params = Object.fromEntries(
                Object.entries({ id, status, page, search, absence_id }).filter(
                    ([key, value]) => value != null
                )
            );

            const response = await apiAxiosInstance.get("/attendance/manager/absences", 
                {
                    params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            return {
                data: response.data,
            };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error?.response?.data || error?.message
            );
        }
    }
);

