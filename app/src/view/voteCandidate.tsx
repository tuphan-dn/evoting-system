import { Fragment, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useConnectedWallet } from '@gokiprotocol/walletkit'
import { web3, utils, BN } from '@project-serum/anchor'

import { Button, Col, Input, Modal, notification, Row, Typography } from 'antd'

import { AppState } from 'store'
import { getProgram } from 'config'
import { setCandidate } from 'store/candidates.reducer'

const VoteCandidate = ({ candidateAddress }: { candidateAddress: string }) => {
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
      await program.rpc.vote(new BN(amount), {
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
      setVisible(false)
      dispatch(setCandidate({ ...candidateData, amount: candidateData.amount + Number(amount) }))
      return notification.success({ message: 'Voted for the candidate' })
    } catch (er: any) {
      return notification.error({ message: er.message })
    } finally {
      return setLoading(false)
    }
  }

  return (
    <Fragment>
      <Button type="primary" onClick={() => setVisible(true)} block loading={loading}>
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
        <Row gutter={[24, 12]}>
          <Col span={24}>
            <Typography.Text type="secondary">Candidate: </Typography.Text>
          </Col>
          <Col span={24}>
            <Typography.Text>{candidateAddress}</Typography.Text>
          </Col>
          <Col span={24}>
            <Typography.Text type="secondary">Amount: </Typography.Text>
            <Input
              style={{ width: '100%' }}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </Col>
          <Col span={24}>
            <Button type="primary" onClick={() => onVote()} loading={loading} block>
              Vote Candidate
            </Button>
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default VoteCandidate
