import { createAsyncThunk } from "@reduxjs/toolkit";
import apiAxiosInstance from "./axios";

export const loginWeb = createAsyncThunk(
  'user/loginWeb', 
  async (payload: any, thunkAPI) => {
    try {
      const { username, password }: any = payload; 
      const response = await apiAxiosInstance.post(`/auth/login`,{      
        username,
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
  async (token: any, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.post(`/auth/user`,{      
        token
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);