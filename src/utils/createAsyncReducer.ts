export const createAsyncReducer = (builder: any, asyncThunk: any, key?: string) => {
    builder
      .addCase(asyncThunk.pending, (state: any) => {
        if (key) {
          state[key].loading = true;
          state[key].error = null;
          state[key].status = null;
        } else {
          state.loading = true;
          state.error = null;
          state.status = null;
        }
      })
      .addCase(asyncThunk.fulfilled, (state: any, action: any) => {
        const statusCode = action.payload?.status ?? 200;
  
        if (key) {
          state[key].loading = false;
          state[key].data = action.payload?.data ?? action.payload;
          state[key].status = statusCode;
          state[key].error = null;
        } else {
          // không update data — chỉ lưu status và error tổng thể
          state.loading = false;
          state.status = statusCode;
          state.error = null;
        }
      })
      .addCase(asyncThunk.rejected, (state: any, action: any) => {
        console.log("thunk", action.payload);
        
        const statusCode =
          action.payload?.status ??
          action.error?.status ??
          action.error?.response?.status ??
          400;
  
        const errorMsg =
          action.payload?.data?.message || "Unknown error";
  
        if (key) {
          state[key].loading = false;
          state[key].error = errorMsg;
          state[key].status = statusCode;
        } else {
          state.loading = false;
          state.error = errorMsg;
          state.status = statusCode;
        }
      });
  };