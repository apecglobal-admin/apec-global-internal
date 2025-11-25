import { createAsyncThunk } from "@reduxjs/toolkit";
import apiAxiosInstance from "@/src/services/axios";

export const getDashboardEconosystem = createAsyncThunk(
    "econosystem/getDashboard",
    async (payload: { key: string; id?: any; }, thunkAPI) => {
        try {
            const { key, id } = payload;

            const params = Object.fromEntries(
                Object.entries({ id }).filter(
                    ([_, value]) => value != null
                )
            );

            const response = await apiAxiosInstance.get("/ecosystems", { params });

            return {
                key,               // <-- giữ lại key để dùng trong reducer
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
