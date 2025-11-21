import { createAsyncThunk } from "@reduxjs/toolkit";
import apiAxiosInstance from "@/src/services/axios";

export const postContact = createAsyncThunk(
    "compet/postContact",
    async (payload: any, thunkAPI) => {
        try {
            const { name, email, phone, title, content }: any = payload;

            const response = await apiAxiosInstance.post("/contracts/form/create", {
                name, email, phone, title, content
            });
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
