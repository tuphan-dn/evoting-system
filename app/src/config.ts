import * as anchor from '@project-serum/anchor'
import { clusterApiUrl } from '@solana/web3.js';
import idl from './idl.json'

export const preflightCommitment = 'processed'
export const programID = new anchor.web3.PublicKey(idl.metadata.address)
// export const network = 'http://127.0.0.1:8899'
export const network = clusterApiUrl("devnet");
export { idl }

export const getProvider = (wallet: any) => {
  const connection = new anchor.web3.Connection(network, preflightCommitment)
  // @ts-ignore
  return new anchor.Provider(connection, wallet, {
    preflightCommitment: preflightCommitment,
  })
}

export const getProgram = (wallet: any) => {
  const provider = getProvider(wallet)
  return new anchor.Program(idl as anchor.Idl, programID, provider)
}
