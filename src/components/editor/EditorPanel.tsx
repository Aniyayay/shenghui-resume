// 主编辑面板：section 导航 + 对应表单
import { useState } from 'react'
import { useResumeStore } from '../../store/useResumeStore'
import { sectionConfigs } from './sectionConfigs'
import BasicInfoForm from './sections/BasicInfoForm'
import ListForm from './sections/ListForm'
import SkillsForm from './sections/SkillsForm'
import CertificatesForm from './sections/CertificatesForm'
import AIPanel from './sections/AIPanel'
import AIGenerateTab from './sections/AIGenerateTab'

type TabKey =
  | 'generate'
  | 'basic'
  | 'work'
  | 'projects'
  | 'education'
  | 'skills'
  | 'certificates'
  | 'ai'

const tabs: Array<{ key: TabKey; label: string }> = [
  { key: 'generate', label: '✨ 一键生成' },
  { key: 'basic', label: '基本信息' },
  { key: 'work', label: '工作经历' },
  { key: 'projects', label: '项目经历' },
  { key: 'education', label: '教育经历' },
  { key: 'skills', label: '专业技能' },
  { key: 'certificates', label: '证书荣誉' },
  { key: 'ai', label: '🤖 AI 助手' },
]

export default function EditorPanel() {
  const [tab, setTab] = useState<TabKey>('basic')
  const loadExample = useResumeStore((s) => s.loadExample)
  const resetAll = useResumeStore((s) => s.resetAll)

  return (
    <div className="editor-panel">
      <div className="editor-toolbar">
        <span className="editor-brand">✏️ 神绘简历</span>
        <div className="editor-toolbar-actions">
          <button type="button" className="btn btn-ghost" onClick={loadExample}>
            加载示例
          </button>
          <button type="button" className="btn btn-ghost" onClick={resetAll}>
            清空
          </button>
        </div>
      </div>

      <div className="editor-tabs">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            className={`editor-tab ${tab === t.key ? 'active' : ''}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="editor-body">
        {tab === 'generate' && <AIGenerateTab />}
        {tab === 'basic' && <BasicInfoForm />}
        {tab === 'work' && (
          <ListForm section="work" itemTitle="工作经历" fields={sectionConfigs.work} />
        )}
        {tab === 'projects' && (
          <ListForm section="projects" itemTitle="项目经历" fields={sectionConfigs.projects} />
        )}
        {tab === 'education' && (
          <ListForm section="education" itemTitle="教育经历" fields={sectionConfigs.education} />
        )}
        {tab === 'skills' && <SkillsForm />}
        {tab === 'certificates' && <CertificatesForm />}
        {tab === 'ai' && <AIPanel />}
      </div>

      <div className="editor-hint">💾 内容自动保存到浏览器本地，关闭页面不丢失。</div>
    </div>
  )
}
