// 模板选择器：模态面板，展示 8 套模板的实时缩略图预览
import { useResumeStore } from '../store/useResumeStore'
import { templates } from '../data/templates'
import { exampleResume } from '../data/defaultResume'

interface Props {
  onClose: () => void
}

export default function TemplatePicker({ onClose }: Props) {
  const templateId = useResumeStore((s) => s.templateId)
  const setTemplate = useResumeStore((s) => s.setTemplate)

  return (
    <div className="tpl-modal" onClick={onClose}>
      <div className="tpl-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="tpl-modal-head">
          <span className="tpl-modal-title">🎨 选择模板</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            关闭
          </button>
        </div>
        <div className="tpl-grid">
          {templates.map((t) => {
            const Tpl = t.component
            const active = t.id === templateId
            return (
              <button
                key={t.id}
                type="button"
                className={`tpl-card ${active ? 'active' : ''}`}
                onClick={() => {
                  setTemplate(t.id)
                  onClose()
                }}
              >
                <div className="tpl-thumb">
                  <div className="tpl-thumb-inner">
                    <Tpl resume={exampleResume} />
                  </div>
                </div>
                <span className="tpl-card-name">{t.name}</span>
                <span className="tpl-card-desc">{t.desc}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
