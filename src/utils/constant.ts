import { QuestionFilled, SuccessFilled, CircleCloseFilled, WarningFilled, RemoveFilled } from '@element-plus/icons-vue'
import i18n from '@/lang'
import moment from 'moment'
const global:any = i18n.global
 const t:any = global.t

// 自定义/普通属性对应表格列宽
export const TABLE_FIELD_TYPE_WIDTH:{[key:string]:number} = {
  name: 240,
  input: 200,
  textarea: 200,
  radio: 120,
  checkbox: 200,
  singleSelect: 120,
  multiSelect: 200,
  number: 120,
  date: 170,
  singleMember: 120,
  multiMember: 200,
  tag: 200,
  url: 200
}
// 测试集的状态常量
export const TESTSET_STATUS2 = [
  {
    color: '#B4B4B4',
    text: t('daiCeShi'),
    value: {
      props: 'untestedNum',
      value: 0
    }
  },
  {
    color: 'var(--el-color-primary)',
    text: t('jinHangZhong'),
    value: {
      props: 'testingNum',
      value: 0
    }
  },
  {
    color: '#92D073',
    text: t('yiWanCheng'),
    value: {
      props: 'completedNum',
      value: 0
    }
  },
  {
    color: '#F3C886',
    text: t('yiZhongZhi'),
    value: {
      props: 'terminatedNum',
      value: 0
    }
  },
  {
    color: '#F16767',
    text: t('yiChang'),
    value: {
      props: 'abnormalNum',
      value: 0
    }
  },
  {
    color: '#AF85E5',
    text: t('yiGuiDang'),
    value: {
      props: 'filedNum',
      value: 0
    }
  }
]
// 测试集状态
export const TESTSET_STATUS = [
  {
    color: '#D9D9D9',
    text: t('daiCeShi')
  },
  {
    color: '#0B53FD',
    text: t('jinHangZhong')
  },
  {
    color: '#5AE415',
    text: t('yiWanCheng')
  },
  {
    color: '#FFCC05',
    text: t('yiZhongZhi')
  }
]
// 测试结果
export const TEST_RESULT = [
  {
    color: '#67C23A',
    text: t('tongGuo')
  },
  {
    color: '#F56C6C',
    text: t('shiBai')
  },
  {
    color: '#E6A23C',
    text: t('cuoWu')
  }
]
// 执行结果
export const TEST_STATUS_RESULT = [
  {
    name: t('weiCeShi'),
    iconComponent: markRaw(QuestionFilled),
    value: 1,
    color: '#EFEFEF',
    valueObj: {
      props: 'passLtcNum',
      value: 0
    }
  },
  {
    name: t('tongGuo'),
    iconComponent: markRaw(SuccessFilled),
    value: 2,
    color: 'var(--el-color-success-light-3)',
    valueObj: {
      props: 'passLtcNum',
      value: 0
    }
  },
  {
    name: t('shiBai'),
    iconComponent: markRaw(CircleCloseFilled),
    value: 3,
    color: 'var(--el-color-danger)',
    valueObj: {
      props: 'failLtcNum',
      value: 0
    }
  },
  {
    name: t('yiChang'),
    iconComponent: markRaw(WarningFilled),
    value: 4,
    color: 'var(--el-color-warning-light-3)',
    valueObj: {
      props: 'abnormalLtcNum',
      value: 0
    }
  },
  {
    name: t('wuPanDuan'),
    iconComponent: markRaw(RemoveFilled),
    value: 5,
    color: '#CCCCCC',
    valueObj: {
      props: 'noResultLtcNum',
      value: 0
    }
  }
]
// 缺陷状态
export const DEFECT_STATUS = [
  {
    color: '#909399',
    text: t('yiGuanBi')
  },
  {
    color: '#F56C6C',
    text: t('xinTiChu')
  },
  {
    color: '#67C23A',
    text: t('yiJieJue')
  },
  {
    color: '#E6A23C',
    text: t('chuLiZhong')
  }
]
// 用例部分的常量判断
export const TESTCASE_PRIORITY:{[key:number| string]:string} = {
  1: t('di'),
  2: t('zhong'),
  3: t('gao')
}
export const TESTCASE_TESTTYPE:{[key:number|string]:string} = {
  1: t('ziDongCeShi'),
  2: t('shouDongCeShi'),
  3: t('ziDongCeShiShouDongCeShi-0'),
  '1,2': t('ziDongCeShiShouDongCeShi-0'),
  '2,1': t('ziDongCeShiShouDongCeShi-0')
}
export const TESTCASE_TEMPLATETYPE:{[key:number|string]:string} = {
  1: t('ceShiWenBen'),
  2: t('ceShiXuLie')
}
export const TESTCASE_SOURCETYPE:{[key:number]:string} = {
  1: t('xiangMu'),
  2: t('ziYuanKu')
}
// 测试用例的日志名称匹配常量
export const TESTCASE_LOG:Record<string, {name:string, constant?:any}> = {
  testcaseName: { name: t('yongLiMingCheng') },
  testcaseNumber: { name: t('yongLiBianHao') },
  description: { name: t('yongLiMiaoShu') },
  tags: { name: t('biaoQian') },
  createTime: { name: t('chuangJianShiJian') },
  createUser: { name: t('chuangJianRen') },
  templateType: { name: t('yongLiMoBan'), constant: TESTCASE_TEMPLATETYPE },
  testType: { name: t('ceShiLeiXing'), constant: TESTCASE_TESTTYPE },
  priority: { name: t('youXianJi'), constant: TESTCASE_PRIORITY },
  preConditionDesc: { name: t('qianZhiTiaoJian') },
  resetDesc: { name: t('fuWeiBuZhou') },
  testcaseStep: { name: t('ceShiBuZhou') },
  expectResult: { name: t('qiWangJieGuo') },
  deleteFile: { name: t('shanChu') },
  uploadFile: { name: t('shangChuan') },
  downloadFile: { name: t('xiaZai') },
  syncFile: { name: '同步序列文件' }
  // require: { name: '关联需求' }
  // sourceType: { name: '用例来源' }
}
export const LOG_TYPE:Record<string, {desc:''|string, constant?:any}> = {
  restore: { desc: t('congHuiShouZhanHuiFu') },
  delete: { desc: t('shanChuZhiHuiShouZhan') },
  add: { desc: t('chuangJian') },
  copy: { desc: t('fuZhi') },
  pull: { desc: t('congYongLiKuZhongLaQu') },
  commit: { desc: t('congXiangMuYongLiZhongTiJiao') }
}
// 标签颜色
export const LABEL_COLOR = ['#00AC26', '#3AB000', '#01B2D9', '#006CEB', '#5B6AF0', '#EA44A7', '#F34B45', '#EC7819', '#C99C08', '#707986']
// 变量类型
export const VARIABLE_TYPE = [t('ziFuChuan'), t('shuZhi'), t('meiJu'), 'python']
// 判断满格还是单位格
export const FIELD_TYPE_ITEM:{[key:string]:boolean} = {
  input: false,
  textarea: true,
  richText: true,
  radio: true,
  checkbox: true,
  singleSelect: false,
  multiSelect: true,
  number: false,
  date: false,
  file: true,
  singleMember: false,
  multiMember: true,
  tag: true,
  url: false
}
// 时间段常量
export const DATA_SHORTCUTS = [
  {
    text: t('xuanZeShiJianDuan'),
    prop: '',
    value: () => {
      return ['', '']
    }
  },
  {
    text: t('jinTian'),
    prop: 'today',
    value: () => {
      const start = new Date()
      start.setTime(start.getTime())
      return [moment(start).format('YYYY-MM-DD'), moment(start).format('YYYY-MM-DD')]
    }
  },
  {
    text: t('zuoTian'),
    prop: 'yesterday',
    value: () => {
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24)
      return [moment(start).format('YYYY-MM-DD'), moment(start).format('YYYY-MM-DD')]
    }
  },
  {
    text: t('benZhou'),
    prop: 'week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      return [moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD')]
    }
  },
  {
    text: t('shangZhou'),
    prop: 'last week',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 14)
      end.setTime(end.getTime() - 3600 * 1000 * 24 * 7)
      return [moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD')]
    }
  },
  {
    text: t('benYue'),
    prop: 'month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      return [moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD')]
    }
  },
  {
    text: t('shangYue'),
    prop: 'last month',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 60)
      end.setTime(end.getTime() - 3600 * 1000 * 24 * 30)
      return [moment(start).format('YYYY-MM-DD'), moment(end).format('YYYY-MM-DD')]
    }
  }
]
export const FIELD_BACKGROUNDCOLOR = '#F4F6F9'
