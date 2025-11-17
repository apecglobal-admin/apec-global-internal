import { createSlice } from "@reduxjs/toolkit";
import {
    getListAnnouncement,
    getTypeAnnouncement,
    readAnnoucement
} from "./api/api";
import { createAsyncReducer } from "@/src/utils/createAsyncReducer";

const announcementSlice = createSlice({
    name: "announcement",
    initialState: {
        typeAnnouncements: { data: [], loading: false, error: null, status: null },
        listAnnouncement: { data: [], loading: false, error: null, status: null },
        annoucement: { data: { message: null }, loading: false, error: null, status: null }
    },

    reducers: {

    },
    extraReducers: (builder) => {
        createAsyncReducer(builder, getTypeAnnouncement, "typeAnnouncements");
        createAsyncReducer(builder, getListAnnouncement, "listAnnouncement");
        createAsyncReducer(builder, readAnnoucement, "annoucement");

        
    },
});

export const {  } = announcementSlice.actions;
export default announcementSlice.reducer;
