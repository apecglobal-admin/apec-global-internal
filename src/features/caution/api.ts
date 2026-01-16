import { createAsyncThunk } from "@reduxjs/toolkit";
import apiAxiosInstance from "@/src/services/axios";




export const getCaution = createAsyncThunk(
    "task/getCaution",
    async (payload: any, thunkAPI) => {
        try {
            const {limit,page,id, token} = payload;

            const params = Object.fromEntries(
                Object.entries({ limit,page,id }).filter(
                    ([key, value]) => value != null
                )
            );
            const response = await apiAxiosInstance.get("/cautions/employees",
                {
                    params,
                    headers: {
                        Authorization: `Bearer ${token}`
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

export const getCautionKPI = createAsyncThunk(
    "task/getCautionKPI",
    async (token: string | null, thunkAPI) => {
        try {
            const response = await apiAxiosInstance.get("/kpi/items/caution/select",
                {
                  headers: {
                    Authorization: `Bearer ${token}`
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


export const createCaution = createAsyncThunk(
    "task/createCaution",
    async (payload: any, thunkAPI) => {
        try {
            const {employees, kpi_item_id, token} = payload;
            const response = await apiAxiosInstance.post("/cautions/create",
                {
                    employees, kpi_item_id
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`
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


export const getListCaution = createAsyncThunk(
    "task/getListCaution",
    async (payload: any, thunkAPI) => {
        try {
            const {limit,page,id, token} = payload;
            const params = Object.fromEntries(
                Object.entries({ limit,page,id }).filter(
                    ([key, value]) => value != null
                )
            );
            const response = await apiAxiosInstance.get("/cautions",
                {
                    params,
                    headers: {
                        Authorization: `Bearer ${token}`
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