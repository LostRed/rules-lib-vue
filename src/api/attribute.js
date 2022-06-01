import { api } from '@/utils/request'

export function queryTree() {
  return api({
    url: '/catalog/tree',
    method: 'get'
  })
}

export function queryByLibrary(queryParam) {
  return api({
    url: '/attribute/queryByLibrary',
    method: 'post',
    data: queryParam
  })
}

export function queryAttribute(queryParam) {
  return api({
    url: '/attribute/query',
    method: 'post',
    data: queryParam
  })
}

export function createAttribute(attribute) {
  return api({
    url: '/attribute/create',
    method: 'post',
    data: attribute
  })
}

export function editAttribute(attribute) {
  return api({
    url: '/attribute/edit',
    method: 'post',
    data: attribute
  })
}

export function switchDisplayed(queryParam) {
  return api({
    url: '/attribute/switchDisplayed',
    method: 'post',
    data: queryParam
  })
}

export function downloadTemplate(libraryId) {
  const iframe = document.createElement('iframe')
  iframe.src = `/rules-lib/attribute/template/${libraryId}`
  iframe.style.display = 'none'
  iframe.id = 'download'
  const download = document.getElementById('download')
  if (download != null) {
    document.body.removeChild(download)
  }
  document.body.appendChild(iframe)
}
