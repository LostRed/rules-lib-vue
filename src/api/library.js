import { api } from '@/utils/request'

export function queryLibrary(queryParam) {
  return api({
    url: '/library/query',
    method: 'post',
    data: queryParam
  })
}

export function createLibrary(library) {
  return api({
    url: '/library/create',
    method: 'post',
    data: library
  })
}

export function editLibrary(library) {
  return api({
    url: '/library/edit',
    method: 'post',
    data: library
  })
}

export function queryByCatalog(probe) {
  return api({
    url: '/library/queryByCatalog',
    method: 'post',
    data: probe
  })
}

export function existsLibrary(libraryCode) {
  return api({
    url: '/library/exists',
    method: 'post',
    data: {
      probe: libraryCode
    }
  })
}

export function registerLibrary(id) {
  return api({
    url: '/library/register',
    method: 'post',
    data: {
      probe: id
    }
  })
}

export function queryModelLibrary() {
  return api({
    url: '/modelLibrary/query',
    method: 'get'
  })
}
