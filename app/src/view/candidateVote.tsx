import { useSelector, useDispatch } from 'react-redux'
import { Fragment, useState } from 'react'
import { useConnectedWallet } from '@gokiprotocol/walletkit'
import * as anchor from '@project-serum/anchor'

import { Button, Col, Input, Modal, notification, Row, Space, Typography } from 'antd'

import { AppState } from 'store'
import { getProgram } from 'config'
import { setCandidate } from 'store/candidates.reducer'

const CandidateVote = ({ candidateAddress }: { candidateAddress: string }) => {
  const {
    candidates: { [candidateAddress]: candidateData },
  } = useSelector((state: AppState) => state)
  const dispatch = useDispatch()
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [amount, setAmount] = useState('')
  const wallet = useConnectedWallet()

  const onVote = async () => {
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
      await program.rpc.vote(new anchor.BN(amount), {
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
      notification.success({ message: 'Vote success' })
      setVisible(false)
      dispatch(setCandidate({ ...candidateData, amount: candidateData.amount + Number(amount) }))
    } catch (error: any) {
      notification.error({ message: 'Vote failed' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Fragment>
      <Button onClick={() => setVisible(true)} style={{ borderRadius: 40 }} block loading={loading}>
        Vote
      </Button>
      <Modal
        title={<Typography.Title level={4}>Vote Candidate</Typography.Title>}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose={true}
        centered={true}
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Typography.Text>Candidate: {candidateAddress}</Typography.Text>
          </Col>
          <Col span={24}>
            <Space>
              <Typography.Text>Amount: </Typography.Text>
              <Input
                style={{ width: '100%' }}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </Space>
          </Col>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" onClick={() => onVote()} loading={loading}>
              Vote Candidate
            </Button>
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default CandidateVote
