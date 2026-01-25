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
            const { search, date, event_type_id, token, remind, submit }: any = payload;

            const params = Object.fromEntries(
                Object.entries({ date, search, event_type_id, remind, submit }).filter(([key, value]) => value != null)
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

export const getInternalTypeEvent = createAsyncThunk(
    "event/getInternalTypeEvent",
    async (_, thunkAPI) => {
        try {
            const response = await apiAxiosInstance.get("/events/internal/types");
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

export const getListInternalEvent = createAsyncThunk(
    "event/getListInternalEvent",
    async (payload: any, thunkAPI) => {
        try {

            const { limit, page, id, token }: any = payload;

            const params = Object.fromEntries(
                Object.entries({ limit, page, id }).filter(
                    ([key, value]) => value != null
                )
            );
            const response = await apiAxiosInstance.get("/events/internal", {
                params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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

export const getListInternalEventEmployee = createAsyncThunk(
    "event/getListInternalEventEmployee",
    async (payload: any, thunkAPI) => {
        try {

            const { limit, page, id, token }: any = payload;

            const params = Object.fromEntries(
                Object.entries({ limit, page, id }).filter(
                    ([key, value]) => value != null
                )
            );
            const response = await apiAxiosInstance.get("/events/internal/employees", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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

export const getlevels = createAsyncThunk(
    "event/getlevels",
    async (_, thunkAPI) => {
        try {
            const response = await apiAxiosInstance.get("/levels");
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
export const eventInternalRegister = createAsyncThunk(
    "event/eventInternalRegister",
    async (payload: any, thunkAPI) => {
        try {
            const {
                name,
                description,
                internal_event_type_id,
                start_date,
                end_date,
                start_time,
                end_time,
                location,
                position_id,
                department_id,
                level_id,
                employees,
                token
            }: any = payload;

            const response = await apiAxiosInstance.post(
                `/events/internal/create`,
                {
                    name,
                    description,
                    internal_event_type_id,
                    start_date,
                    end_date,
                    start_time,
                    end_time,
                    location,
                    position_id,
                    department_id,
                    level_id,
                    employees,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
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

export const updateEventInternal = createAsyncThunk(
    "event/updateEventInternal",
    async (payload: any, thunkAPI) => {
        try {
            const {
                id,
                name,
                description,
                internal_event_type_id,
                start_date,
                end_date,
                start_time,
                end_time,
                location,
                position_id,
                department_id,
                level_id,
                employees,
                token
            }: any = payload;

            const response = await apiAxiosInstance.put(
                `/events/internal/update`,
                {
                    id,
                    name,
                    description,
                    internal_event_type_id,
                    start_date,
                    end_date,
                    start_time,
                    end_time,
                    location,
                    position_id,
                    department_id,
                    level_id,
                    employees,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
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

export const deleteEventInternal = createAsyncThunk(
    "event/deleteEventInternal",
    async (payload: any, thunkAPI) => {
        try {

            const { id, token }: any = payload;

            const response = await apiAxiosInstance.delete("/events/internal/delete",  {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: {
                    id: id,
                },
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

export const attendanceEventInternal = createAsyncThunk(
    "event/attendanceEventInternal",
    async (payload: any, thunkAPI) => {
        try {

            const { id, employee_id, token }: any = payload;

            const response = await apiAxiosInstance.put("/events/internal/attendance", {id, employee_id}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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





