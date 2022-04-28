import { useState } from 'react'
import { useSelector } from 'react-redux'
import moment from 'moment'
import { useConnectedWallet } from '@gokiprotocol/walletkit'
import { web3, utils } from '@project-serum/anchor'

import { Button, Card, Col, Row, Space, Typography, notification } from 'antd'
import VoteCandidate from './voteCandidate'

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
    const candidatePublicKey = new web3.PublicKey(candidateAddress)
    const mintPublicKey = new web3.PublicKey(candidateData.mint)

    const [treasurer] = await web3.PublicKey.findProgramAddress(
      [Buffer.from('treasurer'), candidatePublicKey.toBuffer()],
      program.programId,
    )
    const [ballot] = await web3.PublicKey.findProgramAddress(
      [Buffer.from('ballot'), candidatePublicKey.toBuffer(), wallet.publicKey.toBuffer()],
      program.programId,
    )
    // Derive token account
    let walletTokenAccount = await utils.token.associatedAddress({
      mint: mintPublicKey,
      owner: wallet.publicKey,
    })
    let candidateTokenAccount = await utils.token.associatedAddress({
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
          tokenProgram: utils.token.TOKEN_PROGRAM_ID,
          associatedTokenProgram: utils.token.ASSOCIATED_PROGRAM_ID,
          systemProgram: web3.SystemProgram.programId,
          rent: web3.SYSVAR_RENT_PUBKEY,
        },
        signers: [],
      })
      return notification.success({ message: 'Closed the vote' })
    } catch (er: any) {
      return notification.error({ message: er.message })
    } finally {
      return setLoading(false)
    }
  }

  return (
    <Card>
      <Row gutter={[12, 12]}>
        <Col span={24}>
          <Space>
            <Typography.Text type="secondary">Candidate Address:</Typography.Text>
            <Typography.Text>{candidateAddress.substring(0, 6) + '...'}</Typography.Text>
          </Space>
        </Col>
        <Col span={24}>
          <Space>
            <Typography.Text type="secondary">Vote amount:</Typography.Text>
            <Typography.Text>{candidateData.amount}</Typography.Text>
          </Space>
        </Col>
        <Col span={24}>
          <Space direction="vertical">
            <Space>
              <Typography.Text type="secondary">Start date:</Typography.Text>
              <Typography.Text>
                {moment(candidateData.startTime * 1000).format(DATE_FORMAT)}
              </Typography.Text>
            </Space>
            <Space>
              <Typography.Text type="secondary">End date:</Typography.Text>
              <Typography.Text>
                {moment(candidateData.endTime * 1000).format(DATE_FORMAT)}
              </Typography.Text>
            </Space>
          </Space>
        </Col>
        <Col span={12}>
          <Button onClick={onClose} loading={loading} block>
            Close
          </Button>
        </Col>
        <Col span={12}>
          <VoteCandidate candidateAddress={candidateAddress} />
        </Col>
      </Row>
    </Card>
  )
}

export default CandidateDetail
