// AI 助手面板：DeepSeek 智能撰写 / 润色 / 求职信 / 优化建议
import { useEffect, useState } from 'react'
import { useResumeStore } from '../../../store/useResumeStore'
import {
  AIResult,
  RESUME_EXPERT_SYSTEM,
  callDeepSeek,
  checkAIConfig,
} from '../../../utils/ai'
import { genId } from '../../../types/resume'
import { Field, TextArea, TextInput } from '../fields'

type Task =
  | 'summary'
  | 'work'
  | 'project'
  | 'skills'
  | 'cover'
  | 'optimize'

const tasks: Array<{ key: Task; label: string }> = [
  { key: 'summary', label: '润色个人简介' },
  { key: 'work', label: '扩写工作经历' },
  { key: 'project', label: '扩写项目经历' },
  { key: 'skills', label: '生成技能建议' },
  { key: 'cover', label: '写求职信' },
  { key: 'optimize', label: '全文优化建议' },
]

/** 把 AI 返回的技能文本拆成技能名列表（兼容换行/顿号/逗号/序号） */
function parseSkillLines(text: string): string[] {
  return text
    .split(/\n|、|，|,|；|;/)
    .map((s) => s.replace(/^[\d.、\-\*\s]+/, '').replace(/^["'“”]+|["'“”]+$/g, '').trim())
    .filter((s) => s.length > 0)
}

export default function AIPanel() {
  const apiKey = useResumeStore((s) => s.apiKey)
  const setApiKey = useResumeStore((s) => s.setApiKey)
  const data = useResumeStore((s) => s.data)
  const updateBasic = useResumeStore((s) => s.updateBasic)
  const updateSectionItem = useResumeStore((s) => s.updateSectionItem)
  const replaceSectionItems = useResumeStore((s) => s.replaceSectionItems)
  const setCoverLetter = useResumeStore((s) => s.setCoverLetter)

  const [task, setTask] = useState<Task>('summary')
  const [targetId, setTargetId] = useState('')
  const [notes, setNotes] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')
  const [error, setError] = useState('')
  const [applied, setApplied] = useState('')
  // 服务端是否已配置共享 Key（null = 检测中）
  const [serverKey, setServerKey] = useState<boolean | null>(null)

  useEffect(() => {
    checkAIConfig().then(setServerKey)
  }, [])

  const needTarget = task === 'work' || task === 'project'
  const notesLabel =
    task === 'cover'
      ? '目标公司与职位（可选）'
      : '补充要点（可选：关键词 / 成果数字 / 想突出的亮点）'
  const notesPlaceholder =
    task === 'cover'
      ? '例如：字节跳动 · 高级前端开发工程师'
      : task === 'skills'
        ? '例如：熟悉 React 生态、微前端、可视化、Node 后端'
        : '例如：负责支付系统重构，QPS 从 2000 提升到 8000'

  const buildUserPrompt = (): string => {
    const { basic } = data
    if (task === 'summary') {
      return `以下是我简历中的个人简介原文，请帮我润色得更专业、更有吸引力（保留真实信息，不要虚构）：
---
${basic.summary || '（暂无原文，请根据我补充的要点为我撰写）'}
---
补充要点：${notes || '（无）'}`
    }
    if (task === 'work') {
      const w = data.work.find((x) => x.id === targetId)
      return `岗位：${w?.title ?? ''}；公司：${w?.company ?? ''}；时间段：${w?.start ?? ''}-${w?.end ?? ''}
现有描述：${w?.description || '（无）'}
请改写成结果导向的工作成果要点。补充要点：${notes || '（无）'}`
    }
    if (task === 'project') {
      const p = data.projects.find((x) => x.id === targetId)
      return `项目：${p?.name ?? ''}；角色：${p?.role ?? ''}
现有描述：${p?.description || '（无）'}
请改写成项目亮点与量化成果。补充要点：${notes || '（无）'}`
    }
    if (task === 'skills') {
      const workDesc = data.work.map((w) => `${w.company} ${w.title}：${w.description}`).join('\n')
      const projDesc = data.projects.map((p) => `${p.name}：${p.description}`).join('\n')
      return `根据我的工作与项目经历，推荐 8-12 个最值得写在简历上的技能关键词（技术栈/工具/软技能均可）：
工作经历：
${workDesc || '（无）'}
项目经历：
${projDesc || '（无）'}
补充说明：${notes || '（无）'}
请直接输出技能列表，每行一个，不要编号、不要解释。`
    }
    if (task === 'cover') {
      const workBrief = data.work
        .slice(0, 2)
        .map((w) => `${w.company}·${w.title}（${w.start}-${w.end}）`)
        .join('，')
      return `请为以下求职者写一封中文求职信（300-400 字，正式得体，突出匹配度）：
姓名：${basic.name || '（未填）'}
求职意向：${basic.title || '（未填）'}
经历概要：${workBrief || data.projects.map((p) => p.name).join('，') || '（未填）'}
目标公司与职位：${notes || '（未填写，写通用版）'}
要求：直接输出求职信正文，包含称呼、自我介绍与优势、为何适合该岗位、期待与致谢。不要输出主题行。`
    }
    // optimize
    const brief = {
      基本信息: {
        姓名: basic.name,
        求职意向: basic.title,
        个人简介: basic.summary,
      },
      工作经历: data.work.map((w) => ({ 公司: w.company, 职位: w.title, 描述: w.description })),
      项目经历: data.projects.map((p) => ({ 项目: p.name, 角色: p.role, 描述: p.description })),
      教育经历: data.education.map((e) => ({ 学校: e.school, 专业: e.major, 学历: e.degree })),
      技能: data.skills.map((s) => s.name),
    }
    return `以下是我整份简历的数据（JSON）。请以资深 HR 的视角做全面诊断，给出可执行的优化建议：
${JSON.stringify(brief, null, 1)}
请按以下结构输出：
1. 整体评价（1-2 句）
2. 突出问题（按严重程度列出，2-5 条）
3. 逐项改进建议（基本信息/工作经历/项目经历/技能，分别给出）
4. 加分建议（如何让简历更出彩）
注意：指出问题时要具体，直接对应我的简历内容。`
  }

  const handleGenerate = async () => {
    setLoading(true)
    setError('')
    setResult('')
    setApplied('')
    const r: AIResult = await callDeepSeek({
      apiKey,
      system: RESUME_EXPERT_SYSTEM,
      user: buildUserPrompt(),
    })
    if (r.ok) {
      setResult(r.content ?? '')
    } else {
      setError(r.error ?? '生成失败')
    }
    setLoading(false)
  }

  const applyLabel =
    task === 'summary' || task === 'work' || task === 'project'
      ? '应用为简历内容'
      : task === 'skills'
        ? '应用为技能列表'
        : task === 'cover'
          ? '保存求职信'
          : '复制建议'

  const handleApply = () => {
    if (!result) return
    if (task === 'summary') {
      updateBasic({ summary: result })
      setApplied('已应用为个人简介 ✓')
    } else if (task === 'work' && targetId) {
      updateSectionItem('work', targetId, { description: result })
      setApplied('已应用为工作描述 ✓')
    } else if (task === 'project' && targetId) {
      updateSectionItem('projects', targetId, { description: result })
      setApplied('已应用为项目描述 ✓')
    } else if (task === 'skills') {
      const names = parseSkillLines(result)
      if (names.length === 0) {
        setError('未能从结果中解析出技能，请重试或手动填写')
        return
      }
      replaceSectionItems(
        'skills',
        names.map((name) => ({ id: genId(), name, level: 3 })),
      )
      setApplied(`已应用 ${names.length} 个技能 ✓`)
    } else if (task === 'cover') {
      setCoverLetter(result)
      setApplied('求职信已保存，可在预览区右上角「💌 求职信」查看 ✓')
    } else {
      navigator.clipboard?.writeText(result).catch(() => {})
      setApplied('建议已复制到剪贴板 ✓')
    }
  }

  return (
    <div className="ai-panel">
      {serverKey === true ? (
        <div className="ai-tip ai-tip-ok">
          ✅ 本网站已配置 AI 能力，无需 API Key，打开即可使用（由部署者统一提供）。
        </div>
      ) : (
        <>
          <div className="ai-tip">
            🤖 AI 助手使用 <b>DeepSeek 官方 API</b>。请填写你自己的 API Key（仅保存在浏览器本地，
            不会上传到服务器之外的任何地方）。
          </div>
          <Field label="DeepSeek API Key">
            <TextInput
              type="password"
              value={apiKey}
              onChange={setApiKey}
              placeholder="sk-..."
            />
          </Field>
        </>
      )}

      <div className="ai-tasks">
        {tasks.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`ai-task-btn ${task === t.key ? 'active' : ''}`}
            onClick={() => {
              setTask(t.key)
              setResult('')
              setApplied('')
              setTargetId('')
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {needTarget && (
        <Field label={task === 'work' ? '选择要扩写的工作经历' : '选择要扩写的项目'}>
          <select
            className="field-input"
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
          >
            <option value="">请选择…</option>
            {(task === 'work' ? data.work : data.projects).map((x) => (
              <option key={x.id} value={x.id}>
                {task === 'work'
                  ? `${(x as { company: string }).company} - ${(x as { title: string }).title}`
                  : `${(x as { name: string }).name}（${(x as { role: string }).role}）`}
              </option>
            ))}
          </select>
        </Field>
      )}

      <Field label={notesLabel}>
        <TextArea
          value={notes}
          onChange={setNotes}
          rows={3}
          placeholder={notesPlaceholder}
        />
      </Field>

      <button
        type="button"
        className="btn btn-primary ai-generate"
        onClick={handleGenerate}
        disabled={loading}
      >
        {loading ? '⏳ 生成中…' : '✨ AI 生成'}
      </button>

      {error && <div className="ai-error">{error}</div>}
      {applied && <div className="ai-applied">✅ {applied}</div>}

      {result && (
        <div className="ai-result">
          <div className="ai-result-head">
            <span>生成结果</span>
            <button type="button" className="btn btn-primary btn-sm" onClick={handleApply}>
              {applyLabel}
            </button>
          </div>
          <pre className="ai-result-text">{result}</pre>
        </div>
      )}
    </div>
  )
}
