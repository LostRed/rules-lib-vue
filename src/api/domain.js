import { api } from '@/utils/request'

export function queryDomain(queryParam) {
  return api({
    url: '/domain/query',
    method: 'post',
    data: queryParam
  })
}

export function queryByClassName(className) {
  return api({
    url: '/domain/info',
    method: 'post',
    data: {
      probe: className
    }
  })
}
