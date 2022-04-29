import { api } from '@/utils/request'

export function queryLibrary(probe) {
  return api({
    url: '/library/query',
    method: 'post',
    data: probe
  })
}
