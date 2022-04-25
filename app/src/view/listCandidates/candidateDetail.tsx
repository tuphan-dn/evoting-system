import { Button, Card, Col, Row, Space, Typography } from 'antd'
import VoteBtn from './voteBtn'

const CandidateDetail = () => {
  return (
    <Card style={{ boxShadow: 'unset' }}>
      <Row style={{ marginBottom: '16px' }}>
        <Col flex="auto">Candidate: ABCXYZ</Col>
        <Col>Vote amount: 123</Col>
      </Row>
      <Row gutter={[0, 10]}>
        <Col span={24}>
          <Row align="bottom" wrap={false}>
            <Col flex="auto">
              <Row>
                <Col span={24}>
                  <Space align="baseline">
                    <Typography.Text>Start date:</Typography.Text>
                    <Typography.Title level={5}> 05/20/2022</Typography.Title>
                  </Space>
                </Col>
                <Col span={24}>
                  <Space align="baseline">
                    <Typography.Text>End date:</Typography.Text>
                    <Typography.Title level={5}> 05/20/2022</Typography.Title>
                  </Space>
                </Col>
              </Row>
            </Col>
            <Col>
              <Space>
                <VoteBtn />
                <Button type="primary" style={{ borderRadius: 40 }}>
                  Close
                </Button>
              </Space>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  )
}

export default CandidateDetail
