import { Fragment, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useConnectedWallet } from '@gokiprotocol/walletkit'
import moment from 'moment'
import * as anchor from '@project-serum/anchor'

import { Button, Col, DatePicker, Modal, Row, Space, Typography, Input, notification } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'

import { setCandidate } from 'store/candidates.reducer'
import { getProgram } from '../config'

const CandidateCreate = () => {
  const [visible, setVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState<moment.Moment>()
  const [endDate, setEndDate] = useState<moment.Moment>()
  const [mintAddress, setMintAddress] = useState('')
  const dispatch = useDispatch()
  const wallet = useConnectedWallet()

  const onCreateCandidate = async () => {
    if (!wallet || !startDate || !endDate) return
    const program = getProgram(wallet)
    const startTime = startDate.valueOf() / 1000
    const endTime = endDate.valueOf() / 1000

    const candidate = new anchor.web3.Keypair()
    let treasurer: anchor.web3.PublicKey

    const [treasurerPublicKey] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('treasurer'), candidate.publicKey.toBuffer()],
      program.programId,
    )
    treasurer = treasurerPublicKey

    let candidateTokenAccount = await anchor.utils.token.associatedAddress({
      mint: new anchor.web3.PublicKey(mintAddress),
      owner: treasurerPublicKey,
    })

    try {
      setLoading(true)
      await program.rpc.initializeCandidate(new anchor.BN(startTime), new anchor.BN(endTime), {
        accounts: {
          authority: wallet.publicKey,
          candidate: candidate.publicKey,
          treasurer,
          mint: new anchor.web3.PublicKey(mintAddress),
          candidateTokenAccount,
          tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
          associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
          systemProgram: anchor.web3.SystemProgram.programId,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        },
        signers: [candidate],
      })

      dispatch(
        setCandidate({
          address: candidate.publicKey.toBase58(),
          amount: 0,
          mint: mintAddress,
          startTime,
          endTime,
        }),
      )
      notification.success({ message: 'Create candidate successfully!' })
      setVisible(false)
    } catch (error: any) {
      notification.error({ message: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Fragment>
      <Button
        icon={<UserAddOutlined />}
        onClick={() => setVisible(true)}
        style={{ borderRadius: 40 }}
        block
        loading={loading}
      >
        New candidate
      </Button>
      <Modal
        title={<Typography.Title level={4}>New Candidate</Typography.Title>}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
        destroyOnClose={true}
        centered={true}
      >
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Typography.Text>Voting Mint Token: </Typography.Text>
          </Col>
          <Col span={24}>
            <Input onChange={(event) => setMintAddress(event.target.value)}></Input>
          </Col>
          <Col span={24}>
            <Typography.Text>Voting Time Duration</Typography.Text>
          </Col>
          <Col span={24}>
            <Space>
              <DatePicker
                placeholder="Start Date"
                value={startDate}
                showTime
                allowClear={false}
                onChange={(date) => setStartDate(moment(date))}
              />
              <DatePicker
                placeholder="End Date"
                value={endDate}
                showTime
                allowClear={false}
                onChange={(date) => setEndDate(moment(date))}
              />
            </Space>
          </Col>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button type="primary" style={{ borderRadius: 40 }} onClick={onCreateCandidate}>
              Create Candidate
            </Button>
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default CandidateCreate
