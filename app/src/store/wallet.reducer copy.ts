import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import * as anchor from '@project-serum/anchor'

export interface CandatidateState {
  candidateAddress?: anchor.web3.PublicKey
  amount?: anchor.BN
  startDate?: anchor.BN
  endDate?: anchor.BN
  mint?: anchor.web3.PublicKey
}

const initialState: CandatidateState = {}

export const candidateSlice = createSlice({
  name: 'candidate',
  initialState,
  reducers: {
    setCandidateInfo: (state, action: PayloadAction<CandatidateState>) => {
      state.candidateAddress = action.payload.candidateAddress
      state.amount = action.payload.amount
      state.startDate = action.payload.startDate
      state.endDate = action.payload.endDate
      state.mint = action.payload.mint
    },
  },
})

export const { setCandidateInfo } = candidateSlice.actions

export default candidateSlice.reducer
