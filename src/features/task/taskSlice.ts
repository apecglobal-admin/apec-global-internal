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

} from "./api";
import { createAsyncReducer } from "@/src/utils/createAsyncReducer";
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
};

const taskSlice = createSlice({
    name: "task",
    initialState: initialState,

    reducers: {

    },
    extraReducers: (builder) => {
        createAsyncReducer(builder, createTask);
        createAsyncReducer(builder, createSubTask);

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
        createAsyncReducer(builder, updateProgressTask);
        createAsyncReducer(builder, getSubTask, "listSubTask");
        createAsyncReducer(builder, updateProgressSubTask);
        createAsyncReducer(builder, getListTaskAssign, "listTaskAssign");
    },
});

export const {  } = taskSlice.actions;
export default taskSlice.reducer;
