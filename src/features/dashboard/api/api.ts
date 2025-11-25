import { createAsyncThunk } from "@reduxjs/toolkit";
import apiAxiosInstance from "@/src/services/axios";

export const getDashboard = createAsyncThunk(
    "dashboard/getDashboard",
    async (payload: { key: string; page?: number; group_id?: any }, thunkAPI) => {
        try {
            const { key, page, group_id } = payload;

            const params = Object.fromEntries(
                Object.entries({ page, group_id }).filter(
                    ([_, value]) => value != null
                )
            );

            const response = await apiAxiosInstance.get("/dashboards", { params });

            return {
                key,
                data: response.data,
                status: response.status,
            };
        } catch (error: any) {
            return thunkAPI.rejectWithValue({
                key: payload.key, // <-- giữ lại key cho rejected
                ...(error?.response?.data || { message: error?.message }),
            });
        }
    }
);
