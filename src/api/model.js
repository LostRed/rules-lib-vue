import { api } from '@/utils/request'

export function queryModel(queryParam) {
  return api({
    url: '/model/query',
    method: 'post',
    data: queryParam
  })
}

export function createModel(model) {
  return api({
    url: '/model/create',
    method: 'post',
    data: model
  })
}

export function editModel(model) {
  return api({
    url: '/model/edit',
    method: 'post',
    data: model
  })
}

export function queryByLibrary(probe) {
  return api({
    url: '/model/queryByCatalog',
    method: 'post',
    data: probe
  })
}
