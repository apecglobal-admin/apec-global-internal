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
    console.log("Dispatching fetchUser");
    try {
      const response = await apiAxiosInstance.get("/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return  response.data.data
   
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const listPositions = createAsyncThunk(
  "user/listPositions",
  async (_, thunkAPI) => {
    console.log("Dispatching listPositions API");
    try {
      const response = await apiAxiosInstance.get("/positions");
      console.log("API response", response.data);
      return  response.data.data.positions
    } catch (error: any) {
      console.log("API error", error);
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);


export const listDepartments = createAsyncThunk(
  "user/listDepartments",
  async (_, thunkAPI) => {
    console.log("Dispatching departmane");
    try {
      const response = await apiAxiosInstance.get("/departments");
      return  response.data.data
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
      return  response.data
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
      return {
        data: response.data.data,
        status: response.status
      };
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
      return {
        data: response.data,
        status: response.status
      };
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
      return {
        data: response.data,
        status: response.status
      };
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
      return {
        data: response.data,
        status: response.status
      };
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
      return {
        data: response.data,
        status: response.status
      };
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
      return {
        data: response.data,
        status: response.status
      };
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
      return {
        data: response.data,
        status: response.status
      };
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
      return {
        data: response.data,
        status: response.status
      };
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
        status: response.status,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);
export const getTypeAnnouncement = createAsyncThunk(
  "announcement/getTypeAnnouncement",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get("/notifications/types");
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

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
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);
export const getListEvent = createAsyncThunk(
  "event/getListEvent",
  async (token: string, thunkAPI) => {
    try {
      if (token) {
        const response = await apiAxiosInstance.get("/events/employees", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        return {
          data: response.data,
          status: response.status,
        };
      } else {
        const response = await apiAxiosInstance.get("/events/employees");
        return response;
      }
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);

export const eventReminder = createAsyncThunk(
  "event/eventReminder",
  async (payload: any, thunkAPI) => {
    try {
      const { id, event_id, token }: any = payload;

      const params = Object.fromEntries(
        Object.entries({ id, event_id }).filter(([key, value]) => value != null)
      );

      const response = await apiAxiosInstance.put(`/events/remind`, null, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      // console.log("response", response);

      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      console.log("response", error);

      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
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
        Object.entries({ id, event_id }).filter(([key, value]) => value != null)
      );

      const response = await apiAxiosInstance.post(`/events/register`, null, {
        params,
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      return {
        data: response.data,
        status: response.status,
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);
