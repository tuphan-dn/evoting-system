import { useCallback, useEffect, useState } from 'react'
import { useConnectedWallet, useSolana } from '@saberhq/use-solana'

import { Col, Row, Table } from 'antd'

import { AccountLayout, TOKEN_PROGRAM_ID } from '@solana/spl-token'

type TokenAccountData = {
  mint: string
  amount: number
}

const COLUMNS = [
  {
    title: 'mint',
    dataIndex: 'mint',
  },
  {
    title: 'amount',
    dataIndex: 'amount',
  },
]

const TokenAccounts = () => {
  const [tokenAccounts, setTokenAccounts] = useState<TokenAccountData[]>([])
  const wallet = useConnectedWallet()
  const { providerMut } = useSolana()

  const fetchTokenAccounts = useCallback(async () => {
    if (!wallet || !providerMut) return
    const accountsData = await providerMut.connection.getTokenAccountsByOwner(wallet.publicKey, {
      programId: TOKEN_PROGRAM_ID,
    })
    const tokenAccounts: TokenAccountData[] = accountsData.value.map((val) => {
      const { mint, amount } = AccountLayout.decode(val.account.data)
      return {
        mint: mint.toBase58(),
        amount: Number(amount.toString()),
      }
    })
    setTokenAccounts(tokenAccounts)
  }, [wallet])

  useEffect(() => {
    fetchTokenAccounts()
  }, [fetchTokenAccounts])

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Table
          dataSource={tokenAccounts}
          columns={COLUMNS}
          rowKey="mint"
          pagination={{ pageSize: 3 }}
        />
      </Col>
    </Row>
  )
}

export default TokenAccounts
