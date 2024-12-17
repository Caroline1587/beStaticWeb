import { defineStore } from 'pinia'
import caseInfo from '@/views/TestSetCaseInfo/hook/caseInfo'
import testsetResult from '@/views/TestSetCaseInfo/hook/testsetResult'

export const useTestSetStore = defineStore('testSetStore', () => {
  return { ...caseInfo('testcase_project'), ...testsetResult() }
})
