// 神绘简历 - 简历数据模型
// 所有 section 均为数据驱动，模板渲染器只读这份数据，表单只改这份数据。

/** 基本信息 */
export interface BasicInfo {
  name: string        // 姓名
  title: string       // 求职意向 / 期望职位
  email: string
  phone: string
  location: string    // 现居城市
  birthYear?: string  // 出生年份（可选）
  website?: string    // 个人网站 / GitHub / 作品集
  avatar?: string     // 头像图片（dataURL 或 URL，可选）
  summary: string     // 个人简介 / 自我评价
}

/** 教育经历 */
export interface Education {
  id: string
  school: string
  major: string
  degree: string      // 学历（本科 / 硕士 / 博士…）
  start: string
  end: string
  description: string // 在校经历、主修课程、荣誉等
}

/** 工作经历 */
export interface WorkExperience {
  id: string
  company: string
  title: string       // 职位
  start: string
  end: string
  description: string // 工作内容与成果（支持多行，AI 可辅助撰写）
}

/** 项目经历 */
export interface Project {
  id: string
  name: string
  role: string
  link?: string
  start: string
  end: string
  description: string
}

/** 技能项 */
export interface SkillItem {
  id: string
  name: string
  level: number       // 熟练度 1-5
}

/** 证书 / 荣誉 */
export interface Certificate {
  id: string
  name: string
  date: string
}

/** 完整简历数据 */
export interface ResumeData {
  basic: BasicInfo
  education: Education[]
  work: WorkExperience[]
  projects: Project[]
  skills: SkillItem[]
  certificates: Certificate[]
}

/** 数组型 section 的 key */
export type SectionKey = 'education' | 'work' | 'projects' | 'skills' | 'certificates'

/** 由 section key 取到对应的数组项类型 */
export type SectionItem<S extends SectionKey> = ResumeData[S][number]

/** 生成一个稳定 id（无 crypto 环境降级） */
export function genId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
}

/** 空简历数据 */
export function emptyResume(): ResumeData {
  return {
    basic: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      birthYear: '',
      website: '',
      avatar: '',
      summary: '',
    },
    education: [],
    work: [],
    projects: [],
    skills: [],
    certificates: [],
  }
}
