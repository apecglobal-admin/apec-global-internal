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