import { useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { useConnectedWallet } from '@gokiprotocol/walletkit'
import * as anchor from '@project-serum/anchor'

import { Button, Card, Col, Row, Space, Typography, notification } from 'antd'
import CandidateVote from './candidateVote'

import { getProgram } from 'config'
import { AppState } from 'store'

const DATE_FORMAT = 'DD/MM/YYYY hh:mm:ss'

const CandidateDetail = ({ candidateAddress }: { candidateAddress: string }) => {
  const {
    candidates: { [candidateAddress]: candidateData },
  } = useSelector((state: AppState) => state)
  const wallet = useConnectedWallet()
  const [loading, setLoading] = useState(false)

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
      setLoading(true)
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
      notification.success({ message: 'Close success' })
    } catch (error: any) {
      notification.error({ message: 'Close failed' })
    } finally {
      setLoading(false)
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
                      {moment(candidateData.startTime * 1000).format(DATE_FORMAT)}
                    </Typography.Title>
                  </Space>
                </Col>
                <Col span={24}>
                  <Space align="baseline">
                    <Typography.Text>End date:</Typography.Text>
                    <Typography.Title level={5}>
                      {moment(candidateData.endTime * 1000).format(DATE_FORMAT)}
                    </Typography.Title>
                  </Space>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col span={24}>
          <Row gutter={24}>
            <Col span={12}>
              <CandidateVote candidateAddress={candidateAddress} />
            </Col>
            <Col span={12}>
              <Button
                type="primary"
                style={{ borderRadius: 40 }}
                onClick={onClose}
                loading={loading}
                block
              >
                Close
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default CandidateDetail
