import { useCallback, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import {
  useWalletKit,
  useSolana,
  useConnectedWallet,
} from '@gokiprotocol/walletkit'

import { Button, Col, Row } from 'antd'
import WalletInfo from './components/walletInfo'

import './App.css'
import { setWalletInfo, WalletState } from './store/wallet.reducer'
import { AppDispatch } from './store'

import ListCandidates from './view/listCandidates'

function App() {
  // Goki hooks
  const wallet = useConnectedWallet()
  const { connect } = useWalletKit()
  const { disconnect, providerMut } = useSolana()
  const dispatch = useDispatch<AppDispatch>()

  const fetchBalance = useCallback(async () => {
    // TODO: fetch balance

    let walletInfo: WalletState = {
      walletAddress: wallet?.publicKey.toBase58() || '',
      balance: 0,
    }
    if (wallet && providerMut) {
      walletInfo.balance = await providerMut.connection.getBalance(
        wallet.publicKey,
      )
    }
    dispatch(setWalletInfo(walletInfo))
  }, [providerMut, wallet])

  useEffect(() => {
    fetchBalance()
  }, [fetchBalance])

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
              <Button
                type="primary"
                style={{ borderRadius: 40 }}
                onClick={disconnect}
              >
                Disconnect
              </Button>
            ) : (
              // Call connectWallet function when click Button
              <Button
                type="primary"
                style={{ borderRadius: 40 }}
                onClick={connect}
              >
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
