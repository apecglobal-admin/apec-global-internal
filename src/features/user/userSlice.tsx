import { createSlice } from "@reduxjs/toolkit";
import { fetchUserInfo, loginWeb } from "../../services/api";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    loading: false,
    error: null,
    status: "idle"
  },

  reducers: {
    logout: (state) => {
      state.userInfo = null;
      state.loading = false;
      state.error = null;
      state.status = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(loginWeb.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading"
      })
      .addCase(loginWeb.fulfilled, (state) => {
        state.status = "succeeded"
        state.loading = false;
        state.error = null;
        
      })
      .addCase(loginWeb.rejected, (state, action: any) => {
        state.status = "failed"
        state.loading = false;
        state.error = action.payload?.message
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
      });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
