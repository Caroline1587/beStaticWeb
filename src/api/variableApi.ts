import { scenarioServer } from '@/utils/axios'
import { AddVariableType, EditVariableType, GetVariableListType } from '@/utils/types/requestType'

export function getVariableList (data: GetVariableListType) {
  return scenarioServer({
    url: '/variable/queryVariableByPageParam',
    method: 'post',
    data
  })
}

export function addVariable (data: { variableInfoList: AddVariableType[] }) {
  return scenarioServer({
    url: '/variable/addVariable',
    method: 'post',
    data
  })
}

export function multiAddVariable (data: { variableInfoList: AddVariableType[] }) {
  return scenarioServer({
    url: '/variable/addVariable',
    method: 'post',
    data
  })
}
export function editVariable (data: { variableInfo: EditVariableType }) {
  return scenarioServer({
    url: '/variable/editVariable',
    method: 'post',
    data
  })
}

export function queryVariableById (params: { id: string }) {
  return scenarioServer({
    url: '/variable/queryVariableById',
    method: 'post',
    params
  })
}

export function deleteVariable (params: { ids: string }) {
  return scenarioServer({
    url: '/variable/deleteVariable',
    method: 'post',
    params
  })
}
export function copyVariable (params: { variableIds: string, targetFolderId: string }) {
  return scenarioServer({
    url: '/variable/copyVariable',
    method: 'post',
    params
  })
}

export function moveVariable (params: { variableIds: string, targetFolderId: string }) {
  return scenarioServer({
    url: '/variable/moveVariable',
    method: 'post',
    params
  })
}

export function checkVariableName (params: { variableName: string }) {
  return scenarioServer({
    url: '/variable/checkRepeatVariableName',
    method: 'post',
    params: {
      ...params,
      variableClass: 1
    }
  })
}

export function importVariable (data: FormData) {
  return scenarioServer({
    url: '/variable/importVariables',
    method: 'post',
    data
  })
}

export function exportVariables (data: { ids: string }) {
  return scenarioServer({
    url: '/variable/exportVariables',
    method: 'post',
    data
  })
}
