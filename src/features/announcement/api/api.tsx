import { createAsyncThunk } from "@reduxjs/toolkit";
import apiAxiosInstance from "@/src/services/axios";



export const getSlider = createAsyncThunk(
    "announcement/getSlider",
    async (payload: any, thunkAPI) => {
        try {
            const { page }: any = payload;

            const params = Object.fromEntries(
                Object.entries({ page }).filter(
                    ([key, value]) => value != null
                )
            );
            const response = await apiAxiosInstance.get("/images", {params});
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

export const getTypeAnnouncement = createAsyncThunk(
    "announcement/getTypeAnnouncement",
    async (_, thunkAPI) => {
        try {
            const response = await apiAxiosInstance.get("/notifications/types");
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

export const getListAnnouncement = createAsyncThunk(
    "announcement/getListAnnouncement",
    async (payload: any, thunkAPI) => {
        try {
            const { token, search, type_id, department_id }: any = payload;
            const params = Object.fromEntries(
                Object.entries({ search, type_id, department_id }).filter(
                    ([key, value]) => value != null
                )
            );
            if(token){
                const response = await apiAxiosInstance.get(
                    "/notifications/employees",
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
            }else{
                const response = await apiAxiosInstance.get(
                    "/notifications/employees", 
                    {params}
                );
                return {
                    data: response.data,
                };
            }

        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error?.response?.data || error?.message
            );
        }
    }
);


export const readAnnoucement = createAsyncThunk(
    "announcement/readAnnoucement",
    async (payload: any, thunkAPI) => {
        try {
            const { id, token }: any = payload;

            const params = Object.fromEntries(
                Object.entries({ id}).filter(
                    ([key, value]) => value != null
                )
            );
            const response = await apiAxiosInstance.post(
                "/notifications/read",
                null,
                {
                    params,
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            return {
                data: response.data,
                status: response.status
            };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error?.response?.data || error?.message
            );
        }
    }
);


