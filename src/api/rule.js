import { api } from '@/utils/request'

export function queryRule(queryParam) {
  return api({
    url: '/rule/query',
    method: 'post',
    data: queryParam
  })
}

export function queryRuleByRuleCode(queryParam) {
  return api({
    url: '/rule/queryByRuleCode',
    method: 'post',
    data: queryParam
  })
}

export function createRule(ruleInfo) {
  return api({
    url: '/rule/create',
    method: 'post',
    data: ruleInfo
  })
}

export function destroyRule(businessType, ruleCode) {
  return api({
    url: '/rule/destroy',
    method: 'post',
    data: {
      businessType: businessType,
      ruleCode: ruleCode
    }
  })
}
