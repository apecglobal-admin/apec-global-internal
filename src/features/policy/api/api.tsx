import { createAsyncThunk } from "@reduxjs/toolkit";
import apiAxiosInstance from "@/src/services/axios";

export const getStatPolicy = createAsyncThunk(
    "policy/getStatPolicy",
    async (_, thunkAPI) => {
        try {
            const response = await apiAxiosInstance.get("/policy/statistical");
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error?.response?.data || error?.message
            );
        }
    }
);

export const getListPolicy = createAsyncThunk(
    "policy/getListPolicy",
    async (payload: any, thunkAPI) => {
        try {
            const { filter }: any = payload;

            const params = Object.fromEntries(
                Object.entries({ filter }).filter(
                    ([key, value]) => value != null
                )
            );

            const response = await apiAxiosInstance.get("/policy", {params});

            
            return {
                data: response.data,
                status: response.status,
            };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error?.response?.data || error?.message
            );
        }
    }
);
