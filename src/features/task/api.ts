import { createAsyncThunk } from "@reduxjs/toolkit";
import apiAxiosInstance from "@/src/services/axios";

export const createTask = createAsyncThunk(
    "task/createTask",
    async (payload: any, thunkAPI) => {
        try {
            const { 
                name, 
                type_task, 
                date_start, 
                date_end, 
                task_priority, 
                project_id, 
                kpi_item_id, 
                target_type, 
                target_value, 
                task_status, 
                employees,position_id,department_id,
                token,
                min_count_reject,
                max_count_reject
            }: any = payload;
            const response = await apiAxiosInstance.post("/tasks/create",{ 
                name, 
                type_task, 
                date_start, 
                date_end, 
                task_priority, 
                project_id, 
                kpi_item_id, 
                target_type, 
                target_value, 
                task_status, 
                employees,
                position_id,
                department_id,
                min_count_reject,
                max_count_reject
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
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

export const createSubTask = createAsyncThunk(
    "task/createSubTask",
    async (payload: any, thunkAPI) => {
        try {
            const { 
                name, 
                task_id, 
                subtask_status,
                process, 
                task_assignment_id,
                token
            }: any = payload;
            const response = await apiAxiosInstance.post("/tasks/sub/create",{ 
                name, 
                task_id, 
                subtask_status,
                process, 
                task_assignment_id
            }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
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

export const getSubTask = createAsyncThunk(
    "task/getSubTask",
    async (payload: any, thunkAPI) => {
        try {
            const {limit, offset, task_assignment_id, token} = payload

            const params = Object.fromEntries(
                Object.entries({ limit, offset, task_assignment_id }).filter(
                    ([key, value]) => value != null
                )
            );
            const response = await apiAxiosInstance.get("/tasks/sub", {
                params,
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
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

export const getTypeTask = createAsyncThunk(
    "task/getTypeTask",
    async (_, thunkAPI) => {
        try {

            const response = await apiAxiosInstance.get("/cms/select/options/type_tasks");
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

export const getPriorityTask = createAsyncThunk(
    "task/getPriorityTask",
    async (_, thunkAPI) => {
        try {

            const response = await apiAxiosInstance.get("/cms/select/options/project_priorities");
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

export const getListProject = createAsyncThunk(
    "task/getListProject",
    async (_, thunkAPI) => {
        try {

            const response = await apiAxiosInstance.get("/projects/select/option");
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


export const getChildKpi = createAsyncThunk(
    "task/getChildKpi",
    async (_, thunkAPI) => {
        try {

            const response = await apiAxiosInstance.get("/kpi/items/tasks/select");
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

export const getListEmployee = createAsyncThunk(
    "task/getListEmployee",
    async (payload: any, thunkAPI) => {
        try {
            const {position_id, department_id, filter} = payload;
            const params = Object.fromEntries(
                Object.entries({ position_id, department_id, filter }).filter(
                    ([key, value]) => value != null
                )
            );
            const response = await apiAxiosInstance.get("/employees/select/options", {params});
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

export const getStatusTask = createAsyncThunk(
    "task/getStatusTask",
    async (_, thunkAPI) => {
        try {

            const response = await apiAxiosInstance.get("/projects/status");
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

export const getListDepartment = createAsyncThunk(
    "task/getListDepartment",
    async (_, thunkAPI) => {
        try {

            const response = await apiAxiosInstance.get("/cms/select/options/departments");
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

export const getListPosition = createAsyncThunk(
    "task/getListPosition",
    async (_, thunkAPI) => {
        try {

            const response = await apiAxiosInstance.get("/cms/select/options/positions");
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

export const uploadImageTask = createAsyncThunk(
    "task/uploadImageTask",
    async (payload: any, thunkAPI) => {
        try {
            const { formData, token }: any = payload;
            const response = await apiAxiosInstance.post("/file/images/uploads",
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
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


export const uploadFileTask = createAsyncThunk(
    "task/uploadFileTask",
    async (payload: any, thunkAPI) => {
        try {
            const { formData, token }: any = payload;
            const response = await apiAxiosInstance.post("/file/documents/uploads",
                formData,
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
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


export const updateProgressTask = createAsyncThunk(
    "task/updateProgressTask",
    async (payload: any, thunkAPI) => {
        try {
            const { 
                id, 
                process, 
                task_id, 
                status, 
                value, 
                token,
                date_end,
                date_start
            }: any = payload;
            const response = await apiAxiosInstance.put("/tasks/progress/update",
                {
                    id, 
                    process, 
                    task_id, 
                    status, 
                    value, 
                    date_end,
                    date_start
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
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

export const updateProgressSubTask = createAsyncThunk(
    "task/updateProgressSubTask",
    async (payload: any, thunkAPI) => {
        try {
            const { 
                id, 
                process, 
                task_assignment_id, 
                status, 
                token
            }: any = payload;
            const response = await apiAxiosInstance.put("/tasks/sub/progress/update",
                {
                    id, 
                    process, 
                    task_assignment_id, 
                    status, 
                },
                {
                  headers: {
                    Authorization: `Bearer ${token}`,
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


export const getListTaskAssign = createAsyncThunk(
    "task/getListTaskAssign",
    async (payload: any, thunkAPI) => {
        try {
            const {limit, page, id, token} = payload;
            const params = Object.fromEntries(
                Object.entries({ limit,page,id }).filter(
                    ([key, value]) => value != null
                )
            );
            const response = await apiAxiosInstance.get("/tasks/assign",
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


export const checkedTask = createAsyncThunk(
    "task/checkedTask",
    async (payload: any, thunkAPI) => {
        try {
            const {id, task_id, token} = payload;

            const response = await apiAxiosInstance.put("/tasks/checked",
                {
                    id, 
                    task_id
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

export const rejectTask = createAsyncThunk(
    "task/rejectTask",
    async (payload: any, thunkAPI) => {
        try {
            const {id, task_id, date_end, reason, token} = payload;

            const response = await apiAxiosInstance.put("/tasks/reject",
                {
                    id, 
                    task_id,
                    date_end, 
                    reason
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


export const getDetailListTaskAssign = createAsyncThunk(
    "task/getDetailListTaskAssign",
    async (payload: any, thunkAPI) => {
        try {
            const {limit, page, id, token} = payload;
            const params = Object.fromEntries(
                Object.entries({ limit, page, id }).filter(
                    ([key, value]) => value != null
                )
            );
            const response = await apiAxiosInstance.get("/tasks/created",
                {
                    params,
                    headers: {
                        Authorization: `Bearer ${token}`
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


export const deleteTaskAssign = createAsyncThunk(
    "task/deleteTaskAssign",
    async (payload: any, thunkAPI) => {
        try {
            const {id, token} = payload;

            const response = await apiAxiosInstance.delete("/tasks/delete",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    },
                    data: {
                        id: id,
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


export const updateTaskAssign = createAsyncThunk(
    "task/updateTaskAssign",
    async (payload: any, thunkAPI) => {
      try {
        const {
            id,
            name,
            description,
            type_task,
            date_start,
            date_end,
            task_priority,
            project_id,
            kpi_item_id,
            min_count_reject,
            max_count_reject,
            employees,
            token,
        } = payload;
  
        const response = await apiAxiosInstance.put(
          "/tasks/update",
          {
            id,
            name,
            description,
            type_task,
            date_start,
            date_end,
            task_priority,
            project_id,
            kpi_item_id,
            min_count_reject,
            max_count_reject,
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


  














