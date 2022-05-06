import { api } from '@/utils/request'

export function queryEnum(queryParam) {
  return api({
    url: '/system/queryEnum',
    method: 'post',
    data: queryParam
  })
}
