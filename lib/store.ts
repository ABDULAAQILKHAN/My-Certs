import { configureStore } from "@reduxjs/toolkit"
import { setupListeners } from "@reduxjs/toolkit/query"
import { mockAuthApi } from "./api/mockAuthApi"
import { mockCertificatesApi } from "./api/mockCertificatesApi"
import authReducer from "./slices/authSlice"
import themeReducer from "./slices/themeSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    [mockAuthApi.reducerPath]: mockAuthApi.reducer,
    [mockCertificatesApi.reducerPath]: mockCertificatesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(mockAuthApi.middleware, mockCertificatesApi.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
