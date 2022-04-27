import { Button, Col, Row, Space, Typography } from 'antd'
import CandidateDetail from './candidateDetail'
import NewCandidateBtn from './newCandidateBtn'
import { useConnectedWallet } from '@gokiprotocol/walletkit'
import * as config from '../../config'
import * as anchor from '@project-serum/anchor'
import { useState } from 'react'

export type Candidate = {
  candidateAddress: anchor.web3.PublicKey
  amount: anchor.BN
  startDate: anchor.BN
  endDate: anchor.BN
  mint: anchor.web3.PublicKey
}

const ListCandidates = () => {
  const wallet = useConnectedWallet()
  const [listCandidates, setListCandidates] = useState<Candidate[]>()

  const fetchCandidates = async () => {
    if (!wallet) return
    const program = config.getProgram(wallet)
    // const [pda, bump] = await anchor.web3.PublicKey.findProgramAddress(
    //   [Buffer.from('treasurer'), wallet?.publicKey.toBuffer()],
    //   config.programID,
    // )

    try {
      const candidates = await program.account.candidate.all()
      let newCandidateList = candidates.map((item) => {
        let candidate: Candidate = {
          amount: item.account.amount,
          candidateAddress: item.publicKey,
          endDate: item.account.endDate,
          startDate: item.account.startDate,
          mint: item.account.mint,
        }
        return candidate
      })
      setListCandidates(newCandidateList)
      console.log('List Candidates: ', newCandidateList)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Row gutter={[24, 24]} justify="space-between">
          <Col>
            <Typography.Title level={3}>List candidates</Typography.Title>
          </Col>
          <Col>
            <Space>
              <Button
                type="primary"
                style={{ borderRadius: 40 }}
                onClick={fetchCandidates}
              >
                Fetch List Candidate
              </Button>
              <NewCandidateBtn />
            </Space>
          </Col>
        </Row>
      </Col>

      {listCandidates?.map((candidate: Candidate) => {
        return (
          <Col span={24} key={candidate.candidateAddress.toBase58()}>
            <CandidateDetail candidate={candidate} />
          </Col>
        )
      })}
    </Row>
  )
}

export default ListCandidates
