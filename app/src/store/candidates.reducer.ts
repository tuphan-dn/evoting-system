import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CandidateData } from 'config'

export type CandidatesState = Record<string, CandidateData>

const initialState: CandidatesState = {}

export const candidateSlice = createSlice({
  name: 'candidates',
  initialState,
  reducers: {
    setCandidates: (state, action: PayloadAction<CandidatesState>) => {
      return action.payload
    },
  },
})

export const { setCandidates } = candidateSlice.actions

export default candidateSlice.reducer
