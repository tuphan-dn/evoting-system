import { Button, Col, Input, Modal, Row, Space, Typography } from 'antd'
import { ChangeEvent, Fragment, useState } from 'react'
import { Candidate } from './index'
import { useConnectedWallet } from '@gokiprotocol/walletkit'
import * as config from '../../config'
import * as anchor from '@project-serum/anchor'

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
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onChangeValue(event.target.value)
            }
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

const VoteBtn = ({ candidate }: { candidate: Candidate }) => {
  const [visible, setVisible] = useState(false)
  const [amount, setAmount] = useState('')
  const wallet = useConnectedWallet()

  const onVote = async () => {
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
    console.log("candidate.mint",candidate.mint);
    console.log("wallet.publicKey",wallet.publicKey);
    let walletTokenAccount = await anchor.utils.token.associatedAddress({
      mint: candidate.mint,
      owner: wallet.publicKey,
    })
    console.log('walletTokenAccount: ', walletTokenAccount)
    let candidateTokenAccount = await anchor.utils.token.associatedAddress({
      mint: candidate.mint,
      owner: treasurerPublicKey,
    })

    try {
      await program.rpc.vote(new anchor.BN(amount), {
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
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Fragment>
      <Button
        onClick={() => setVisible(true)}
        style={{ borderRadius: 40 }}
        block
      >
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
          candidateAddress={candidate.candidateAddress.toBase58()}
        />
      </Modal>
    </Fragment>
  )
}

export default VoteBtn
