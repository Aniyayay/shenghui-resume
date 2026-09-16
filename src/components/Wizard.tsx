// 新手向导：3 步引导小白快速生成第一份简历
// 步骤1 求职意向+姓名 → 步骤2 选择内容来源（描述/旧简历/岗位示例）→ 步骤3 AI 生成并应用
import { useState } from 'react'
import { useResumeStore } from '../store/useResumeStore'
import {
  ResumeDraft,
  draftToResume,
  generateResumeDraft,
  parseLegacyResume,
} from '../utils/aiGenerate'
import { jobSamples } from '../data/jobSamples'
import { checkAIConfig } from '../utils/ai'

interface Props {
  onClose: () => void
}

type Source = 'describe' | 'legacy' | 'sample'

export default function Wizard({ onClose }: Props) {
  const apiKey = useResumeStore((s) => s.apiKey)
  const data = useResumeStore((s) => s.data)
  const setData = useResumeStore((s) => s.setData)
  const setApiKey = useResumeStore((s) => s.setApiKey)

  const [step, setStep] = useState(1)
  const [title, setTitle] = useState('')
  const [name, setName] = useState('')
  const [source, setSource] = useState<Source | null>(null)
  const [description, setDescription] = useState('')
  const [legacyText, setLegacyText] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [draft, setDraft] = useState<ResumeDraft | null>(null)
  const [serverKey, setServerKey] = useState<boolean | null>(null)

  const skip = () => {
    localStorage.setItem('shenghui-wizard-seen', '1')
    onClose()
  }

  const finish = () => {
    localStorage.setItem('shenghui-wizard-seen', '1')
    onClose()
  }

  const goNext = () => {
    if (step === 1 && !title.trim() && !name.trim()) {
      setError('至少填一个：求职意向或姓名（也可以点右上角「跳过」直接开始）')
      return
    }
    setError('')
    if (step === 1) {
      // 写入基本信息
      const basic = { ...data.basic }
      if (title.trim()) basic.title = title.trim()
      if (name.trim()) basic.name = name.trim()
      setData({ ...data, basic })
      setStep(2)
    }
  }

  const pickSource = (s: Source) => {
    setSource(s)
    setError('')
    if (s === 'sample') {
      // 直接选岗位示例：显示示例选择
      setStep(3)
    } else {
      setStep(3)
    }
  }

  const handleGenerate = async () => {
    const s = source
    if (s === 'describe' && !description.trim()) {
      setError('先写几句你的经历，哪怕很简单')
      return
    }
    if (s === 'legacy' && !legacyText.trim()) {
      setError('请粘贴旧简历内容')
      return
    }
    setLoading(true)
    setError('')
    const r =
      s === 'describe'
        ? await generateResumeDraft({ apiKey, title, description, basic: data.basic })
        : s === 'legacy'
          ? await parseLegacyResume({ apiKey, text: legacyText })
          : null
    setLoading(false)
    if (r && r.ok && r.draft) {
      setDraft(r.draft)
    } else if (r) {
      setError(r.error ?? '生成失败，请重试')
      if (r.error && r.error.includes('Key')) {
        setError('AI 需要 API Key：如果网站未配置共享 Key，请自备一个（到「AI 助手」页填写），或改用岗位示例。')
      }
    }
  }

  const applySample = (id: string) => {
    const sample = jobSamples.find((s) => s.id === id)
    if (!sample) return
    setData(sample.resume)
    finish()
  }

  const applyDraft = () => {
    if (!draft) return
    const resume = draftToResume(draft, { ...data.basic, title: title || data.basic.title })
    setData(resume)
    finish()
  }

  const step2Describe =
    source === 'describe' ? (
      <>
        <p className="wizard-label">✍️ 描述你的经历（口语化即可，越详细生成越好）</p>
        <textarea
          className="field-input field-textarea"
          rows={6}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={'例如：我做了3年电商运营，在xx公司负责抖音店铺，去年做到年销5000万，带过4人小团队，擅长投放和直播带货……'}
        />
      </>
    ) : source === 'legacy' ? (
      <>
        <p className="wizard-label">📄 把旧简历内容整段粘贴进来</p>
        <textarea
          className="field-input field-textarea"
          rows={6}
          value={legacyText}
          onChange={(e) => setLegacyText(e.target.value)}
          placeholder={'张明 前端开发工程师\n电话：138...\n工作经历\n2022-至今 字节跳动 ...'}
        />
      </>
    ) : null

  return (
    <div className="tpl-modal">
      <div className="wizard-box">
        <div className="wizard-head">
          <span className="tpl-modal-title">🚀 3 步生成你的第一份简历</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={skip}>
            跳过，直接开始
          </button>
        </div>

        <div className="wizard-steps">
          {[1, 2, 3].map((i) => (
            <span key={i} className={`wizard-step ${step >= i ? 'on' : ''}`}>
              {i}
            </span>
          ))}
          <span className="wizard-step-label">
            {step === 1 ? '基本' : step === 2 ? '来源' : '生成'}
          </span>
        </div>

        {step === 1 && (
          <div className="wizard-body">
            <label className="field">
              <span className="field-label">求职意向（想应聘什么岗位）</span>
              <input
                className="field-input"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="前端开发工程师 / 运营 / 销售…"
              />
            </label>
            <label className="field">
              <span className="field-label">你的姓名</span>
              <input
                className="field-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="张三"
              />
            </label>
            {error && <div className="ai-error">{error}</div>}
            <button type="button" className="btn btn-primary wizard-next" onClick={goNext}>
              下一步 →
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="wizard-body">
            <p className="wizard-label">选择简历内容从哪来：</p>
            <div className="wizard-sources">
              <button type="button" className="wizard-source" onClick={() => pickSource('describe')}>
                <span className="wizard-source-icon">✍️</span>
                <span className="wizard-source-name">我描述经历</span>
                <span className="wizard-source-desc">说几句话，AI 帮我写完整</span>
              </button>
              <button type="button" className="wizard-source" onClick={() => pickSource('legacy')}>
                <span className="wizard-source-icon">📄</span>
                <span className="wizard-source-name">我有旧简历</span>
                <span className="wizard-source-desc">粘贴文本，自动转成新模板</span>
              </button>
              <button type="button" className="wizard-source" onClick={() => pickSource('sample')}>
                <span className="wizard-source-icon">💼</span>
                <span className="wizard-source-name">用岗位示例</span>
                <span className="wizard-source-desc">热门岗位模板，直接改信息</span>
              </button>
            </div>
          </div>
        )}

        {step === 3 && source === 'sample' && (
          <div className="wizard-body">
            <p className="wizard-label">选择一个最接近的岗位示例：</p>
            <div className="sample-grid">
              {jobSamples.map((s) => (
                <button key={s.id} type="button" className="sample-btn" onClick={() => applySample(s.id)}>
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && source !== 'sample' && (
          <div className="wizard-body">
            {step2Describe}
            {error && <div className="ai-error">{error}</div>}
            {draft ? (
              <div className="ai-result">
                <div className="ai-result-head">
                  <span>✅ AI 已生成（点击应用后即可预览/导出）</span>
                  <button type="button" className="btn btn-primary btn-sm" onClick={applyDraft}>
                    应用这份简历
                  </button>
                </div>
                <pre className="ai-result-text">
                  {draft.summary ? `【简介】${draft.summary.slice(0, 80)}…\n\n` : ''}
                  {(draft.work ?? []).map((w) => `【${w.company || '工作'}】${w.title}（${w.start}-${w.end}）\n`).join('')}
                  {(draft.skills ?? []).length ? `【技能】${(draft.skills ?? []).join('、')}` : ''}
                </pre>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-primary wizard-next"
                onClick={handleGenerate}
                disabled={loading}
              >
                {loading ? '⏳ AI 生成中…' : '✨ 开始生成'}
              </button>
            )}
          </div>
        )}

        <div className="wizard-foot">
          {step > 1 && source !== 'sample' && (
            <button type="button" className="btn btn-ghost btn-sm" onClick={() => setStep(step - 1)}>
              ← 上一步
            </button>
          )}
          <span className="wizard-foot-hint">数据仅保存在本机浏览器，不会上传</span>
        </div>
      </div>
    </div>
  )
}
