// 基本信息表单（含头像上传）
import { useRef, useState } from 'react'
import { useResumeStore } from '../../../store/useResumeStore'
import { fileToSquareDataURL } from '../../../utils/image'
import { Field, TextArea, TextInput } from '../fields'

export default function BasicInfoForm() {
  const basic = useResumeStore((s) => s.data.basic)
  const updateBasic = useResumeStore((s) => s.updateBasic)
  const fileRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setUploadError('请选择图片文件')
      return
    }
    setUploading(true)
    setUploadError('')
    try {
      const dataUrl = await fileToSquareDataURL(file)
      updateBasic({ avatar: dataUrl })
    } catch (e) {
      setUploadError(String(e))
    }
    setUploading(false)
  }

  return (
    <div>
      <div className="avatar-upload">
        <div className="avatar-preview">
          {basic.avatar ? (
            <img src={basic.avatar} alt="头像预览" />
          ) : (
            <span>{(basic.name || '头').slice(0, 1)}</span>
          )}
        </div>
        <div className="avatar-actions">
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => fileRef.current?.click()}>
            {uploading ? '上传中…' : basic.avatar ? '更换头像' : '上传头像'}
          </button>
          {basic.avatar && (
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={() => updateBasic({ avatar: '' })}
            >
              移除
            </button>
          )}
          <p className="avatar-hint">支持 JPG/PNG，自动裁剪为 1:1 正方形</p>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={(e) => {
            handleFile(e.target.files?.[0])
            e.target.value = ''
          }}
        />
      </div>
      {uploadError && <div className="ai-error" style={{ marginBottom: 12 }}>{uploadError}</div>}

      <div className="form-grid">
        <Field label="姓名">
          <TextInput
            value={basic.name}
            onChange={(v) => updateBasic({ name: v })}
            placeholder="张三"
          />
        </Field>
        <Field label="求职意向">
          <TextInput
            value={basic.title}
            onChange={(v) => updateBasic({ title: v })}
            placeholder="前端开发工程师"
          />
        </Field>
        <Field label="手机号">
          <TextInput
            value={basic.phone}
            onChange={(v) => updateBasic({ phone: v })}
            placeholder="138-0000-0000"
          />
        </Field>
        <Field label="邮箱">
          <TextInput
            value={basic.email}
            onChange={(v) => updateBasic({ email: v })}
            placeholder="name@example.com"
          />
        </Field>
        <Field label="现居城市">
          <TextInput
            value={basic.location}
            onChange={(v) => updateBasic({ location: v })}
            placeholder="北京"
          />
        </Field>
        <Field label="出生年份（可选）">
          <TextInput
            value={basic.birthYear ?? ''}
            onChange={(v) => updateBasic({ birthYear: v })}
            placeholder="1998"
          />
        </Field>
        <Field label="个人网站 / GitHub（可选）" className="span-2">
          <TextInput
            value={basic.website ?? ''}
            onChange={(v) => updateBasic({ website: v })}
            placeholder="https://github.com/xxx"
          />
        </Field>
        <Field label="个人简介 / 自我评价" className="span-2">
          <TextArea
            value={basic.summary}
            onChange={(v) => updateBasic({ summary: v })}
            placeholder="一句话介绍自己：经验、优势、职业方向…"
            rows={5}
          />
        </Field>
      </div>
    </div>
  )
}
