// 神绘简历 - 热门岗位示例简历库
// 小白用户可以一键加载某个岗位的参考简历作为底稿，再替换成自己的信息。

import { ResumeData } from '../types/resume'

export interface JobSample {
  id: string
  name: string
  resume: ResumeData
}

export const jobSamples: JobSample[] = [
  {
    id: 'frontend',
    name: '前端开发工程师',
    resume: {
      basic: {
        name: '张明',
        title: '前端开发工程师',
        email: 'zhangming@example.com',
        phone: '138-0000-0000',
        location: '北京',
        birthYear: '1998',
        website: 'https://github.com/zhangming',
        summary:
          '5 年 Web 前端开发经验，深耕 React / TypeScript 技术栈，主导过多个从 0 到 1 的中大型项目，擅长性能优化与工程化建设，追求代码质量与用户体验的平衡。',
      },
      education: [
        {
          id: 'edu-1',
          school: '北京邮电大学',
          major: '计算机科学与技术',
          degree: '本科',
          start: '2016-09',
          end: '2020-06',
          description: '主修数据结构、算法、计算机网络；GPA 3.6/4.0，获校级奖学金。',
        },
      ],
      work: [
        {
          id: 'work-1',
          company: '字节跳动',
          title: '高级前端工程师',
          start: '2022-07',
          end: '至今',
          description:
            '负责短视频核心业务前端架构与性能优化；\n主导搭建团队 Monorepo 工程体系，构建效率提升 60%；\n推动页面首屏耗时从 2.1s 优化至 0.8s，日活用户显著提升。',
        },
        {
          id: 'work-2',
          company: '网易',
          title: '前端开发工程师',
          start: '2020-07',
          end: '2022-06',
          description:
            '负责云音乐 Web 端功能开发与维护；\n参与组件库建设，沉淀 30+ 通用组件；\n与产品、设计紧密协作，保障多个大型活动的稳定上线。',
        },
      ],
      projects: [
        {
          id: 'proj-1',
          name: '企业级中后台前端脚手架',
          role: '核心开发者',
          start: '2023-01',
          end: '2023-06',
          link: '',
          description:
            '基于 Vite + React + TS 打造的一体化脚手架，内置权限、路由、状态管理等最佳实践，已被公司 20+ 业务线采用，平均接入成本从 2 周降到 1 天。',
        },
      ],
      skills: [
        { id: 'skill-1', name: 'JavaScript / TypeScript', level: 5 },
        { id: 'skill-2', name: 'React / Vue', level: 5 },
        { id: 'skill-3', name: 'Node.js', level: 4 },
        { id: 'skill-4', name: 'Webpack / Vite', level: 4 },
        { id: 'skill-5', name: '性能优化 / 工程化', level: 4 },
      ],
      certificates: [
        { id: 'cert-1', name: 'CET-6 英语六级', date: '2018-06' },
        { id: 'cert-2', name: '软考中级·软件设计师', date: '2021-11' },
      ],
    },
  },
  {
    id: 'product',
    name: '产品经理',
    resume: {
      basic: {
        name: '王芳',
        title: '产品经理',
        email: 'wangfang@example.com',
        phone: '139-1111-2222',
        location: '上海',
        birthYear: '1996',
        website: '',
        summary:
          '4 年互联网产品经理经验，完整负责过 2 款从 0 到 1 的 B 端产品，擅长需求分析、原型设计与数据驱动迭代，具备出色的跨团队协调能力。',
      },
      education: [
        {
          id: 'edu-1',
          school: '复旦大学',
          major: '信息管理与信息系统',
          degree: '本科',
          start: '2014-09',
          end: '2018-06',
          description: '主修信息系统、管理科学；担任学生会外联部部长。',
        },
      ],
      work: [
        {
          id: 'work-1',
          company: '美团',
          title: '高级产品经理',
          start: '2021-03',
          end: '至今',
          description:
            '负责商家后台核心模块的产品规划与落地；\n通过优化订单处理流程，商家操作效率提升 40%；\n推动 3 个大型版本迭代，覆盖 50 万+ 商家。',
        },
        {
          id: 'work-2',
          company: '携程',
          title: '产品经理',
          start: '2018-07',
          end: '2021-02',
          description:
            '负责酒店预订流程优化，转化率提升 15%；\n主导用户调研与竞品分析，输出 30+ 份产品方案。',
        },
      ],
      projects: [
        {
          id: 'proj-1',
          name: '商家经营数据看板',
          role: '产品负责人',
          start: '2022-06',
          end: '2022-12',
          link: '',
          description:
            '从 0 搭建商家经营数据看板，整合 8 个数据源，上线后商家周活提升 35%，获年度最佳产品创新奖。',
        },
      ],
      skills: [
        { id: 'skill-1', name: 'Axure / Figma', level: 5 },
        { id: 'skill-2', name: '需求分析 / 用户调研', level: 5 },
        { id: 'skill-3', name: '数据分析（SQL / Excel）', level: 4 },
        { id: 'skill-4', name: '项目管理', level: 4 },
      ],
      certificates: [
        { id: 'cert-1', name: 'PMP 项目管理认证', date: '2022-09' },
      ],
    },
  },
  {
    id: 'ecommerce',
    name: '电商运营',
    resume: {
      basic: {
        name: '李婷',
        title: '电商运营主管',
        email: 'liting@example.com',
        phone: '137-3333-4444',
        location: '杭州',
        birthYear: '1997',
        website: '',
        summary:
          '5 年电商运营经验，操盘过天猫、抖音双平台店铺，擅长爆款打造与付费投放，管理 GMV 过亿，具备从选品到售后的全链路运营能力。',
      },
      education: [
        {
          id: 'edu-1',
          school: '浙江工商大学',
          major: '市场营销',
          degree: '本科',
          start: '2015-09',
          end: '2019-06',
          description: '主修市场营销、消费者行为学；获全国大学生营销策划大赛二等奖。',
        },
      ],
      work: [
        {
          id: 'work-1',
          company: '某美妆品牌',
          title: '电商运营主管',
          start: '2021-05',
          end: '至今',
          description:
            '负责天猫旗舰店与抖音小店整体运营；\n打造 3 个百万级爆款，店铺年 GMV 从 3000 万增长至 1.2 亿；\n搭建直播带货体系，月 GMV 峰值突破 800 万。',
        },
        {
          id: 'work-2',
          company: '某电商代运营公司',
          title: '电商运营专员',
          start: '2019-07',
          end: '2021-04',
          description:
            '负责 5 家店铺的日常运营与活动策划；\n通过优化搜索词与详情页，自然流量提升 60%；\n管理广告投放 ROI 稳定在 1:3 以上。',
        },
      ],
      projects: [
        {
          id: 'proj-1',
          name: '抖音直播从 0 到 1 项目',
          role: '项目负责人',
          start: '2022-03',
          end: '2022-12',
          link: '',
          description:
            '组建 6 人直播团队，从选品、话术到投流全链路搭建，3 个月实现单场 GMV 破百万，月均 ROI 1:2.8。',
        },
      ],
      skills: [
        { id: 'skill-1', name: '天猫/京东/抖音运营', level: 5 },
        { id: 'skill-2', name: '千川/直通车投放', level: 5 },
        { id: 'skill-3', name: '爆款打造 / 选品', level: 4 },
        { id: 'skill-4', name: '数据分析', level: 4 },
        { id: 'skill-5', name: '直播运营', level: 4 },
      ],
      certificates: [
        { id: 'cert-1', name: '阿里巴巴电商运营认证', date: '2020-08' },
      ],
    },
  },
  {
    id: 'sales',
    name: '销售经理',
    resume: {
      basic: {
        name: '刘强',
        title: '销售经理',
        email: 'liuqiang@example.com',
        phone: '136-5555-6666',
        location: '广州',
        birthYear: '1995',
        website: '',
        summary:
          '6 年 B2B 销售经验，擅长大客户开发与团队管理，累计签单金额超 8000 万，多次获得年度销售冠军，具备从线索到回款的全流程管理能力。',
      },
      education: [
        {
          id: 'edu-1',
          school: '华南理工大学',
          major: '工商管理',
          degree: '本科',
          start: '2013-09',
          end: '2017-06',
          description: '主修市场营销、商务谈判；校篮球队队长。',
        },
      ],
      work: [
        {
          id: 'work-1',
          company: '某 SaaS 科技公司',
          title: '销售经理',
          start: '2021-04',
          end: '至今',
          description:
            '带领 8 人销售团队，负责华南区大客户拓展；\n年度团队业绩从 1800 万提升至 3200 万，同比增长 78%；\n建立行业标杆客户案例库，提升新签转化率 25%。',
        },
        {
          id: 'work-2',
          company: '某企业服务公司',
          title: '大客户销售',
          start: '2017-07',
          end: '2021-03',
          description:
            '负责制造业客户的软件解决方案销售；\n连续 3 年超额完成销售目标，2019 年获年度销售冠军；\n累计签单 50+ 家客户，客单价平均 60 万。',
        },
      ],
      projects: [
        {
          id: 'proj-1',
          name: '华南区行业标杆客户攻坚',
          role: '负责人',
          start: '2022-01',
          end: '2022-08',
          link: '',
          description:
            '针对头部制造企业制定定制化方案，历时 7 个月签下年度最大单（合同额 800 万），并转化为区域标杆案例。',
        },
      ],
      skills: [
        { id: 'skill-1', name: '大客户开发 / B2B 销售', level: 5 },
        { id: 'skill-2', name: '销售团队管理', level: 5 },
        { id: 'skill-3', name: '商务谈判', level: 4 },
        { id: 'skill-4', name: 'CRM 管理', level: 4 },
      ],
      certificates: [
        { id: 'cert-1', name: '年度销售冠军（2019）', date: '2019-12' },
      ],
    },
  },
  {
    id: 'accounting',
    name: '会计',
    resume: {
      basic: {
        name: '陈静',
        title: '会计',
        email: 'chenjing@example.com',
        phone: '135-7777-8888',
        location: '深圳',
        birthYear: '1999',
        website: '',
        summary:
          '3 年企业会计经验，熟悉全盘账务处理、税务申报与财务分析，持有初级会计师证书，工作严谨细致，熟练使用金蝶、用友及 Excel 高级功能。',
      },
      education: [
        {
          id: 'edu-1',
          school: '深圳大学',
          major: '会计学',
          degree: '本科',
          start: '2017-09',
          end: '2021-06',
          description: '主修财务会计、成本会计、税法；GPA 3.5/4.0。',
        },
      ],
      work: [
        {
          id: 'work-1',
          company: '某科技公司',
          title: '会计',
          start: '2021-07',
          end: '至今',
          description:
            '负责公司全盘账务处理，每月出具财务报表；\n独立完成增值税、企业所得税等月度/年度申报，连续 3 年零差错；\n参与年度审计对接，协助完成 2 轮融资财务尽调。',
        },
        {
          id: 'work-2',
          company: '某代账公司',
          title: '会计助理',
          start: '2020-06',
          end: '2021-06',
          description:
            '负责 30+ 家中小企业的记账报税工作；\n优化费用报销流程，月度结账时间缩短 30%。',
        },
      ],
      projects: [
        {
          id: 'proj-1',
          name: '财务系统上线实施',
          role: '核心成员',
          start: '2022-03',
          end: '2022-09',
          link: '',
          description:
            '参与 ERP 财务模块选型与实施，主导新旧系统数据迁移，迁移准确率 100%，上线后结账效率提升 40%。',
        },
      ],
      skills: [
        { id: 'skill-1', name: '全盘账务处理', level: 5 },
        { id: 'skill-2', name: '税务申报', level: 5 },
        { id: 'skill-3', name: '金蝶 / 用友', level: 4 },
        { id: 'skill-4', name: 'Excel 高级应用', level: 4 },
        { id: 'skill-5', name: '财务分析', level: 4 },
      ],
      certificates: [
        { id: 'cert-1', name: '初级会计师', date: '2020-08' },
        { id: 'cert-2', name: 'CET-6 英语六级', date: '2019-06' },
      ],
    },
  },
  {
    id: 'hr',
    name: '人力资源专员',
    resume: {
      basic: {
        name: '赵敏',
        title: '人力资源专员',
        email: 'zhaomin@example.com',
        phone: '134-9999-0000',
        location: '成都',
        birthYear: '2000',
        website: '',
        summary:
          '2 年人力资源经验，熟悉招聘全流程与员工关系管理，擅长校招与新媒体招聘渠道运营，具备良好沟通能力与执行力，持有人力资源管理师证书。',
      },
      education: [
        {
          id: 'edu-1',
          school: '四川大学',
          major: '人力资源管理',
          degree: '本科',
          start: '2018-09',
          end: '2022-06',
          description: '主修人力资源管理、劳动法、组织行为学；获国家奖学金。',
        },
      ],
      work: [
        {
          id: 'work-1',
          company: '某互联网公司',
          title: '人力资源专员',
          start: '2022-07',
          end: '至今',
          description:
            '负责技术岗位招聘全流程，年度入职 80+ 人；\n搭建新媒体招聘渠道（小红书/公众号），简历量提升 2 倍；\n组织新员工培训与团建活动，员工满意度达 92%。',
        },
      ],
      projects: [
        {
          id: 'proj-1',
          name: '应届生校招项目',
          role: '核心执行人',
          start: '2023-08',
          end: '2023-11',
          link: '',
          description:
            '统筹 5 所高校的校招宣讲与面试安排，接收简历 3000+ 份，最终入职 45 人，获"最佳校招团队"称号。',
        },
      ],
      skills: [
        { id: 'skill-1', name: '招聘全流程', level: 5 },
        { id: 'skill-2', name: '员工关系管理', level: 4 },
        { id: 'skill-3', name: '劳动法基础', level: 4 },
        { id: 'skill-4', name: 'Excel / 招聘系统', level: 4 },
        { id: 'skill-5', name: '新媒体运营', level: 4 },
      ],
      certificates: [
        { id: 'cert-1', name: '人力资源管理师（四级）', date: '2023-05' },
      ],
    },
  },
]
