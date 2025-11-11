import { createAsyncThunk } from "@reduxjs/toolkit";
import apiAxiosInstance from "./axios";

export const loginWeb = createAsyncThunk(
  "user/loginWeb",
  async (payload: any, thunkAPI) => {
    try {
      const { email, password }: any = payload;
      const response = await apiAxiosInstance.post(`/auth/login`, {
        email,
        password,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("userToken", response.data.token);
      }

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const fetchUserInfo = createAsyncThunk(
  "user/fetchUserInfo",
  async (token: string, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get("/profile", {
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

export const listPositions = createAsyncThunk(
  "user/listPositions",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get("/positions");
      return response.data.data.positions;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listDepartments = createAsyncThunk(
  "user/listDepartments",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get("/departments");
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const personCareer = createAsyncThunk(
  "user/personCareer",
  async (token, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get("/profile/careers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const personTasks = createAsyncThunk(
  "user/personTasks",
  async (payload, thunkAPI) => {
    try {
      const { page, limit, token }: any = payload;
      const response = await apiAxiosInstance.get(
        `/profile/tasks?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listTypeTask = createAsyncThunk(
  "user/listTypeTask",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get("/tasks/types");
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listTypePersonal = createAsyncThunk(
  "user/listTypePersonal",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get("/personal-requests/types");
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const personalRequest = createAsyncThunk(
  "user/personalRequest",
  async (payload, thunkAPI) => {
    try {
      const { page, limit, token }: any = payload;
      const response = await apiAxiosInstance.get(
        `/profile/personal-requests?page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listAchievements = createAsyncThunk(
  "user/listAchievements",
  async (token, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get("/profile/achievements", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listProjects = createAsyncThunk(
  "user/listProjects",
  async (token, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get("/profile/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listCard = createAsyncThunk(
  "user/listCard",
  async (token, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get("/profile/apec-cards", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listLink = createAsyncThunk(
  "user/listLink",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get("/profile/links");
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const uploadAvatar = createAsyncThunk(
  "user/uploadAvatar",
  async (payload: any, thunkAPI) => {
    try {
      const { formData, token }: any = payload;

      const response = await apiAxiosInstance.post(
        `/profile/avatar/uploads`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const createRequestUser = createAsyncThunk(
  "user/createRequestUser",
  async (payload: any, thunkAPI) => {
    try {
      const { token, title, description, type_request_id }: any = payload;
      const response = await apiAxiosInstance.post(
        `/profile/personal-requests/create`,
        {
          title,
          description,
          type_request_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return {
        data: response.data,
        status: response.status
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);
