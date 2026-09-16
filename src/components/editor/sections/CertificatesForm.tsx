// 证书荣誉表单
import { useResumeStore } from '../../../store/useResumeStore'
import { SectionKey } from '../../../types/resume'
import { Field, SectionCard, TextInput } from '../fields'

export default function CertificatesForm() {
  const certificates = useResumeStore((s) => s.data.certificates)
  const addSectionItem = useResumeStore((s) => s.addSectionItem)
  const updateSectionItem = useResumeStore((s) => s.updateSectionItem)
  const removeSectionItem = useResumeStore((s) => s.removeSectionItem)

  return (
    <div>
      {certificates.map((c) => (
        <SectionCard key={c.id} title="证书 / 荣誉" onRemove={() => removeSectionItem('certificates', c.id)}>
          <div className="form-grid">
            <Field label="名称">
              <TextInput
                value={c.name}
                onChange={(v) => updateSectionItem('certificates', c.id, { name: v })}
                placeholder="CET-6 英语六级"
              />
            </Field>
            <Field label="获得时间">
              <TextInput
                type="month"
                value={c.date}
                onChange={(v) => updateSectionItem('certificates', c.id, { date: v })}
              />
            </Field>
          </div>
        </SectionCard>
      ))}
      <button
        type="button"
        className="btn btn-add"
        onClick={() => addSectionItem('certificates' as SectionKey)}
      >
        + 添加证书
      </button>
    </div>
  )
}
