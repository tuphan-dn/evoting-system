import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useWalletKit, useSolana, useConnectedWallet } from '@gokiprotocol/walletkit'

import { Button, Col, Layout, Row, Typography } from 'antd'
import ListCandidates from 'view/listCandidates'
import CandidateCreate from 'view/candidateCreate'
import TokenAccounts from 'view/tokenAccounts'

import { setWalletInfo, WalletState } from 'store/wallet.reducer'
import { AppDispatch } from 'store'

const { Header, Content } = Layout

function App() {
  const dispatch = useDispatch<AppDispatch>()
  const wallet = useConnectedWallet()
  const { connect } = useWalletKit()
  const { providerMut } = useSolana()

  const fetchWalletInfo = useCallback(async () => {
    if (!wallet || !providerMut) return
    // TODO: fetch SOL balance
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
      <Header>
        <Col span={24}>
          {wallet ? (
            <Col span={24} style={{ color: 'white' }}>
              {wallet.publicKey.toBase58()}
            </Col>
          ) : (
            <Button type="primary" style={{ borderRadius: 40 }} onClick={connect}>
              Connect Wallet
            </Button>
          )}
        </Col>
      </Header>
      <Content style={{ padding: 40 }}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <TokenAccounts />
          </Col>
          <Col span={24}>
            <Row gutter={[24, 24]}>
              <Col flex="auto">
                <Typography.Title>List Candidates</Typography.Title>
              </Col>
              <Col>
                <CandidateCreate />
              </Col>
            </Row>
          </Col>
          <Col span={24}>
            <ListCandidates />
          </Col>
        </Row>
      </Content>
    </Layout>
  )
}

export default App
