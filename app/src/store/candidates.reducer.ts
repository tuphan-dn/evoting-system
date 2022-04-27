import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CandidateData } from 'config'

export type CandidatesState = Record<string, CandidateData>

const initialState: CandidatesState = {}

export const candidateSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    setCandidate: (state, action: PayloadAction<CandidateData>) => {
      state[action.payload.address] = action.payload
      return state
    },
  },
})

export const { setCandidate } = candidateSlice.actions

export default candidateSlice.reducer
