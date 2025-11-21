
import { createSlice } from "@reduxjs/toolkit";
import {
    postContact
} from "./api/api";
import { createAsyncReducer } from "@/src/utils/createAsyncReducer";
import { initState } from "@/src/services/interface";

interface ContactState {}

const initialState: ContactState = {};


const contactSlice = createSlice({
    name: "contact",
    initialState: initialState,

    reducers: {

    },
    extraReducers: (builder) => {
        createAsyncReducer(builder, postContact);
    },
});

export const {  } = contactSlice.actions;
export default contactSlice.reducer;
