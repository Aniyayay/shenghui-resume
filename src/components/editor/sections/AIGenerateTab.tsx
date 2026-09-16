// 一键生成：AI 描述生成整份简历 / 旧简历文本导入 / 热门岗位示例
import { useEffect, useState } from 'react'
import { useResumeStore } from '../../../store/useResumeStore'
import { checkAIConfig } from '../../../utils/ai'
import {
  ResumeDraft,
  draftToResume,
  generateResumeDraft,
  parseLegacyResume,
} from '../../../utils/aiGenerate'
import { jobSamples } from '../../../data/jobSamples'
import { Field, TextArea, TextInput } from '../fields'

type Mode = 'describe' | 'legacy'

export default function AIGenerateTab() {
  const apiKey = useResumeStore((s) => s.apiKey)
  const data = useResumeStore((s) => s.data)
  const setData = useResumeStore((s) => s.setData)

  const [mode, setMode] = useState<Mode>('describe')
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [legacyText, setLegacyText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [draft, setDraft] = useState<ResumeDraft | null>(null)
  const [applied, setApplied] = useState('')
  const [serverKey, setServerKey] = useState<boolean | null>(null)

  useEffect(() => {
    checkAIConfig().then(setServerKey)
    setTitle(data.basic.title)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const needKey = serverKey === false && !apiKey

  const handleGenerate = async () => {
    if (mode === 'describe' && !description.trim()) {
      setError('请先描述你的经历（哪怕只有几句话）')
      return
    }
    if (mode === 'legacy' && !legacyText.trim()) {
      setError('请粘贴你的旧简历内容')
      return
    }
    setLoading(true)
    setError('')
    setDraft(null)
    setApplied('')
    const r =
      mode === 'describe'
        ? await generateResumeDraft({ apiKey, title, description, basic: data.basic })
        : await parseLegacyResume({ apiKey, text: legacyText })
    if (r.ok && r.draft) {
      setDraft(r.draft)
    } else {
      setError(r.error ?? '生成失败，请稍后重试')
    }
    setLoading(false)
  }

  const applyDraft = () => {
    if (!draft) return
    const resume = draftToResume(draft, {
      ...data.basic,
      title: title || data.basic.title,
    })
    setData(resume)
    setApplied('✅ 已应用！现在可以去右侧预览、切换模板、调整细节')
  }

  const loadSample = (sampleId: string) => {
    const sample = jobSamples.find((s) => s.id === sampleId)
    if (!sample) return
    setData(sample.resume)
    setApplied(`✅ 已加载「${sample.name}」示例，把信息换成你自己的即可`)
  }

  const draftSummary = draft
    ? [
        draft.work?.length ? `${draft.work.length} 段工作经历` : '',
        draft.projects?.length ? `${draft.projects.length} 个项目` : '',
        draft.education?.length ? `${draft.education.length} 段教育` : '',
        draft.skills?.length ? `${draft.skills.length} 项技能` : '',
        draft.certificates?.length ? `${draft.certificates.length} 个证书` : '',
      ]
        .filter(Boolean)
        .join('、')
    : ''

  return (
    <div className="ai-panel">
      <div className="ai-tip">
        🚀 <b>一键生成</b>：描述一下你的经历，AI 帮你写出一份完整简历；也可以直接粘贴旧简历或
        加载岗位示例。全程不收费、数据仅存本机。
      </div>

      {needKey && (
        <div className="ai-error">
          本网站未配置 AI Key，请先到「🤖 AI 助手」页填写你的 DeepSeek API Key，
          或直接使用下方「岗位示例」快速开始。
        </div>
      )}

      <div className="ai-tasks">
        <button
          type="button"
          className={`ai-task-btn ${mode === 'describe' ? 'active' : ''}`}
          onClick={() => {
            setMode('describe')
            setDraft(null)
            setError('')
          }}
        >
          ✍️ 描述经历生成
        </button>
        <button
          type="button"
          className={`ai-task-btn ${mode === 'legacy' ? 'active' : ''}`}
          onClick={() => {
            setMode('legacy')
            setDraft(null)
            setError('')
          }}
        >
          📄 粘贴旧简历
        </button>
      </div>

      {mode === 'describe' ? (
        <>
          <Field label="求职意向（想应聘什么岗位）">
            <TextInput value={title} onChange={setTitle} placeholder="前端开发工程师" />
          </Field>
          <Field label="描述你的经历（越详细越好，口语化也可以）">
            <TextArea
              value={description}
              onChange={setDescription}
              rows={9}
              placeholder={`例如：我做了3年电商运营，在xx公司负责抖音店铺，去年做到年销5000万，带过4人小团队，擅长投放和直播带货，之前也在天猫做过一年……`}
            />
          </Field>
        </>
      ) : (
        <Field label="把旧简历的内容整段粘贴进来">
          <TextArea
            value={legacyText}
            onChange={setLegacyText}
            rows={9}
            placeholder={'张明  前端开发工程师\n电话：138-0000-0000\n邮箱：...\n\n工作经历\n2022-至今  字节跳动  高级前端工程师\n- 负责xxx\n...'}
          />
        </Field>
      )}

      <button
        type="button"
        className="btn btn-primary ai-generate"
        onClick={handleGenerate}
        disabled={loading || (needKey && false)}
      >
        {loading ? '⏳ AI 生成中…' : mode === 'describe' ? '✨ 生成完整简历' : '🔍 解析并导入'}
      </button>

      {error && <div className="ai-error">{error}</div>}

      {draft && (
        <div className="ai-result">
          <div className="ai-result-head">
            <span>检测到：{draftSummary}</span>
            <button type="button" className="btn btn-primary btn-sm" onClick={applyDraft}>
              应用为我的简历
            </button>
          </div>
          <pre className="ai-result-text">
            {draft.summary ? `【个人简介】\n${draft.summary}\n\n` : ''}
            {(draft.work ?? []).map((w, i) => `【工作${i + 1}】${w.company} · ${w.title}（${w.start}-${w.end}）\n${w.description}\n\n`).join('')}
            {(draft.skills ?? []).length ? `【技能】${(draft.skills ?? []).join('、')}` : ''}
          </pre>
        </div>
      )}

      {applied && <div className="ai-applied">{applied}</div>}

      <div className="sample-block">
        <div className="sample-title">💼 不想写？一键加载热门岗位示例当底稿：</div>
        <div className="sample-grid">
          {jobSamples.map((s) => (
            <button
              key={s.id}
              type="button"
              className="sample-btn"
              onClick={() => loadSample(s.id)}
            >
              {s.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
