// 神绘简历 - 简历评分器（本地规则，即时评分，无需调用 AI）
// 从完整性、量化成果、ATS 友好度等维度给简历打分，并给出可执行的改进建议。

import { ResumeData } from '../types/resume'

export interface ScoreItem {
  key: string
  label: string
  score: number
  max: number
  tips: string[]
}

export interface ResumeScore {
  total: number
  max: number
  level: '优秀' | '良好' | '一般' | '待完善'
  items: ScoreItem[]
}

/** 量化成果检测：出现数字+单位，或提升/增长等结果词 */
const QUANT_RE = /(\d[\d,.，]*(\.\d+)?\s*[%％万亿倍人次天月年元s位家个]|提升|增长|优化|降低|减少|翻倍|第一|前\d|top)/

function quantCount(text: string): number {
  if (!text) return 0
  const lines = text.split(/\n/).filter(Boolean)
  return lines.filter((l) => QUANT_RE.test(l)).length
}

function hasContent(s: string | undefined): boolean {
  return Boolean(s && s.trim().length > 0)
}

export function scoreResume(data: ResumeData): ResumeScore {
  const items: ScoreItem[] = []
  const tips: string[] = []

  // ---- 基本信息 ----
  const basic = data.basic
  let basicScore = 0
  const basicTips: string[] = []
  if (hasContent(basic.name)) basicScore += 5
  else basicTips.push('缺少姓名')
  if (hasContent(basic.phone)) basicScore += 5
  else basicTips.push('缺少联系电话')
  if (hasContent(basic.email)) basicScore += 5
  else basicTips.push('缺少邮箱')
  if (hasContent(basic.title)) basicScore += 5
  else basicTips.push('缺少求职意向（面试官无法快速判断你的目标岗位）')
  items.push({ key: 'basic', label: '基本信息', score: basicScore, max: 20, tips: basicTips })

  // ---- 个人简介 ----
  let summaryScore = 0
  const summaryTips: string[] = []
  const summary = basic.summary || ''
  if (hasContent(summary)) {
    summaryScore += 5
    if (summary.length >= 30) summaryScore += 3
    if (quantCount(summary) > 0) summaryScore += 2
    else summaryTips.push('个人简介建议加入量化成果（如年限、规模、成绩）')
  } else {
    summaryTips.push('没有个人简介，建议写 3-4 句自我介绍')
  }
  items.push({ key: 'summary', label: '个人简介', score: summaryScore, max: 10, tips: summaryTips })

  // ---- 工作经历 ----
  let workScore = 0
  const workTips: string[] = []
  const work = data.work || []
  if (work.length === 0) {
    workTips.push('没有工作经历——若为应届生可补充实习/校园项目经历')
  } else {
    workScore += Math.min(work.length, 3) * 4 // 数量，满分 12
    const allDesc = work.map((w) => w.description || '').join('\n')
    const lines = allDesc.split('\n').filter(Boolean)
    if (lines.length >= 3) workScore += 5
    else workTips.push('工作描述偏少，建议每段经历写 3-5 条要点')
    const quant = quantCount(allDesc)
    if (quant >= 3) workScore += 8
    else if (quant >= 1) workScore += 4
    else workTips.push('工作经历几乎没量化成果（数字/百分比/规模），这是面试官最看重的')
    if (work.some((w) => !hasContent(w.company) || !hasContent(w.title))) {
      workTips.push('部分工作经历缺少公司名或职位')
    }
  }
  items.push({ key: 'work', label: '工作经历', score: workScore, max: 25, tips: workTips })

  // ---- 项目经历 ----
  let projScore = 0
  const projTips: string[] = []
  const projects = data.projects || []
  if (projects.length === 0) {
    projTips.push('没有项目经历，建议补充 1-2 个最能体现能力的项目')
  } else {
    projScore += Math.min(projects.length, 4) * 2
    const allDesc = projects.map((p) => p.description || '').join('\n')
    if (quantCount(allDesc) >= 2) projScore += 7
    else projTips.push('项目描述建议突出个人贡献与量化成果')
  }
  items.push({ key: 'projects', label: '项目经历', score: projScore, max: 15, tips: projTips })

  // ---- 教育经历 ----
  let eduScore = 0
  const eduTips: string[] = []
  const edu = data.education || []
  if (edu.length === 0) {
    eduTips.push('没有教育经历，建议补充')
  } else {
    eduScore += 5
    if (
      edu.every(
        (e) => hasContent(e.school) && hasContent(e.major) && hasContent(e.degree),
      )
    ) {
      eduScore += 5
    } else {
      eduTips.push('教育经历建议补全学校、专业、学历')
    }
  }
  items.push({ key: 'education', label: '教育经历', score: eduScore, max: 10, tips: eduTips })

  // ---- 技能 ----
  let skillScore = 0
  const skillTips: string[] = []
  const skills = data.skills || []
  skillScore = Math.min(skills.length, 5) * 2
  if (skills.length === 0) skillTips.push('没有技能项，建议列出 5-8 项与岗位相关的技能')
  items.push({ key: 'skills', label: '专业技能', score: skillScore, max: 10, tips: skillTips })

  // ---- 证书 ----
  const certScore = Math.min((data.certificates || []).length, 4) * 2.5
  items.push({ key: 'certificates', label: '证书荣誉', score: Math.round(certScore), max: 10, tips: [] })

  const total = items.reduce((sum, it) => sum + it.score, 0)
  const max = 100
  const level = total >= 85 ? '优秀' : total >= 70 ? '良好' : total >= 50 ? '一般' : '待完善'

  for (const it of items) tips.push(...it.tips)

  return { total: Math.round(total), max, level, items }
}
