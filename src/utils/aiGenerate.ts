// 神绘简历 - AI 结构化生成管线
// 1) generateResumeDraft：自然语言经历描述 → 完整简历草稿
// 2) parseLegacyResume：旧简历文本 → 结构化草稿
// 二者共用 DRAFT_SYSTEM 提示词，让 DeepSeek 输出严格 JSON，前端容错解析。

import { AIResult, callDeepSeek } from './ai'
import {
  BasicInfo,
  ResumeData,
  genId,
} from '../types/resume'

export interface ResumeDraft {
  summary?: string
  work?: Array<{
    company: string
    title: string
    start: string
    end: string
    description: string
  }>
  projects?: Array<{
    name: string
    role: string
    link: string
    start: string
    end: string
    description: string
  }>
  education?: Array<{
    school: string
    major: string
    degree: string
    start: string
    end: string
    description: string
  }>
  skills?: string[]
  certificates?: Array<{ name: string; date: string }>
}

export interface DraftResult {
  ok: boolean
  draft?: ResumeDraft
  error?: string
}

const DRAFT_SYSTEM = `你是一位资深的简历撰写专家，精通中文求职简历的规范与"结果导向、量化成果"的表达方式。
你的任务：根据用户提供的求职信息，生成一份结构化、可直接投递的简历内容。

要求：
1. 严格输出合法 JSON，不要输出任何其他文字、注释、解释或 markdown 代码块标记。
2. JSON 结构必须完全符合：
{
  "summary": "个人简介（3-4句，突出核心优势、经验年限与量化成果）",
  "work": [
    {"company":"公司名称","title":"职位","start":"开始年月，格式YYYY-MM","end":"结束年月或'至今'","description":"2-4条工作成果，用\\n换行分隔，动词开头、尽量量化（数字/百分比/规模）"}
  ],
  "projects": [
    {"name":"项目名称","role":"担任角色","link":"链接或空字符串","start":"YYYY-MM","end":"YYYY-MM或至今","description":"项目亮点、个人贡献、量化成果"}
  ],
  "education": [
    {"school":"学校","major":"专业","degree":"学历（本科/硕士/博士/大专）","start":"YYYY-MM","end":"YYYY-MM","description":"GPA、主修课程、荣誉等"}
  ],
  "skills": ["技能1","技能2","技能3"],
  "certificates": [
    {"name":"证书名称","date":"获得时间YYYY-MM"}
  ]
}

3. 用户明确提供的信息必须保留；用户没提供且无法合理推断的字段用空字符串或空数组，严禁编造具体公司名、人名、精确数据。
4. 如果用户信息很少，可以基于岗位常识补充通用的职责描述（但不得虚构雇主与数字）。
5. 时间格式统一 YYYY-MM。`

/** 从自然语言描述生成完整简历草稿 */
export async function generateResumeDraft(opts: {
  apiKey: string
  title: string
  description: string
  basic?: Partial<BasicInfo>
}): Promise<DraftResult> {
  const user = `求职意向岗位：${opts.title || '（未填）'}
基本信息：姓名 ${opts.basic?.name || '（未填）'} ｜ 电话 ${opts.basic?.phone || ''} ｜ 邮箱 ${opts.basic?.email || ''} ｜ 城市 ${opts.basic?.location || '（未填）'}

以下是我的经历描述（可能口语化、零散、或来自旧简历），请整理成完整简历 JSON：
---
${opts.description}
---
请直接输出 JSON。`

  const r: AIResult = await callDeepSeek({
    apiKey: opts.apiKey,
    system: DRAFT_SYSTEM,
    user,
  })
  if (!r.ok) return { ok: false, error: r.error }
  return { ok: true, draft: parseDraft(r.content ?? '') }
}

/** 从旧简历文本解析为结构化草稿 */
export async function parseLegacyResume(opts: {
  apiKey: string
  text: string
}): Promise<DraftResult> {
  const user = `这是一份现有简历的文本内容。请完整提取其中的个人信息、工作/项目/教育经历、技能、证书，并重构为规范的结构化简历 JSON（保留原有真实信息，缺失字段用空字符串/空数组）：
---
${opts.text}
---
请直接输出 JSON。`

  const r: AIResult = await callDeepSeek({
    apiKey: opts.apiKey,
    system: DRAFT_SYSTEM,
    user,
  })
  if (!r.ok) return { ok: false, error: r.error }
  return { ok: true, draft: parseDraft(r.content ?? '') }
}

/** 容错解析 AI 返回的 JSON */
function parseDraft(content: string): ResumeDraft | undefined {
  let text = content.trim()
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/)
  if (fence) text = fence[1].trim()

  const tryParse = (s: string): ResumeDraft | undefined => {
    try {
      const obj = JSON.parse(s)
      if (obj && typeof obj === 'object') return normalizeDraft(obj)
    } catch {
      /* continue */
    }
    return undefined
  }

  const direct = tryParse(text)
  if (direct) return direct

  // 尝试提取第一个 {...} 块
  const start = text.indexOf('{')
  const end = text.lastIndexOf('}')
  if (start >= 0 && end > start) {
    const block = tryParse(text.slice(start, end + 1))
    if (block) return block
  }
  return undefined
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeDraft(obj: any): ResumeDraft {
  const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : [])
  const str = (v: unknown): string => (typeof v === 'string' ? v : '')
  const m = (v: unknown) => ({
    company: str((v as Record<string, unknown>)?.company),
    title: str((v as Record<string, unknown>)?.title),
    start: str((v as Record<string, unknown>)?.start),
    end: str((v as Record<string, unknown>)?.end),
    description: str((v as Record<string, unknown>)?.description),
  })
  return {
    summary: str(obj?.summary),
    work: arr(obj?.work).map(m),
    projects: arr(obj?.projects).map((p: unknown) => ({
      name: str((p as Record<string, unknown>)?.name),
      role: str((p as Record<string, unknown>)?.role),
      link: str((p as Record<string, unknown>)?.link ?? ''),
      start: str((p as Record<string, unknown>)?.start),
      end: str((p as Record<string, unknown>)?.end),
      description: str((p as Record<string, unknown>)?.description),
    })),
    education: arr(obj?.education).map((e: unknown) => ({
      school: str((e as Record<string, unknown>)?.school),
      major: str((e as Record<string, unknown>)?.major),
      degree: str((e as Record<string, unknown>)?.degree),
      start: str((e as Record<string, unknown>)?.start),
      end: str((e as Record<string, unknown>)?.end),
      description: str((e as Record<string, unknown>)?.description),
    })),
    skills: arr(obj?.skills)
      .map((s) => (typeof s === 'string' ? s : str((s as Record<string, unknown>)?.name)))
      .filter(Boolean) as string[],
    certificates: arr(obj?.certificates).map((c: unknown) => ({
      name: str((c as Record<string, unknown>)?.name),
      date: str((c as Record<string, unknown>)?.date),
    })),
  }
}

/** 草稿 → 完整 ResumeData（补 id、合并基本信息） */
export function draftToResume(
  draft: ResumeDraft,
  basic: Partial<BasicInfo> = {},
): ResumeData {
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
      ...basic,
      summary: draft.summary ?? basic.summary ?? '',
    },
    work: (draft.work ?? []).map((w) => ({ id: genId(), ...w })),
    projects: (draft.projects ?? []).map((p) => ({ id: genId(), ...p })),
    education: (draft.education ?? []).map((e) => ({ id: genId(), ...e })),
    skills: (draft.skills ?? []).map((name) => ({ id: genId(), name, level: 3 })),
    certificates: (draft.certificates ?? []).map((c) => ({ id: genId(), ...c })),
  }
}
