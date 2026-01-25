import { createSlice } from "@reduxjs/toolkit";
import {
    getTypeEvent,
    getListEvent,
    eventReminder,
    getListTimeLine,
    getStatEvent,
    getInternalTypeEvent,
    getListInternalEvent,
    getListInternalEventEmployee,
    getlevels
} from "./api/api";
import { createAsyncReducer, createAsyncReducerDynamic } from "@/src/utils/createAsyncReducer";
import { initState } from "@/src/services/interface";


interface EventData {
    calendar_events: any[];
    pagination_events: any[];
}

interface EventMessage{
    message: string | null;
}

interface EventState {
    typeEvent: initState<any[]>;
    listEvent: initState<EventData>;
    listTimeLine: initState<any[]>;
    stateEvent: initState<any[]>;
    reminder: initState<EventMessage>;
    internalTypeEvent: initState<any[]>;
    listInternalEvent: initState<any[]>;
    listInternalEventEmployee: initState<any[]>;
    detailListInternalEvent: initState<any[]>;

    levels: initState<any[]>;
}

const createInitState = () => ({ data: [], loading: false, error: null, status: null });


const initialState: EventState = {
    typeEvent: createInitState(),
    listEvent: { data: { calendar_events: [], pagination_events: [] }, loading: false, error: null, status: null },
    listTimeLine: createInitState(),
    stateEvent: createInitState(),
    reminder: { data: { message: null }, loading: false, error: null, status: null },
    internalTypeEvent: createInitState(),
    listInternalEvent: createInitState(),
    listInternalEventEmployee: createInitState(),
    detailListInternalEvent: createInitState(),
    levels: createInitState(),


};

const eventSlice = createSlice({
    name: "event",
    initialState: initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        createAsyncReducer(builder, getTypeEvent, "typeEvent");
        createAsyncReducer(builder, getListEvent, "listEvent");
        createAsyncReducer(builder, eventReminder, "reminder");
        createAsyncReducer(builder, getListTimeLine, "listTimeLine");
        createAsyncReducer(builder, getStatEvent, "stateEvent");

        createAsyncReducer(builder, getInternalTypeEvent, "internalTypeEvent");
        createAsyncReducerDynamic(builder, getListInternalEvent);
        createAsyncReducer(builder, getListInternalEventEmployee, "listInternalEventEmployee");
        createAsyncReducer(builder, getlevels, "levels");

         
        
        
    },
});

export const {  } = eventSlice.actions;
export default eventSlice.reducer;
