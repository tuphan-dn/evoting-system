import { useSelector } from 'react-redux'

import { Card, Col, Row } from 'antd'
import TokenAccounts from './tokenAccounts'

import { AppState } from '../store'

const WalletInfo = () => {
  const {
    wallet: { walletAddress, balance },
  } = useSelector((state: AppState) => state)

  return (
    <Card title="Wallet Info">
      <Row gutter={[24, 24]}>
        {/* Wallet address */}
        <Col span={24}>
          <Row gutter={[12, 12]}>
            <Col>Wallet Address:</Col>
            <Col>{walletAddress}</Col>
          </Row>
        </Col>
        {/* Wallet balance */}
        <Col span={24}>
          <Row gutter={[12, 12]}>
            <Col>Balance:</Col>
            <Col>{balance}</Col>
          </Row>
        </Col>
        {/* Token Account */}
        <Col span={24}>
          <TokenAccounts />
        </Col>
      </Row>
    </Card>
  )
}

export default WalletInfo
