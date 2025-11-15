import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session";
import fireReducer from "./fireSlice";

const persistConfig = {
  key: "fire",
  storage: sessionStorage,
  whitelist: ["fireData"],
};

const persistedFireReducer = persistReducer(persistConfig, fireReducer);

export const store = configureStore({
  reducer: {
    fire: persistedFireReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
