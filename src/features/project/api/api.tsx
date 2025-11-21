import { createAsyncThunk } from "@reduxjs/toolkit";
import apiAxiosInstance from "@/src/services/axios";

export const getListProject = createAsyncThunk(
    "project/getListProject",
    async (_, thunkAPI) => {
        try {
            const response = await apiAxiosInstance.get("/projects");
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

export const getStatProject = createAsyncThunk(
    "project/getStatProject",
    async (_, thunkAPI) => {
        try {
            const response = await apiAxiosInstance.get("/projects/statistical");
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

export const getStatusProject = createAsyncThunk(
    "project/getStatusProject",
    async (_, thunkAPI) => {
        try {
            const response = await apiAxiosInstance.get("/projects/status");
            return {
                data: response.data.data,
                status: response.status,
            };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error?.response?.data || error?.message
            );
        }
    }
);
