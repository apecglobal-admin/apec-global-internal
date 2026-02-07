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

export const getDashboardTasks = createAsyncThunk(
    "dashboard/getDashboardTasks",
    async (payload: any, thunkAPI) => {
        try {
            const { task_status, task_priority, token } = payload;

            const params = Object.fromEntries(
                Object.entries({ task_status, task_priority }).filter(
                    ([_, value]) => value != null
                )
            );

            const response = await apiAxiosInstance.get("/tasks/statistical/employees", { 
                params,
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            return {
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

export const getDashboardManagerTasks = createAsyncThunk(
    "dashboard/getDashboardManagerTasks",
    async (payload: any, thunkAPI) => {
        try {
            const { task_status, task_priority, token } = payload;

            const params = Object.fromEntries(
                Object.entries({ task_status, task_priority }).filter(
                    ([_, value]) => value != null
                )
            );

            const response = await apiAxiosInstance.get("/tasks/statistical/managers", { 
                params,
                headers: {
                    Authorization: `Bearer ${token}`
                },
            });

            return {
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
