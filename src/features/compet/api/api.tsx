import { createAsyncThunk } from "@reduxjs/toolkit";
import apiAxiosInstance from "@/src/services/axios";

export const getRankingCompet = createAsyncThunk(
    "compet/getRankingCompet",
    async (payload: any, thunkAPI) => {
        try {
            const { type }: any = payload;

            const params = Object.fromEntries(
                Object.entries({ type }).filter(([key, value]) => value != null)
            );
            const response = await apiAxiosInstance.get("/ranking", {params});
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
