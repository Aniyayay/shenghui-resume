// 神绘简历 - 示例简历数据
// 供用户快速体验「填表 → 预览 → 导出」完整流程，可一键加载或清空。

import { ResumeData } from '../types/resume'

export const exampleResume: ResumeData = {
  basic: {
    name: '张明',
    title: '前端开发工程师',
    email: 'zhangming@example.com',
    phone: '138-0000-0000',
    location: '北京',
    birthYear: '1998',
    website: 'https://github.com/zhangming',
    summary:
      '5 年 Web 前端开发经验，深耕 React / TypeScript 技术栈，主导过多个从 0 到 1 的中大型项目，'
      + '擅长性能优化与工程化建设，追求代码质量与用户体验的平衡。',
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
        '基于 Vite + React + TS 打造的一体化脚手架，内置权限、路由、状态管理等最佳实践，'
      + '已被公司 20+ 业务线采用，平均接入成本从 2 周降到 1 天。',
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
}
