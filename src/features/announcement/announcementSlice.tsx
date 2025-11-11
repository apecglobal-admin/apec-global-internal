import { createSlice } from "@reduxjs/toolkit";
import {
    getTypeAnnouncement
} from "../../services/api";
import { createAsyncReducer } from "@/src/utils/createAsyncReducer";

const announcementSlice = createSlice({
    name: "announcement",
    initialState: {
        typeAnnouncements: [],
        loading: false,
        error: null,
        status: "idle",
    },

    reducers: {

    },
    extraReducers: (builder) => {
        createAsyncReducer(builder, getTypeAnnouncement, "typeAnnouncements");
    },
});

export const {  } = announcementSlice.actions;
export default announcementSlice.reducer;
