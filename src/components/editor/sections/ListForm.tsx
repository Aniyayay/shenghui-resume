// 通用列表表单：由字段配置驱动，教育/工作/项目共用
import { useResumeStore } from '../../../store/useResumeStore'
import { SectionKey } from '../../../types/resume'
import { Field, SectionCard, SelectInput, TextArea, TextInput } from '../fields'
import { ListField } from '../sectionConfigs'

interface Props {
  section: SectionKey
  itemTitle: string
  fields: ListField[]
}

export default function ListForm({ section, itemTitle, fields }: Props) {
  const items = useResumeStore((s) => s.data[section])
  const addSectionItem = useResumeStore((s) => s.addSectionItem)
  const updateSectionItem = useResumeStore((s) => s.updateSectionItem)
  const removeSectionItem = useResumeStore((s) => s.removeSectionItem)

  return (
    <div>
      {(items as unknown as Array<Record<string, unknown>>).map((item) => (
        <SectionCard
          key={item.id as string}
          title={itemTitle}
          onRemove={() => removeSectionItem(section, item.id as string)}
        >
          <div className="form-grid">
            {fields.map((f) => {
              const value = (item[f.key] as string) ?? ''
              const patch = (v: string) =>
                updateSectionItem(section, item.id as string, { [f.key]: v })
              return (
                <Field key={f.key} label={f.label} className={f.span === 2 ? 'span-2' : ''}>
                  {f.type === 'textarea' ? (
                    <TextArea value={value} onChange={patch} placeholder={f.placeholder} rows={4} />
                  ) : f.type === 'select' ? (
                    <SelectInput value={value} onChange={patch} options={f.options ?? []} />
                  ) : f.type === 'month' ? (
                    <TextInput type="month" value={value} onChange={patch} />
                  ) : (
                    <TextInput value={value} onChange={patch} placeholder={f.placeholder} />
                  )}
                </Field>
              )
            })}
          </div>
        </SectionCard>
      ))}
      <button type="button" className="btn btn-add" onClick={() => addSectionItem(section)}>
        + 添加{itemTitle}
      </button>
    </div>
  )
}
