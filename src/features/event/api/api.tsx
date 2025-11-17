import { createAsyncThunk } from "@reduxjs/toolkit";
import apiAxiosInstance from "@/src/services/axios";

export const getTypeEvent = createAsyncThunk(
    "event/getTypeEvent",
    async (_, thunkAPI) => {
        try {
            const response = await apiAxiosInstance.get("/events/types");
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
export const getListEvent = createAsyncThunk(
    "event/getListEvent",
    async (payload: any, thunkAPI) => {
        try {
            const { date, token }: any = payload;

            const params = Object.fromEntries(
                Object.entries({ date }).filter(([key, value]) => value != null)
            );
            if (token) {
                const response = await apiAxiosInstance.get(
                    "/events/employees",
                    {
                        params,
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                return {
                    data: response.data,
                    status: response.status,
                };
            } else {
                const response = await apiAxiosInstance.get(
                    "/events/employees"
                );
                return response;
            }
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error?.response?.data || error?.message
            );
        }
    }
);

export const getListTimeLine = createAsyncThunk(
    "event/getListTimeLine",
    async (_, thunkAPI) => {
        try {
            const response = await apiAxiosInstance.get("/events/timeline");
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

export const getStatEvent = createAsyncThunk(
    "event/getStatEvent",
    async (_, thunkAPI) => {
        try {
            const response = await apiAxiosInstance.get("/events/statistical");
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


export const eventReminder = createAsyncThunk(
    "event/eventReminder",
    async (payload: any, thunkAPI) => {
        try {
            const { id, event_id, token }: any = payload;

            const params = Object.fromEntries(
                Object.entries({ id, event_id }).filter(
                    ([key, value]) => value != null
                )
            );

            const response = await apiAxiosInstance.put(
                `/events/remind`,
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
                status: response.status,
            };
        } catch (error: any) {
            const data = {
                data: error?.response?.data,
                status: error?.response?.status,
            };

            return thunkAPI.rejectWithValue(data || error?.message);
        }
    }
);

export const eventRegister = createAsyncThunk(
    "event/eventRegister",
    async (payload: any, thunkAPI) => {
        try {
            const { id, event_id, token }: any = payload;
            console.log("id, event_id", id, event_id, payload);

            const params = Object.fromEntries(
                Object.entries({ id, event_id }).filter(
                    ([key, value]) => value != null
                )
            );

            const response = await apiAxiosInstance.post(
                `/events/register`,
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
                status: response.status,
            };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(
                error?.response?.data || error?.message
            );
        }
    }
);
