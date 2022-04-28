import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useWalletKit, useSolana, useConnectedWallet } from '@gokiprotocol/walletkit'

import { Button, Col, Layout, Row, Space, Typography } from 'antd'
import ListCandidates from 'view/listCandidates'
import CreateCandidate from 'view/createCandidate'

import { setWalletInfo, WalletState } from 'store/wallet.reducer'
import { AppDispatch } from 'store'

function App() {
  const dispatch = useDispatch<AppDispatch>()
  const wallet = useConnectedWallet()
  const { connect } = useWalletKit()
  const { disconnect, providerMut } = useSolana()

  const fetchWalletInfo = useCallback(async () => {
    if (!wallet || !providerMut) return
    const lamports = await providerMut.connection.getBalance(wallet.publicKey)
    let walletInfo: WalletState = {
      walletAddress: wallet.publicKey.toBase58(),
      balance: lamports,
    }
    dispatch(setWalletInfo(walletInfo))
  }, [providerMut, wallet])

  useEffect(() => {
    fetchWalletInfo()
  }, [fetchWalletInfo])

  return (
    <Layout style={{ height: '100vh' }}>
      <Layout.Header>
        <Col span={24}>
          {wallet ? (
            <Space>
              <Button type="primary" onClick={disconnect}>
                Disconnect
              </Button>
              <Typography.Text style={{ color: 'white' }}>
                {wallet.publicKey.toBase58()}
              </Typography.Text>
            </Space>
          ) : (
            <Button type="primary" onClick={connect}>
              Connect Wallet
            </Button>
          )}
        </Col>
      </Layout.Header>
      <Layout.Content style={{ padding: 40 }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Row gutter={[24, 24]}>
              <Col flex="auto">
                <Typography.Title>List of Candidates</Typography.Title>
              </Col>
              <Col>
                <CreateCandidate />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <ListCandidates />
          </Col>
        </Row>
      </Layout.Content>
    </Layout>
  )
}

export default App
