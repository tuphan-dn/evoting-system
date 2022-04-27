import * as anchor from '@project-serum/anchor'
import moment from 'moment'

import { Button, Card, Col, Row, Space, Typography, notification } from 'antd'

import { useConnectedWallet } from '@gokiprotocol/walletkit'
import VoteBtn from './voteBtn'
import { getProgram } from 'config'
import { useSelector } from 'react-redux'
import { AppState } from 'store'

const dateFormat = 'DD/MM/YYYY hh:mm:ss'

const CandidateDetail = ({ candidateAddress }: { candidateAddress: string }) => {
  const {
    candidates: { [candidateAddress]: candidateData },
  } = useSelector((state: AppState) => state)
  const wallet = useConnectedWallet()

  const onClose = async () => {
    if (!wallet) return
    const program = getProgram(wallet)
    const candidatePublicKey = new anchor.web3.PublicKey(candidateAddress)
    const mintPublicKey = new anchor.web3.PublicKey(candidateData.mint)

    const [treasurer] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('treasurer'), candidatePublicKey.toBuffer()],
      program.programId,
    )
    const [ballot] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('ballot'), candidatePublicKey.toBuffer(), wallet.publicKey.toBuffer()],
      program.programId,
    )
    // Derive token account
    let walletTokenAccount = await anchor.utils.token.associatedAddress({
      mint: mintPublicKey,
      owner: wallet.publicKey,
    })
    let candidateTokenAccount = await anchor.utils.token.associatedAddress({
      mint: mintPublicKey,
      owner: treasurer,
    })

    try {
      await program.rpc.close({
        accounts: {
          authority: wallet.publicKey,
          candidate: candidatePublicKey,
          treasurer,
          mint: candidateData.mint,
          candidateTokenAccount,

          ballot,
          voterTokenAccount: walletTokenAccount,

          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
          associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
        signers: [],
      })
      notification.success({ message: 'Close candidate success' })
    } catch (error: any) {
      notification.error({ message: error })
    }
  }

  return (
    <Card>
      <Row style={{ marginBottom: '16px' }}>
        <Col flex="auto">Candidate: {candidateAddress}</Col>
        <Col>Vote amount: {candidateData.amount}</Col>
      </Row>
      <Row gutter={[0, 10]}>
        <Col span={24}>
          <Row align="bottom" wrap={false}>
            <Col flex="auto">
              <Row>
                <Col span={24}>
                  <Space align="baseline">
                    <Typography.Text>Start date:</Typography.Text>
                    <Typography.Title level={5}>
                      {moment(candidateData.startTime * 1000).format(dateFormat)}
                    </Typography.Title>
                  </Space>
                </Col>
                <Col span={24}>
                  <Space align="baseline">
                    <Typography.Text>End date:</Typography.Text>
                    <Typography.Title level={5}>
                      {moment(candidateData.endTime * 1000).format(dateFormat)}
                    </Typography.Title>
                  </Space>
                </Col>
              </Row>
            </Col>
            <Col>
              <Space>
                <VoteBtn candidateAddress={candidateAddress} />
                <Button type="primary" style={{ borderRadius: 40 }} onClick={onClose}>
                  Close
                </Button>
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default CandidateDetail
