// 神绘简历 - 模板注册表
// 新增模板：在 templates 数组里注册 { id, name, desc, component }
// 模板组件接收 resume 数据，负责把数据渲染成 A4 页面。

import type { ComponentType } from 'react'
import type { ResumeData } from '../types/resume'
import ClassicTemplate from '../components/templates/ClassicTemplate'
import ModernTemplate from '../components/templates/ModernTemplate'
import FreshBlueTemplate from '../components/templates/FreshBlueTemplate'
import MinimalTemplate from '../components/templates/MinimalTemplate'
import ColorSideTemplate from '../components/templates/ColorSideTemplate'
import TimelineTemplate from '../components/templates/TimelineTemplate'
import BannerTemplate from '../components/templates/BannerTemplate'
import AtsTemplate from '../components/templates/AtsTemplate'

export interface TemplateMeta {
  id: string
  name: string
  desc: string
  component: ComponentType<{ resume: ResumeData }>
}

export const templates: TemplateMeta[] = [
  {
    id: 'classic',
    name: '经典商务',
    desc: '稳重专业，适合传统行业',
    component: ClassicTemplate,
  },
  {
    id: 'modern',
    name: '现代简洁',
    desc: '清爽大方，适合互联网/设计',
    component: ModernTemplate,
  },
  {
    id: 'fresh',
    name: '清新蓝',
    desc: '明亮清爽，适合新兴行业',
    component: FreshBlueTemplate,
  },
  {
    id: 'minimal',
    name: '极简黑白',
    desc: '克制专业，大留白',
    component: MinimalTemplate,
  },
  {
    id: 'colorside',
    name: '多彩侧栏',
    desc: '视觉突出，左侧彩色边栏',
    component: ColorSideTemplate,
  },
  {
    id: 'timeline',
    name: '时间轴',
    desc: '经历按时间线呈现，清晰易扫读',
    component: TimelineTemplate,
  },
  {
    id: 'banner',
    name: '顶栏横幅',
    desc: '顶部深色横幅，专业醒目',
    component: BannerTemplate,
  },
  {
    id: 'ats',
    name: '单栏 ATS',
    desc: '招聘系统解析率最高，外企/大厂投递首选',
    component: AtsTemplate,
  },
]

export function getTemplate(id: string): TemplateMeta {
  return templates.find((t) => t.id === id) ?? templates[0]
}
