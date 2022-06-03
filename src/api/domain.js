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

export function editDomainDesc(className, description) {
  return api({
    url: '/domain/editDomainDesc',
    method: 'post',
    data: {
      className: className,
      description: description
    }
  })
}

export function editPropertyDesc(className, propertyName, description) {
  return api({
    url: '/domain/editPropertyDesc',
    method: 'post',
    data: {
      className: className,
      propertyName: propertyName,
      description: description
    }
  })
}
