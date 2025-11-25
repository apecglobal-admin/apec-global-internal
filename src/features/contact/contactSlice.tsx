
import { createSlice } from "@reduxjs/toolkit";
import {
    getContact,
    postContact
} from "./api/api";
import { createAsyncReducer } from "@/src/utils/createAsyncReducer";
import { initState } from "@/src/services/interface";

interface ContactState {
    listContact: initState<any[]>;
}
const createInitState = () => ({ data: [], loading: false, error: null, status: null });


const initialState: ContactState = {
    listContact: createInitState(),
};


const contactSlice = createSlice({
    name: "contact",
    initialState: initialState,

    reducers: {

    },
    extraReducers: (builder) => {
        createAsyncReducer(builder, postContact);
        createAsyncReducer(builder, getContact, "listContact");

    },
});

export const {  } = contactSlice.actions;
export default contactSlice.reducer;
