import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export type WalletState ={
  walletAddress: string;
  balance: number;
}

const initialState: WalletState = {
  walletAddress: "",
  balance: 0
};

export const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setWalletInfo: (state, action: PayloadAction<WalletState>) => {
      state.walletAddress = action.payload.walletAddress;
      state.balance = action.payload.balance;
    }
  }
});

export const { setWalletInfo } = walletSlice.actions;

export default walletSlice.reducer;
