import { useDispatch, useSelector } from 'react-redux'
import { useConnectedWallet } from '@gokiprotocol/walletkit'

import { Button, Col, Row, Space, Typography, notification } from 'antd'
import CandidateDetail from './candidateDetail'
import NewCandidateBtn from './newCandidateBtn'

import { CandidateData, getProgram } from 'config'
import { setCandidates } from 'store/candidates.reducer'
import { AppState } from 'store'

const ListCandidates = () => {
  const { candidates } = useSelector((state: AppState) => state)
  const dispatch = useDispatch()
  const wallet = useConnectedWallet()

  const fetchCandidates = async () => {
    if (!wallet) return
    const program = getProgram(wallet)
    try {
      const accountsData = await program.account.candidate.all()
      const newCandidates: Record<string, CandidateData> = {}
      for (const accountData of accountsData) {
        newCandidates[accountData.publicKey.toBase58()] = accountData.account
      }
      dispatch(setCandidates(newCandidates))
    } catch (error: any) {
      notification.error({ message: error.message })
    }
  }

  console.log('candidates', candidates)
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Row gutter={[24, 24]} justify="space-between">
          <Col>
            <Typography.Title level={3}>List candidates</Typography.Title>
          </Col>
          <Col>
            <Space>
              <Button type="primary" style={{ borderRadius: 40 }} onClick={fetchCandidates}>
                Fetch List Candidate
              </Button>
              <NewCandidateBtn />
            </Space>
          </Col>
        </Row>
      </Col>

      {Object.keys(candidates).map((address) => {
        return (
          <Col span={24} key={address}>
            <CandidateDetail candidateAddress={address} />
          </Col>
        )
      })}
    </Row>
  )
}

export default ListCandidates
