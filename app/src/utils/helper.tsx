import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token'
import { Connection, PublicKey } from '@solana/web3.js'
import * as config from '../config'

const connection = new Connection(config.network, 'confirmed')

export const viewAllTokenOwner = async (ownerAddress: string) => {
  const tokenAccounts = await connection.getTokenAccountsByOwner(
    new PublicKey(ownerAddress),
    {
      programId: TOKEN_PROGRAM_ID,
    },
  )

  console.log('Token                                         Balance')
  console.log('------------------------------------------------------------')
  tokenAccounts.value.forEach((e) => {
    const accountInfo = AccountLayout.decode(e.account.data)
    console.log(`${new PublicKey(accountInfo.mint)}   ${accountInfo.amount}`)
  })
}
