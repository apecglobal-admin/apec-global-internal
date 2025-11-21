import { createSlice } from "@reduxjs/toolkit";
import {
    getTypeEvent,
    getListEvent,
    eventReminder,
    getListTimeLine,
    getStatEvent
} from "./api/api";
import { createAsyncReducer } from "@/src/utils/createAsyncReducer";
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
}

const createInitState = () => ({ data: [], loading: false, error: null, status: null });


const initialState: EventState = {
    typeEvent: createInitState(),
    listEvent: { data: { calendar_events: [], pagination_events: [] }, loading: false, error: null, status: null },
    listTimeLine: createInitState(),
    stateEvent: createInitState(),
    reminder: { data: { message: null }, loading: false, error: null, status: null },
    
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

        
    },
});

export const {  } = eventSlice.actions;
export default eventSlice.reducer;
