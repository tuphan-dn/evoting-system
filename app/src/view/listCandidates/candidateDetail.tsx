import * as anchor from '@project-serum/anchor'
import moment from 'moment'

import { Button, Card, Col, Row, Space, Typography, notification } from 'antd'

import { useConnectedWallet } from '@gokiprotocol/walletkit'
import { Candidate } from './index'
import VoteBtn from './voteBtn'
import * as config from '../../config'

const dateFormat = 'DD/MM/YYYY hh:mm:ss'

const CandidateDetail = ({ candidate }: { candidate: Candidate }) => {
  const wallet = useConnectedWallet()

  const onClose = async () => {
    if (!wallet) return

    const program = config.getProgram(wallet)
    let treasurer: anchor.web3.PublicKey
    let ballot: anchor.web3.PublicKey

    const [treasurerPublicKey] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('treasurer'), candidate.candidateAddress.toBuffer()],
      config.programID,
    )
    treasurer = treasurerPublicKey

    const [ballotPublicKey] = await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from('ballot'),
        candidate.candidateAddress.toBuffer(),
        wallet.publicKey.toBuffer(),
      ],
      program.programId,
    )
    ballot = ballotPublicKey

    // Derive token account
    let walletTokenAccount = await anchor.utils.token.associatedAddress({
      mint: candidate.mint,
      owner: wallet.publicKey,
    })
    let candidateTokenAccount = await anchor.utils.token.associatedAddress({
      mint: candidate.mint,
      owner: treasurerPublicKey,
    })

    try {
      await program.rpc.close({
        accounts: {
          authority: wallet.publicKey,
          candidate: candidate.candidateAddress,
          treasurer,
          mint: candidate.mint,
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
    <Card style={{ boxShadow: 'unset' }}>
      <Row style={{ marginBottom: '16px' }}>
        <Col flex="auto">
          Candidate: {candidate.candidateAddress.toBase58()}
        </Col>
        <Col>Vote amount: {Number(candidate.amount)}</Col>
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
                      {' '}
                      {moment(Number(candidate.startDate) * 1000).format(
                        dateFormat,
                      )}
                    </Typography.Title>
                  </Space>
                </Col>
                <Col span={24}>
                  <Space align="baseline">
                    <Typography.Text>End date:</Typography.Text>
                    <Typography.Title level={5}>
                      {' '}
                      {moment(Number(candidate.endDate) * 1000).format(
                        dateFormat,
                      )}
                    </Typography.Title>
                  </Space>
                </Col>
              </Row>
            </Col>
            <Col>
              <Space>
                <VoteBtn candidate={candidate} />
                <Button
                  type="primary"
                  style={{ borderRadius: 40 }}
                  onClick={onClose}
                >
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
