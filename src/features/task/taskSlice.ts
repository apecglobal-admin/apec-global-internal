import { createSlice } from "@reduxjs/toolkit";
import {
    createTask,
    getTypeTask,
    getPriorityTask,
    getListProject,
    getChildKpi,
    getListEmployee,
    getStatusTask,
    getListPosition,
    getListDepartment,
    uploadFileTask,
    uploadImageTask,
    updateProgressTask,
    createSubTask,
    getSubTask,
    updateProgressSubTask,
    getListTaskAssign,
    rejectTask,
    getDetailListTaskAssign,
    deleteTaskAssign,
    updateTaskAssign,
    getSupportTaskTypes,
    createSupportTask,
    getSupportTask,
    getSupportTaskManager,
    getSupportTaskEmployee,
    supportTaskAccept,
    supportTaskReject,
    supportTaskDelete,
    getSupportTaskPending,
    supportTaskConfirm,
    supportTaskChecked,
    getSupportTaskStatus
} from "./api";
import { createAsyncReducer, createAsyncReducerDynamic } from "@/src/utils/createAsyncReducer";
import { initState } from "@/src/services/interface";

interface EventMessage{
    message: string | null;
}

interface TaskState {
    typeTask: initState<any[]>;
    priorityTask: initState<any[]>;
    childKpi: initState<any[]>;
    statusTask: initState<any[]>;
    listProject: initState<any[]>;
    listEmployee: initState<any[]>;
    listDepartment: initState<any[]>;
    listPosition: initState<any[]>;
    imageTask: initState<any[]>;
    fileTask: initState<any[]>;
    listSubTask: initState<any[]>;
    listTaskAssign: initState<any[]>;
    listDetailTaskAssign: initState<any[]>;
    detailTaskAssign: initState<any[]>;
    supportTaskTypes: initState<any[]>;
    supportTask: initState<any[]>;
    detailSupportTask: initState<any[]>;
    supportTaskManager: initState<any[]>;
    detailSupportTaskManager: initState<any[]>;
    supportTaskEmployee: initState<any[]>;
    detailSupportTaskEmployee: initState<any[]>;
    supportTaskPending: initState<any[]>;
    detailSupportTaskPending: initState<any[]>;
    supportTaskStatus:  initState<any[]>;

}

const createInitState = () => ({ data: [], loading: false, error: null, status: null });



const initialState: TaskState = {
    typeTask: createInitState(),
    priorityTask: createInitState(),
    childKpi: createInitState(),
    statusTask: createInitState(),
    listProject: createInitState(),
    listEmployee: createInitState(),
    listDepartment: createInitState(),
    listPosition: createInitState(),
    imageTask: createInitState(),
    fileTask: createInitState(),
    listSubTask: createInitState(),
    listTaskAssign: createInitState(),
    listDetailTaskAssign: createInitState(),
    detailTaskAssign: createInitState(),
    supportTaskTypes: createInitState(),
    supportTask: createInitState(),
    detailSupportTask: createInitState(),
    supportTaskManager: createInitState(),
    detailSupportTaskManager: createInitState(),
    supportTaskEmployee: createInitState(),
    detailSupportTaskEmployee: createInitState(),
    supportTaskPending: createInitState(),
    detailSupportTaskPending: createInitState(),
    supportTaskStatus:  createInitState(),
};

const taskSlice = createSlice({
    name: "task",
    initialState: initialState,

    reducers: {
        
    },
    extraReducers: (builder) => {
        createAsyncReducer(builder, createTask);
        createAsyncReducer(builder, createSubTask);
        createAsyncReducer(builder, rejectTask);
        createAsyncReducer(builder, updateProgressTask);
        createAsyncReducer(builder, updateProgressSubTask);
        createAsyncReducer(builder, deleteTaskAssign);
        createAsyncReducer(builder, updateTaskAssign);
        createAsyncReducer(builder, createSupportTask);
        createAsyncReducer(builder, supportTaskAccept);
        createAsyncReducer(builder, supportTaskReject);
        createAsyncReducer(builder, supportTaskDelete);
        createAsyncReducer(builder, supportTaskConfirm);
        createAsyncReducer(builder, supportTaskChecked);

        
        
        
        createAsyncReducer(builder, getTypeTask, "typeTask");
        createAsyncReducer(builder, getPriorityTask, "priorityTask");
        createAsyncReducer(builder, getListProject, "listProject");
        createAsyncReducer(builder, getChildKpi, "childKpi");
        createAsyncReducer(builder, getListEmployee, "listEmployee");
        createAsyncReducer(builder, getStatusTask, "statusTask");
        createAsyncReducer(builder, getListDepartment, "listDepartment");
        createAsyncReducer(builder, getListPosition, "listPosition");
        createAsyncReducer(builder, uploadImageTask, "imageTask");
        createAsyncReducer(builder, uploadFileTask, "fileTask");
        createAsyncReducer(builder, getSubTask, "listSubTask");
        createAsyncReducer(builder, getListTaskAssign, "listTaskAssign");
        createAsyncReducerDynamic(builder, getDetailListTaskAssign);
        createAsyncReducer(builder, getSupportTaskTypes, "supportTaskTypes");
        createAsyncReducerDynamic(builder, getSupportTask);
        createAsyncReducerDynamic(builder, getSupportTaskManager);
        createAsyncReducerDynamic(builder, getSupportTaskEmployee);
        createAsyncReducerDynamic(builder, getSupportTaskPending);

        createAsyncReducer(builder, getSupportTaskStatus, "supportTaskStatus");
        
        

        

        

        

        

        
    },
});

export const {  } = taskSlice.actions;
export default taskSlice.reducer;


