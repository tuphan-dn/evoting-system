import {
  Button,
  Card,
  Col,
  DatePicker,
  Modal,
  Row,
  Space,
  Typography,
} from 'antd'
import { Fragment, useState } from 'react'
import { UserAddOutlined } from '@ant-design/icons'
import moment from 'moment'

const dateFormat = 'DD/MM/YYYY'

const ModalContent = (): JSX.Element => {
  const [visible, setVisible] = useState(false)
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Space align="baseline">
          <Typography.Text>Start date:</Typography.Text>
          <DatePicker
            defaultValue={moment('2015/01/01', dateFormat)}
            format={dateFormat}
          />
        </Space>
      </Col>
      <Col span={24}>
        <Space align="baseline">
          <Typography.Text>End date:</Typography.Text>
          <DatePicker
            defaultValue={moment('2015/01/01', dateFormat)}
            format={dateFormat}
          />
        </Space>
      </Col>
    </Row>
  )
}

const NewCandidateBtn = () => {
  const [visible, setVisible] = useState(false)
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
        title={<Typography.Title level={4}>New Pool</Typography.Title>}
        visible={visible}
        onCancel={() => {
          setVisible(false)
        }}
        footer={null}
        destroyOnClose={true}
        centered={true}
        width={572}
        className="modal-balansol"
      >
        <ModalContent />
      </Modal>
    </Fragment>
  )
}

export default NewCandidateBtn
