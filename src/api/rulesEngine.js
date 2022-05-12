import { api } from '@/utils/request'

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

export function getAllEngineBusinessType() {
  return api({
    url: '/rulesEngine/getAllEngineBusinessType',
    method: 'get'
  })
}

export function getAllEngineView() {
  return api({
    url: '/rulesEngine/getAllEngineView',
    method: 'get'
  })
}

export function evaluate(data) {
  return api({
    url: '/rulesEngine/evaluate',
    method: 'post',
    data: data
  })
}

export function execute(data) {
  return api({
    url: '/rulesEngine/execute',
    method: 'post',
    data: data
  })
}
