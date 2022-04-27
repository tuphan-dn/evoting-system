import { Button, Col, Input, Modal, notification, Row, Space, Typography } from 'antd'
import { ChangeEvent, Fragment, useState } from 'react'

import { useConnectedWallet } from '@gokiprotocol/walletkit'

import * as anchor from '@project-serum/anchor'
import { useSelector } from 'react-redux'
import { AppState } from 'store'
import { getProgram, PROGRAM_ADDRESS } from 'config'

const ModalContent = ({
  amount,
  onChangeValue = () => {},
  onVoteCandidate = () => {},
  candidateAddress,
}: {
  amount: number | string
  onChangeValue?: (value: string) => void
  onVoteCandidate: () => void
  candidateAddress: string
}) => {
  return (
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
            onChange={(event: ChangeEvent<HTMLInputElement>) => onChangeValue(event.target.value)}
          />
        </Space>
      </Col>
      <Col span={24} style={{ textAlign: 'right' }}>
        <Button type="primary" onClick={onVoteCandidate}>
          Vote Candidate
        </Button>
      </Col>
    </Row>
  )
}

const VoteBtn = ({ candidateAddress }: { candidateAddress: string }) => {
  const {
    candidates: { [candidateAddress]: candidateData },
  } = useSelector((state: AppState) => state)
  const [visible, setVisible] = useState(false)
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
      notification.success({ message: 'Vote candidate success' })
    } catch (error: any) {
      notification.error({ message: error })
    }
  }

  return (
    <Fragment>
      <Button onClick={() => setVisible(true)} style={{ borderRadius: 40 }} block>
        Vote
      </Button>
      <Modal
        title={<Typography.Title level={4}>Vote Candidate</Typography.Title>}
        visible={visible}
        onCancel={() => {
          setVisible(false)
        }}
        footer={null}
        destroyOnClose={true}
        centered={true}
      >
        <ModalContent
          amount={amount}
          onChangeValue={(amount) => setAmount(amount)}
          onVoteCandidate={onVote}
          candidateAddress={candidateAddress}
        />
      </Modal>
    </Fragment>
  )
}

export default VoteBtn
