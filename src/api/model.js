import { api } from '@/utils/request'

export function searchModel(searchParam) {
  return api({
    url: '/model/search',
    method: 'post',
    data: searchParam
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

export function existsModel(queryParam) {
  return api({
    url: '/model/exists',
    method: 'post',
    data: queryParam
  })
}

export function deleteModel(queryParam) {
  return api({
    url: '/model/delete',
    method: 'post',
    data: queryParam
  })
}
