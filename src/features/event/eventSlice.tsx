import { createSlice } from "@reduxjs/toolkit";
import {
    getTypeEvent,
    getListEvent,
    eventReminder
} from "../../services/api";
import { createAsyncReducer2 } from "@/src/utils/createAsyncReducer";

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
    reminder: initState<EventMessage>;
}



const initialState: EventState = {
    typeEvent: { data: [], loading: false, error: null, status: null },
    listEvent: { data: { calendar_events: [], pagination_events: [] }, loading: false, error: null, status: null },
    reminder: { data: { message: null }, loading: false, error: null, status: null },
    
};


const eventSlice = createSlice({
    name: "event",
    initialState: initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        createAsyncReducer2(builder, getTypeEvent, "typeEvent");
        createAsyncReducer2(builder, getListEvent, "listEvent");
        createAsyncReducer2(builder, eventReminder, "reminder");


        // eventReminder
    },
});

export const {  } = eventSlice.actions;
export default eventSlice.reducer;
