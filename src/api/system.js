import { api } from '@/utils/request'

export function queryEnum(queryParam) {
  return api({
    url: '/system/queryEnum',
    method: 'post',
    data: queryParam
  })
}

export function parseExpression(probe) {
  return api({
    url: '/system/parseExpression',
    method: 'post',
    data: probe
  })
}
