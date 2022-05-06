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

export function switchRuleEnabled(businessType, ruleCode) {
  return api({
    url: '/rulesEngine/switchRuleEnabled',
    method: 'post',
    data: {
      businessType,
      ruleCode
    }
  })
}
