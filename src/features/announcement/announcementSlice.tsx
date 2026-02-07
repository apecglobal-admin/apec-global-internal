import { createSlice } from "@reduxjs/toolkit";
import {
    getListAnnouncement,
    getTypeAnnouncement,
    readAnnoucement,
    getSlider
} from "./api/api";
import { createAsyncReducer, createAsyncReducerDynamic } from "@/src/utils/createAsyncReducer";
import { initState } from "@/src/services/interface";

interface EventMessage{
    message: string | null;
}

interface AnnouncementState {
    slider: initState<any[]>;
    typeAnnouncements: initState<any[]>;
    listAnnouncement: initState<any[]>;
    annoucement: initState<EventMessage>;
    detailAnnouncement: initState<any[]>;
}

const createInitState = () => ({ data: [], loading: false, error: null, status: null });



const initialState: AnnouncementState = {
    slider: createInitState(),
    typeAnnouncements: createInitState(),
    listAnnouncement: createInitState(),
    annoucement: { data: { message: null }, loading: false, error: null, status: null },
    detailAnnouncement: createInitState(),
};

const announcementSlice = createSlice({
    name: "announcement",
    initialState: initialState,

    reducers: {

    },
    extraReducers: (builder) => {
        createAsyncReducer(builder, getTypeAnnouncement, "typeAnnouncements");
        // createAsyncReducer(builder, getListAnnouncement, "listAnnouncement");
        createAsyncReducer(builder, readAnnoucement, "annoucement");
        createAsyncReducer(builder, getSlider, "slider");
        createAsyncReducerDynamic(builder, getListAnnouncement)
        
        
    },
});

export const {  } = announcementSlice.actions;
export default announcementSlice.reducer;
