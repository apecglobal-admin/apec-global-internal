import { createAsyncThunk } from "@reduxjs/toolkit";
import apiAxiosInstance from "@/src/services/axios";
import { toast } from "react-toastify";

export const checkin = createAsyncThunk(
  "attendance/checkin",
  async (payload: any, thunkAPI) => {
    try {
      const { long, lat, token }: any = payload;

      const response = await apiAxiosInstance.post(
        "/attendance/check",
        { long, lat },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return {
        data: response.data,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const getHistoryCheckin = createAsyncThunk(
  "attendance/getHistoryCheckin",
  async (payload: any, thunkAPI) => {
    try {
      const { time, token } = payload;

      const params = Object.fromEntries(
        Object.entries({ time }).filter(([key, value]) => value != null),
      );

      const response = await apiAxiosInstance.get("/attendance/history", {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return {
        data: response.data,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const getListLetter = createAsyncThunk(
  "attendance/getListLetter",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/attendance/absence`);

      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const getListStatusLetter = createAsyncThunk(
  "attendance/getListStatusLetter",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(`/attendance/status`);

      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const getListEmployeeLetter = createAsyncThunk(
  "attendance/getListEmployeeLetter",
  async (payload, thunkAPI) => {
    try {
      const { token, id, status, page, limit, search, absence_id }: any =
        payload;

      const response = await apiAxiosInstance.get(
        "/attendance/employee/absences",
        {
          params: {
            id,
            status,
            page,
            limit,
            search,
            absence_id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const createLetter = createAsyncThunk(
  "attendance/createLetter",
  async (payload: any, thunkAPI) => {
    try {
      const {
        token,
        absence_id,
        start_date,
        end_date,
        start_time,
        end_time,
        reason,
        document,
        address,
      }: any = payload;

      const response = await apiAxiosInstance.post(
        "/attendance/employee/absence/create",
        {
          absence_id,
          start_date,
          end_date,
          start_time,
          end_time,
          reason,
          document,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return {
        data: response.data,
      };
    } catch (error: any) {
      toast.error(
        error?.response?.data?.data?.message ||
          error?.message ||
          "Failed to create letter",
      );
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const updateLetter = createAsyncThunk(
  "attendance/updateLetter",
  async (payload: any, thunkAPI) => {
    try {
      const {
        token,
        id,
        absence_id,
        start_date,
        end_date,
        start_time,
        end_time,
        reason,
        document,
        address,
      }: any = payload;

      const response = await apiAxiosInstance.put(
        "/attendance/employee/absence/edit",
        {
          id,
          absence_id,
          start_date,
          end_date,
          start_time,
          end_time,
          reason,
          document,
          address,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return {
        status: response.status,
        data: response.data,
      };
    } catch (error: any) {
      toast.error(
        error?.response?.data?.data?.message ||
          error?.message ||
          "Failed to create letter",
      );
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);

export const deleteLetter = createAsyncThunk(
  "attendance/deleteLetter",
  async (payload: any, thunkAPI) => {
    try {
      const { token, id } = payload;

      const response = await apiAxiosInstance.delete(
        "/attendance/employee/absence/delete",
        {
          data: { id },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      toast.error(
        error?.response?.data?.data?.message ||
          error?.message ||
          "Failed to create letter",
      );
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  },
);
