import { configureStore } from "@reduxjs/toolkit";
import { profileApi } from "./profileApi";
export const store = configureStore({
  reducer: {
    [profileApi.reducerPath]: profileApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(profileApi.middleware),
});
