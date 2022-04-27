import * as anchor from '@project-serum/anchor'
import { IdlAccounts } from '@project-serum/anchor'
import { clusterApiUrl } from '@solana/web3.js'
import { L6, IDL } from './idl'

export const DEFAULT_COMMITMENT = 'confirmed'
export const DEFAULT_CLUSTER = 'devnet'
export const PROGRAM_ADDRESS = new anchor.web3.PublicKey(
  'HCoUastFpW7wB9Ue4o4YHy27VTuiJEo7h9hKmhnXDQhD',
)
export const NODE_URL = clusterApiUrl(DEFAULT_CLUSTER)

export type CandidateData = {
  address: string
  mint: string
  amount: number
  startTime: number
  endTime: number
}

// Function support
export const getProvider = (wallet: any) => {
  const connection = new anchor.web3.Connection(NODE_URL, DEFAULT_COMMITMENT)
  return new anchor.Provider(connection, wallet, {
    preflightCommitment: DEFAULT_COMMITMENT,
  })
}

export const getProgram = (wallet: any) => {
  const provider = getProvider(wallet)
  anchor.setProvider(provider)
  return new anchor.Program(IDL, PROGRAM_ADDRESS)
}
