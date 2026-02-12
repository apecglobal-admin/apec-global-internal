import { createAsyncThunk } from "@reduxjs/toolkit";
import apiAxiosInstance from "./axios";
import { toast } from "react-toastify";
import { getStatEvent } from "../features/event/api/api";
import type {RootState} from "../lib/store";


export const updatePassword = createAsyncThunk(
  "user/updatePassword",
  async (payload: any, thunkAPI) => {
    try {
      const { old_password, new_password, token }: any = payload;
      const response = await apiAxiosInstance.put(`/auth/change/password`, {
        old_password, new_password
      },  {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      return {
        data: response.data,
        status: response.status
      };
    } catch (error: any) {
      // toast.error(error?.response?.data.message)
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);
export const loginWeb = createAsyncThunk(
  "user/loginWeb",
  async (payload: any, thunkAPI) => {
    try {
      const { email, password, fcm_token }: any = payload;
      console.log(fcm_token)
      const response = await apiAxiosInstance.post(`/auth/login`, {
        fcm_token,
        email,
        password,
      });
      if (typeof window !== "undefined") {
        localStorage.setItem("userToken", response.data.token);
      }

      return {
        data: response.data,
        status: response.status
      };
    } catch (error: any) {
      // toast.error(error?.response?.data.message)
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
      return  response.data.data
   
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);


export const fetchUserKPI = createAsyncThunk(
  "user/fetchUserKPI",
  async (token: string, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get("/profile/kpi", {
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
    try {
      const response = await apiAxiosInstance.get("/positions");
      return  response.data.data.positions
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);


export const listDepartments = createAsyncThunk<
any,   // kiểu trả về
void,  // không có argument
{ state: RootState } // kiểu state
>(
  "user/listDepartments",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState();
    const departments = state.user.departments;

    if (departments?.data.length > 0) {      
      return thunkAPI.rejectWithValue("Already loaded");
    }

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
      const { page, limit, token, id, filter, kpiFilter, projectFilter, statusFilter, priorityFilter, search }: any = payload;

      const params = Object.fromEntries(
        Object.entries({ page, limit, id, filter, kpiFilter, projectFilter, statusFilter, priorityFilter, search }).filter(
            ([key, value]) => value != null
        )
    );
      const response = await apiAxiosInstance.get(
        `/profile/tasks`,
        {
          params,
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

export const getListStatusPersonal = createAsyncThunk(
  "user/listStatusPersonal",
  async (_, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get("/personal-requests/status");
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
        `/profile/personal-requests?page=${page}`,
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

export const personalTarget = createAsyncThunk(
  "user/personalTarget",
  async (payload: any, thunkAPI) => {
    try {
      const { id, page, limit, token, status_request_id, search }: any = payload;
      const params = Object.fromEntries(
        Object.entries({ id, page, limit, status_request_id, search }).filter(
            ([key, value]) => value != null
        )
    );
      const response = await apiAxiosInstance.get(
        `/profile/personal-requests/target`,
        {
          params,
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

export const personalRequestStatus = createAsyncThunk(
  "user/personalRequestStatus",
  async (_, thunkAPI) => {
    try {

      const response = await apiAxiosInstance.get(`/personal-requests/status`,);
      return {
        data: response.data,
        status: response.status
      };
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error?.response?.data || error?.message);
    }
  }
);





export const personalRequestAssign = createAsyncThunk(
  "user/personalRequestAssign",
  async (payload: any, thunkAPI) => {
    try {
      
      const { page, limit, id, token, status_request_id, search }: any = payload;

      const params = Object.fromEntries(
        Object.entries({ limit, page, id, status_request_id, search }).filter(
            ([key, value]) => value != null
        )
    );
      const response = await apiAxiosInstance.get(
        `/profile/personal-requests/employees`,
        {
          params,
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



export const personalRequestHonor = createAsyncThunk(
  "user/personalRequestHonor",
  async (payload: any, thunkAPI) => {
    try {
      const {  id, reason, token }: any = payload;


      const response = await apiAxiosInstance.put(
        `/profile/personal-requests/honor`,
        {
          id, 
          reason
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


export const personalRequestApply = createAsyncThunk(
  "user/personalRequestApply",
  async (payload: any, thunkAPI) => {
    try {
      const {  id, token }: any = payload;

      const response = await apiAxiosInstance.put(
        `/profile/personal-requests/apply`,
        {
          id, 
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

export const personalRequestReject = createAsyncThunk(
  "user/personalRequestReject",
  async (payload: any, thunkAPI) => {
    try {
      const {  id, token }: any = payload;


      const response = await apiAxiosInstance.put(
        `/profile/personal-requests/reject`,
        {
          id, 
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
      const { token, title, description, prove, type_request_id }: any = payload;
      const response = await apiAxiosInstance.post(
        `/profile/personal-requests/create`,
        {
          title,
          description,
          type_request_id,
          document: prove
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

export const getListEmployeeDepartment = createAsyncThunk(
  "user/getListEmployeeDepartment",
  async (token: string | null, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/employees/departments`,
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

export const getTotalKpiSkill = createAsyncThunk(
  "user/getTotalKpiSkill",
  async (token: string | null, thunkAPI) => {
    try {
      const response = await apiAxiosInstance.get(
        `/profile/kpi/period`,
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

export const getPermissonManager = createAsyncThunk(
  "user/getPermissonManager",
  async (payload: any, thunkAPI) => {
    try {
      const {token} = payload;
      const response = await apiAxiosInstance.get(
        `/profile/manager/check`,
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














