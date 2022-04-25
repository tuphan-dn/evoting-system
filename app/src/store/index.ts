import { configureStore } from "@reduxjs/toolkit";
import walletReducer from "./wallet.reducer";

export const store = configureStore({
  reducer: {
    wallet: walletReducer
  }
});

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
