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

// import { configureStore } from '@reduxjs/toolkit';
// import { setupListeners } from '@reduxjs/toolkit/query';
// import { mockAuthApi } from './api/mockAuthApi';
// import { mockCertificatesApi } from './api/mockCertificatesApi';
// import authReducer from './slices/authSlice';
// import themeReducer from './slices/themeSlice';
// import {
//   persistStore,
//   persistReducer,
//   FLUSH,
//   REHYDRATE,
//   PAUSE,
//   PERSIST,
//   PURGE,
//   REGISTER,
// } from 'redux-persist';
// import storage from 'redux-persist/lib/storage'; // defaults to localStorage
// import { Persistor } from 'redux-persist';

// // Custom storage to handle SSR
// const createWebStorage = () => {
//   if (typeof window !== 'undefined') {
//     return storage; // Use localStorage in browser
//   }
//   // Fallback for SSR (noop storage)
//   return {
//     getItem: async () => null,
//     setItem: async () => {},
//     removeItem: async () => {},
//   };
// };

// // Persist configuration
// const persistConfig = {
//   key: 'root',
//   storage: createWebStorage(),
//   whitelist: ['auth', 'theme'], // Persist only these reducers
// };

// // Create persisted reducers
// const persistedAuthReducer = persistReducer(persistConfig, authReducer);
// const persistedThemeReducer = persistReducer(persistConfig, themeReducer);

// export const store = configureStore({
//   reducer: {
//     auth: persistedAuthReducer,
//     theme: persistedThemeReducer,
//     [mockAuthApi.reducerPath]: mockAuthApi.reducer,
//     [mockCertificatesApi.reducerPath]: mockCertificatesApi.reducer,
//   },
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: {
//         ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
//       },
//     }).concat(mockAuthApi.middleware, mockCertificatesApi.middleware),
// });

// // Set up the persistor
// export const persistor: Persistor = persistStore(store);

// // Optional: Add purge function
// export const purgePersistedState = async () => {
//   await persistor.purge();
// };

// setupListeners(store.dispatch);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;