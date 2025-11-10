import { createSlice } from "@reduxjs/toolkit";
import { fetchUserInfo, listAchievements, listCard, listDepartments, listLink, listPositions, listProjects, listTypePersonal, listTypeTask, loginWeb, personalRequest, personCareer, personTasks, uploadAvatar } from "../../services/api";

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    departments: [],
    positions: [],
    careers: [],
    tasks: [],
    typeTask: [],
    personals: [],
    typePersonal: [],
    achievements: [],
    projects: null,
    cards: [],
    links: [],
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
         state.status = "succeeded"
        state.loading = false;
        state.userInfo = action.payload;
      })
      .addCase(fetchUserInfo.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading"
      })
      .addCase(fetchUserInfo.rejected, (state, action: any) => {
        state.status = "failed"
        state.loading = false;
        state.error = action.payload?.message
      })

      .addCase(listPositions.fulfilled, (state, action) => {
         state.status = "succeeded"
        state.loading = false;
        state.positions = action.payload;
      })
      .addCase(listPositions.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading"
      })
      .addCase(listPositions.rejected, (state, action: any) => {
        state.status = "failed"
        state.loading = false;
        state.error = action.payload?.message
      })

      .addCase(listDepartments.fulfilled, (state, action) => {
         state.status = "succeeded"
        state.loading = false;
        state.departments = action.payload;
      })
      .addCase(listDepartments.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading"
      })
      .addCase(listDepartments.rejected, (state, action: any) => {
        state.status = "failed"
        state.loading = false;
        state.error = action.payload?.message
      })

      .addCase(personCareer.fulfilled, (state, action) => {
         state.status = "succeeded"
        state.loading = false;
        state.careers = action.payload;
      })
      .addCase(personCareer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading"
      })
      .addCase(personCareer.rejected, (state, action: any) => {
        state.status = "failed"
        state.loading = false;
        state.error = action.payload?.message
      })

      .addCase(personTasks.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(personTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading"
      })
      .addCase(personTasks.rejected, (state, action: any) => {
        state.status = "failed"
        state.loading = false;
        state.error = action.payload?.message
      })

      .addCase(listTypeTask.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.loading = false;
        state.typeTask = action.payload;
      })
      .addCase(listTypeTask.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading"
      })
      .addCase(listTypeTask.rejected, (state, action: any) => {
        state.status = "failed"
        state.loading = false;
        state.error = action.payload?.message
      })

      .addCase(personalRequest.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.loading = false;
        state.personals = action.payload;
      })
      .addCase(personalRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading"
      })
      .addCase(personalRequest.rejected, (state, action: any) => {
        state.status = "failed"
        state.loading = false;
        state.error = action.payload?.message
      })

      .addCase(listTypePersonal.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.loading = false;
        state.typePersonal = action.payload;
      })
      .addCase(listTypePersonal.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading"
      })
      .addCase(listTypePersonal.rejected, (state, action: any) => {
        state.status = "failed"
        state.loading = false;
        state.error = action.payload?.message
      })

      .addCase(listAchievements.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.loading = false;
        state.achievements = action.payload;
      })
      .addCase(listAchievements.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading"
      })
      .addCase(listAchievements.rejected, (state, action: any) => {
        state.status = "failed"
        state.loading = false;
        state.error = action.payload?.message
      })

      .addCase(listProjects.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(listProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading"
      })
      .addCase(listProjects.rejected, (state, action: any) => {
        state.status = "failed"
        state.loading = false;
        state.error = action.payload?.message
      })

      .addCase(listCard.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.loading = false;
        state.cards = action.payload;
      })
      .addCase(listCard.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading"
      })
      .addCase(listCard.rejected, (state, action: any) => {
        state.status = "failed"
        state.loading = false;
        state.error = action.payload?.message
      })

      .addCase(listLink.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.loading = false;
        state.links = action.payload;
      })
      .addCase(listLink.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading"
      })
      .addCase(listLink.rejected, (state, action: any) => {
        state.status = "failed"
        state.loading = false;
        state.error = action.payload?.message
      })

      .addCase(uploadAvatar.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.status = "loading"
      })
      .addCase(uploadAvatar.rejected, (state, action: any) => {
        state.status = "failed"
        state.loading = false;
        state.error = action.payload?.message
      })
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
