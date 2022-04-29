import { api } from '@/utils/request'

export function queryCatalog(probe) {
  return api({
    url: '/catalog/query',
    method: 'post',
    data: probe
  })
}

export function createCatalog(catalog) {
  return api({
    url: '/catalog/create',
    method: 'post',
    data: catalog
  })
}

export function editCatalog(catalog) {
  return api({
    url: '/catalog/edit',
    method: 'post',
    data: catalog
  })
}
