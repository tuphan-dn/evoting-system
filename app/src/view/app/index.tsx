import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useWalletKit, useSolana, useConnectedWallet } from '@gokiprotocol/walletkit'

import { Button, Col, Row, Space } from 'antd'
import WalletInfo from 'components/walletInfo'
import ListCandidates from 'view/listCandidates'

import { setWalletInfo, WalletState } from 'store/wallet.reducer'
import { AppDispatch } from 'store'

function App() {
  const dispatch = useDispatch<AppDispatch>()
  const wallet = useConnectedWallet()
  const { connect } = useWalletKit()
  const { disconnect, providerMut } = useSolana()

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
    <Row justify="center" gutter={[24, 24]}>
      <Col md={12} xs={22}>
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <WalletInfo />
          </Col>
          {/* Button connect wallet */}
          <Col span={24} style={{ textAlign: 'center' }}>
            {wallet ? (
              <Space>
                <Button type="primary" style={{ borderRadius: 40 }} onClick={disconnect}>
                  Disconnect
                </Button>
              </Space>
            ) : (
              // Call connectWallet function when click Button
              <Button type="primary" style={{ borderRadius: 40 }} onClick={connect}>
                Connect Wallet
              </Button>
            )}
          </Col>
          <Col span={24}>
            <ListCandidates />
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default App
