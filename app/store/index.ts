import {configureStore} from '@reduxjs/toolkit';
import locationReducer from './locationSlice';

export const store = configureStore({
  reducer: {
    location: locationReducer,
    // Add other reducers here as needed
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values in the Redux store
        ignoredActions: [],
        ignoredActionPaths: [],
        ignoredPaths: [],
      },
    }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Export hooks for using the store in components
export * from './locationSlice';
