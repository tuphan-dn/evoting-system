import { Col, Row, Typography } from 'antd'
import CandidateDetail from './candidateDetail'
import NewCandidateBtn from './newCandidateBtn'

const ListCandidates = () => {
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Row gutter={[24, 24]} justify="space-between">
          <Col>
            <Typography.Title level={3}>List candidates</Typography.Title>
          </Col>
          <Col>
            <NewCandidateBtn />
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <CandidateDetail />
      </Col>
      <Col span={24}>
        <CandidateDetail />
      </Col>
    </Row>
  )
}

export default ListCandidates
