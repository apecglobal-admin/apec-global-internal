import { createSlice } from "@reduxjs/toolkit";
import {
    getTypeEvent,
    getListEvent,
    eventReminder,
    getListTimeLine,
    getStatEvent
} from "./api/api";
import { createAsyncReducer } from "@/src/utils/createAsyncReducer";

interface initState<T> {
    data: T;
    loading: boolean;
    error: string | null;
    status: number | null;
}

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



const initialState: EventState = {
    typeEvent: { data: [], loading: false, error: null, status: null },
    listEvent: { data: { calendar_events: [], pagination_events: [] }, loading: false, error: null, status: null },
    listTimeLine: { data: [], loading: false, error: null, status: null },
    stateEvent: { data: [], loading: false, error: null, status: null },
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
