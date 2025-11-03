import { createAsyncThunk } from "@reduxjs/toolkit";
import apiAxiosInstance from "./axios";

export const loginWeb = createAsyncThunk(
  'user/loginWeb', 
  async (payload: any, thunkAPI) => {
    try {
      const { email, password }: any = payload; 
      const response = await apiAxiosInstance.post(`/auth/login`,{      
        email,
        password,
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const fetchUserInfo = createAsyncThunk(
  'user/fetchUserInfo',
  async (token: string, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get('/employees/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

