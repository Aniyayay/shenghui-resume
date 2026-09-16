// 神绘简历 - 全局状态管理（Zustand + localStorage 持久化）
// 数据自动保存到 localStorage（key: shenghui-resume:v1），刷新页面不丢失。

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {
  BasicInfo,
  ResumeData,
  SectionItem,
  SectionKey,
  emptyResume,
  genId,
} from '../types/resume'
import { exampleResume } from '../data/defaultResume'

export type SectionItemPayload = Record<string, unknown>

interface ResumeStore {
  /** 简历数据 */
  data: ResumeData
  /** 当前模板 id */
  templateId: string
  /** 自定义主题色（空字符串 = 使用各模板默认主色） */
  themeColor: string
  /** DeepSeek API Key（仅存本地浏览器，用户自备） */
  apiKey: string
  /** AI 生成的求职信（可选保存） */
  coverLetter: string

  /** 整体替换数据（如加载示例） */
  setData: (data: ResumeData) => void
  /** 更新基本信息 */
  updateBasic: (patch: Partial<BasicInfo>) => void
  /** 新增一个数组 section 项 */
  addSectionItem: (section: SectionKey, item?: Record<string, unknown>) => void
  /** 更新数组 section 的某一项 */
  updateSectionItem: (
    section: SectionKey,
    id: string,
    patch: Record<string, unknown>,
  ) => void
  /** 删除数组 section 的某一项 */
  removeSectionItem: (section: SectionKey, id: string) => void
  /** 整体替换数组 section（如 AI 生成技能列表） */
  replaceSectionItems: (section: SectionKey, items: Record<string, unknown>[]) => void
  /** 切换模板 */
  setTemplate: (id: string) => void
  /** 设置主题色 */
  setThemeColor: (color: string) => void
  /** 设置 API Key */
  setApiKey: (key: string) => void
  /** 保存求职信 */
  setCoverLetter: (text: string) => void
  /** 加载示例简历 */
  loadExample: () => void
  /** 清空为空白简历 */
  resetAll: () => void
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      data: emptyResume(),
      templateId: 'classic',
      themeColor: '',
      apiKey: '',
      coverLetter: '',

      setData: (data) => set({ data }),

      updateBasic: (patch) =>
        set((s) => ({ data: { ...s.data, basic: { ...s.data.basic, ...patch } } })),

      addSectionItem: (section, item) =>
        set((s) => {
          // 内部用宽松类型操作，避免联合类型的 TS 报错
          const list = s.data[section] as any[]
          const base: Record<string, unknown> = { id: genId() }
          if (section === 'skills') {
            base.level = 3
            base.name = ''
          }
          const next = [...list, { ...base, ...(item ?? {}) }]
          return { data: { ...s.data, [section]: next } }
        }),

      updateSectionItem: (section, id, patch) =>
        set((s) => {
          const list = s.data[section] as any[]
          const next = list.map((it: any) => (it.id === id ? { ...it, ...patch } : it))
          return { data: { ...s.data, [section]: next } }
        }),

      removeSectionItem: (section, id) =>
        set((s) => {
          const list = s.data[section] as any[]
          return { data: { ...s.data, [section]: list.filter((it: any) => it.id !== id) } }
        }),

      replaceSectionItems: (section, items) =>
        set((s) => ({ data: { ...s.data, [section]: items } })),

      setTemplate: (id) => set({ templateId: id }),

      setThemeColor: (color) => set({ themeColor: color }),

      setApiKey: (key) => set({ apiKey: key }),

      setCoverLetter: (text) => set({ coverLetter: text }),

      loadExample: () => set({ data: exampleResume }),

      resetAll: () => set({ data: emptyResume() }),
    }),
    {
      name: 'shenghui-resume:v1',
    },
  ),
)
