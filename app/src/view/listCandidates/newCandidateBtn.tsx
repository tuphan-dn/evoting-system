import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Modal,
  Row,
  Space,
  Typography,
} from 'antd'
import { Fragment, useState } from 'react'
import { UserAddOutlined } from '@ant-design/icons'
import moment from 'moment'

const dateFormat = 'DD/MM/YYYY'

const ModalContent = () => {
  return (
    <Form labelCol={{ span: 8 }} wrapperCol={{ span: 16 }}>
      <Form.Item label="Start Date">
        <DatePicker style={{ width: '80%' }} format={dateFormat} />
      </Form.Item>

      <Form.Item label="End Date">
        <DatePicker style={{ width: '80%' }} format={dateFormat} />
      </Form.Item>

      <Form.Item>
        <Col style={{ textAlign: 'right' }}>
          <Button type="primary">Create Candidate</Button>
        </Col>
      </Form.Item>
    </Form>
  )
}

const NewCandidateBtn = () => {
  const [visible, setVisible] = useState(false)
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')

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
        onCancel={() => {
          setVisible(false)
        }}
        footer={null}
        destroyOnClose={true}
        centered={true}
      >
        <ModalContent />
      </Modal>
    </Fragment>
  )
}

export default NewCandidateBtn
