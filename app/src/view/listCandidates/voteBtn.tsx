import { Button, Col, Input, Modal, Row, Space, Typography } from 'antd'
import { ChangeEvent, Fragment, useState } from 'react'

const ModalContent = ({
  amount,
  onChangeValue = () => {},
}: {
  amount: number | string
  onChangeValue?: (value: string) => void
}) => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Typography.Text>Candidate: ABCXYZABCXYZABCXYZABCXYZ</Typography.Text>
      </Col>
      <Col span={24}>
        <Space>
          <Typography.Text>Amount: </Typography.Text>
          <Input
            style={{ width: '100%' }}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onChangeValue(event.target.value)
            }
          />
        </Space>
      </Col>
      <Col span={24} style={{ textAlign: 'right' }}>
        <Button type="primary">Vote Candidate</Button>
      </Col>
    </Row>
  )
}

const VoteBtn = () => {
  const [visible, setVisible] = useState(false)
  const [amount, setAmount] = useState('')

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
        />
      </Modal>
    </Fragment>
  )
}

export default VoteBtn
