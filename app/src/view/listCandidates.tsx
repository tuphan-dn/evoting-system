import { useSelector } from 'react-redux'

import { Col, Row } from 'antd'
import CandidateDetail from './candidateDetail'

import { AppState } from 'store'

const ListCandidates = () => {
  const { candidates } = useSelector((state: AppState) => state)

  return (
    <Row gutter={[24, 24]}>
      {Object.keys(candidates).map((address) => {
        return (
          <Col span={24} key={address}>
            <CandidateDetail candidateAddress={address} />
          </Col>
        )
      })}
    </Row>
  )
}

export default ListCandidates