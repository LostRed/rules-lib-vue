import { api } from '@/utils/request'

export function querySegment(queryParam) {
  return api({
    url: '/segment/query',
    method: 'post',
    data: queryParam
  })
}

export function editSegment(segmentInfo) {
  return api({
    url: '/segment/edit',
    method: 'post',
    data: segmentInfo
  })
}

export function createSegment(segmentInfo) {
  return api({
    url: '/segment/create',
    method: 'post',
    data: segmentInfo
  })
}
