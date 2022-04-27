import {
  Button,
  Col,
  DatePicker,
  Modal,
  Row,
  Space,
  Typography,
  Input,
  notification,
} from 'antd'
import { Fragment, useState } from 'react'
import { UserAddOutlined } from '@ant-design/icons'
import moment from 'moment'

import { useConnectedWallet } from '@gokiprotocol/walletkit'
import * as config from '../../config'
import * as anchor from '@project-serum/anchor'

const NewCandidateBtn = () => {
  const [visible, setVisible] = useState(false)
  const wallet = useConnectedWallet()
  const [startDate, setStartDate] = useState<moment.Moment>()
  const [endDate, setEndDate] = useState<moment.Moment>()
  const [mintToken, setMintToken] = useState('')

  const onCreateCandidate = async () => {
    //todo
    console.log('programID: ', config.programID)

    if (!wallet || !startDate || !endDate!) return
    const startTime = startDate.valueOf() / 1000
    const endTime = endDate.valueOf() / 1000

    const program = config.getProgram(wallet)

    const candidate = new anchor.web3.Keypair()
    let treasurer: anchor.web3.PublicKey

    const [treasurerPublicKey] = await anchor.web3.PublicKey.findProgramAddress(
      [Buffer.from('treasurer'), candidate.publicKey.toBuffer()],
      config.programID,
    )
    treasurer = treasurerPublicKey

    // Derive token account
    let walletTokenAccount = await anchor.utils.token.associatedAddress({
      mint: new anchor.web3.PublicKey(mintToken),
      owner: wallet.publicKey,
    })
    let candidateTokenAccount = await anchor.utils.token.associatedAddress({
      mint: new anchor.web3.PublicKey(mintToken),
      owner: treasurerPublicKey,
    })

    try {
      await program.rpc.initializeCandidate(
        new anchor.BN(startTime),
        new anchor.BN(endTime),
        {
          accounts: {
            authority: wallet.publicKey,
            candidate: candidate.publicKey,
            treasurer,
            mint: new anchor.web3.PublicKey(mintToken),
            candidateTokenAccount,
            tokenProgram: anchor.utils.token.TOKEN_PROGRAM_ID,
            associatedTokenProgram: anchor.utils.token.ASSOCIATED_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          },
          signers: [candidate],
        },
      )
      notification.success({ message: 'New candidate success' })
    } catch (error: any) {
      notification.error({ message: error })
    }
  }

  return (
    <Fragment>
      <Button
        icon={<UserAddOutlined />}
        onClick={() => setVisible(true)}
        style={{ borderRadius: 40 }}
        block
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
            <Input
              onChange={(event) => setMintToken(event.target.value)}
            ></Input>
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
            <Button
              type="primary"
              style={{ borderRadius: 40 }}
              onClick={onCreateCandidate}
            >
              Create Candidate
            </Button>
          </Col>
        </Row>
      </Modal>
    </Fragment>
  )
}

export default NewCandidateBtn
