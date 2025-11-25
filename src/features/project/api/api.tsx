import { createAsyncThunk } from "@reduxjs/toolkit";
import apiAxiosInstance from "@/src/services/axios";

export const getListProject = createAsyncThunk(
    "project/getListProject",
    async (payload: any, thunkAPI) => {
        try {
            const { search, project_status }: any = payload;
            const params = Object.fromEntries(
                Object.entries({ search, project_status }).filter(
                    ([key, value]) => value != null
                )
            );
            const response = await apiAxiosInstance.get("/projects", {params});
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
