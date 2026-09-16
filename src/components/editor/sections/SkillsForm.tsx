// 技能表单：名称 + 熟练度
import { useResumeStore } from '../../../store/useResumeStore'
import { SectionKey } from '../../../types/resume'
import { Field, SectionCard, TextInput } from '../fields'

export default function SkillsForm() {
  const skills = useResumeStore((s) => s.data.skills)
  const addSectionItem = useResumeStore((s) => s.addSectionItem)
  const updateSectionItem = useResumeStore((s) => s.updateSectionItem)
  const removeSectionItem = useResumeStore((s) => s.removeSectionItem)

  return (
    <div>
      {skills.map((s) => (
        <SectionCard key={s.id} title="技能" onRemove={() => removeSectionItem('skills', s.id)}>
          <div className="form-grid">
            <Field label="技能名称">
              <TextInput
                value={s.name}
                onChange={(v) => updateSectionItem('skills', s.id, { name: v })}
                placeholder="React / TypeScript"
              />
            </Field>
            <Field label={`熟练度：${s.level} / 5`}>
              <input
                type="range"
                className="field-range"
                min={1}
                max={5}
                step={1}
                value={s.level}
                onChange={(e) =>
                  updateSectionItem('skills', s.id, { level: Number(e.target.value) })
                }
              />
            </Field>
          </div>
        </SectionCard>
      ))}
      <button
        type="button"
        className="btn btn-add"
        onClick={() => addSectionItem('skills' as SectionKey)}
      >
        + 添加技能
      </button>
    </div>
  )
}
