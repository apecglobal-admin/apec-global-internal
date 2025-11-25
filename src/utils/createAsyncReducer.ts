export const createAsyncReducer = (
  builder: any,
  asyncThunk: any,
  keys?: string | string[]
) => {
  const keyList = Array.isArray(keys) ? keys : [keys];

  builder
    // ---------------- PENDING ----------------
    .addCase(asyncThunk.pending, (state: any) => {
      keyList.forEach((key) => {
        if (!key) return;
        state[key].loading = true;
        state[key].error = null;
        state[key].status = null;
      });
    })

    // ---------------- FULFILLED ----------------
    .addCase(asyncThunk.fulfilled, (state: any, action: any) => {
      const payload = action.payload || {};
      const statusCode = payload?.status ?? 200;

      keyList.forEach((key) => {
        if (!key) return;
        state[key].loading = false;
        state[key].status = statusCode;
        state[key].error = null;

        if (payload.data !== undefined) {
          state[key].data = payload.data;
        } else {
          state[key].data = payload;
        }

        Object.keys(payload).forEach((field) => {
          if (["status", "data"].includes(field)) return; // bỏ qua field chung
          state[key][field] = payload[field];
        });
      });
    })

    // ---------------- REJECTED ----------------
    .addCase(asyncThunk.rejected, (state: any, action: any) => {
      const statusCode =
        action.payload?.status ??
        action.error?.status ??
        action.error?.response?.status ??
        400;

      const errorMsg =
        action.payload?.message ||
        action.error?.message ||
        "Unknown error";

      keyList.forEach((key) => {
        if (!key) return;
        state[key].loading = false;
        state[key].error = errorMsg;
        state[key].status = statusCode;
      });
    });
};


export const createAsyncReducerDynamic = (builder: any, asyncThunk: any) => {
  builder
    // pending
    .addCase(asyncThunk.pending, (state: any, action: any) => {
      const key = action.meta.arg.key;
      if (!key) return;

      state[key].loading = true;
      state[key].error = null;
      state[key].status = null;
    })

    // fulfilled
    .addCase(asyncThunk.fulfilled, (state: any, action: any) => {
      const key = action.meta.arg.key || action.payload.key;
      if (!key) return;

      const payload = action.payload || {};
      const statusCode = payload.status ?? 200;

      state[key].loading = false;
      state[key].status = statusCode;
      state[key].error = null;

      state[key].data = payload.data ?? payload;

      // merge các field khác (giống helper cũ)
      Object.keys(payload).forEach((field) => {
        if (["status", "data", "key"].includes(field)) return;
        state[key][field] = payload[field];
      });
    })

    // rejected
    .addCase(asyncThunk.rejected, (state: any, action: any) => {
      const key = action.meta.arg.key;
      if (!key) return;

      const statusCode =
        action.payload?.status ??
        action.error?.status ??
        action.error?.response?.status ??
        400;

      const errorMsg =
        action.payload?.message ||
        action.error?.message ||
        "Unknown error";

      state[key].loading = false;
      state[key].error = errorMsg;
      state[key].status = statusCode;
    });
};
