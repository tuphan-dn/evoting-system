import { Button, Col, DatePicker, Modal, Row, Space, Typography } from 'antd'
import { Fragment, useState } from 'react'
import { UserAddOutlined } from '@ant-design/icons'
import moment from 'moment'

const NewCandidateBtn = () => {
  const [visible, setVisible] = useState(false)
  const [startDate, setStartDate] = useState<moment.Moment>()
  const [endDate, setEndDate] = useState<moment.Moment>()

  const onCreateCandidate = () => {
    //todo
    console.log(startDate, endDate)
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
        onCancel={() => {
          setVisible(false)
        }}
        footer={null}
        destroyOnClose={true}
        centered={true}
      >
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Typography.Text>Voting Time Duration</Typography.Text>
          </Col>
          <Col span={24}>
            <Space>
              <DatePicker
                placeholder="Start Date"
                value={startDate ? moment(startDate) : null}
                showTime
                onChange={(date) => setStartDate(moment(date))}
              />
              <DatePicker
                placeholder="End Date"
                value={endDate ? moment(endDate) : null}
                showTime
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
