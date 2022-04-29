import { api } from '@/utils/request'

export function tree() {
  return api({
    url: '/catalog/tree',
    method: 'get'
  })
}
