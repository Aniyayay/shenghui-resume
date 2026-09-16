// 预览区：模板切换 + 实时渲染 + 导出（PDF/PNG/JSON）+ 导入 + 分享
import { useEffect, useRef, useState } from 'react'
import html2canvas from 'html2canvas'
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string'
import { useResumeStore } from '../store/useResumeStore'
import { getTemplate, templates } from '../data/templates'
import { ResumeData } from '../types/resume'
import { exportResumeToWord } from '../utils/exportWord'
import TemplatePicker from './TemplatePicker'
import ScoreModal from './ScoreModal'

const THEME_PRESETS = [
  '#2563eb',
  '#0d9488',
  '#7c3aed',
  '#dc2626',
  '#ea580c',
  '#16a34a',
  '#db2777',
  '#0ea5e9',
]

export default function PreviewPanel() {
  const data = useResumeStore((s) => s.data)
  const templateId = useResumeStore((s) => s.templateId)
  const setTemplate = useResumeStore((s) => s.setTemplate)
  const setData = useResumeStore((s) => s.setData)
  const coverLetter = useResumeStore((s) => s.coverLetter)
  const themeColor = useResumeStore((s) => s.themeColor)
  const setThemeColor = useResumeStore((s) => s.setThemeColor)

  const fileRef = useRef<HTMLInputElement>(null)
  const [showCover, setShowCover] = useState(false)
  const [showTpl, setShowTpl] = useState(false)
  const [showScore, setShowScore] = useState(false)
  const [busy, setBusy] = useState('')
  const [toast, setToast] = useState('')

  const current = getTemplate(templateId)
  const Template = current.component

  const flashToast = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(''), 3000)
  }

  // 检测分享链接（#share=...），提示用户导入
  useEffect(() => {
    const hash = window.location.hash
    if (!hash.startsWith('#share=')) return
    try {
      const json = decompressFromEncodedURIComponent(hash.slice('#share='.length))
      const payload = JSON.parse(json)
      if (payload && payload.data && payload.data.basic) {
        const ok = window.confirm('检测到一份分享的简历，是否导入到编辑器？')
        if (ok) {
          setData(payload.data as ResumeData)
          if (payload.templateId) setTemplate(payload.templateId)
          flashToast('✅ 分享的简历已导入')
        }
      }
    } catch (e) {
      console.warn('分享链接解析失败', e)
    }
    history.replaceState(null, '', window.location.pathname + window.location.search)
  }, [setData, setTemplate])

  // 导出 PDF：浏览器打印（选「另存为 PDF」），中文质量最好
  const exportPDF = () => window.print()

  // 导出 PNG 图片
  const exportPNG = async () => {
    const el = document.getElementById('resume-print-area')
    if (!el) return
    setBusy('png')
    let sides: NodeListOf<HTMLElement> | null = null
    try {
      // 侧栏模板的负外边距在 canvas 渲染时易错位，导出前临时归零
      sides = el.querySelectorAll<HTMLElement>('.modern-side, .colorside-side')
      sides.forEach((s) => (s.style.margin = '0'))
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
      })
      sides.forEach((s) => (s.style.margin = ''))
      const a = document.createElement('a')
      a.download = `${data.basic.name || '我的简历'}.png`
      a.href = canvas.toDataURL('image/png')
      a.click()
      flashToast('✅ 图片已导出')
    } catch (e) {
      sides?.forEach((s) => (s.style.margin = ''))
      console.error(e)
      flashToast(`❌ 导出失败：${String(e)}`)
    }
    setBusy('')
  }

  // 导出 Word (.docx)
  const exportWord = async () => {
    setBusy('word')
    try {
      const blob = await exportResumeToWord(data, `${data.basic.name || '我的简历'}.docx`)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${data.basic.name || '我的简历'}.docx`
      a.click()
      URL.revokeObjectURL(url)
      flashToast('✅ Word 已导出')
    } catch (e) {
      console.error(e)
      flashToast(`❌ Word 导出失败：${String(e)}`)
    }
    setBusy('')
  }

  // 导出 JSON（可再导入 / 分享）
  const exportJSON = () => {
    const payload = { app: 'shenghui-resume', version: 1, templateId, data }
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${data.basic.name || '我的简历'}.json`
    a.click()
    URL.revokeObjectURL(url)
    flashToast('✅ 简历已导出为 JSON')
  }

  // 导入 JSON
  const handleImportFile = async (file: File | undefined) => {
    if (!file) return
    try {
      const text = await file.text()
      const payload = JSON.parse(text)
      const d = payload?.data ?? payload
      if (!d || typeof d.basic !== 'object') throw new Error('文件格式不正确')
      setData(d as ResumeData)
      if (payload?.templateId) setTemplate(payload.templateId)
      flashToast('✅ 简历已导入')
    } catch (e) {
      flashToast(`❌ 导入失败：${String(e)}`)
    }
  }

  // 生成分享链接（压缩到 URL hash；头像体积大，默认不包含）
  const shareLink = () => {
    const slim: ResumeData = { ...data, basic: { ...data.basic, avatar: '' } }
    const payload = { templateId, data: slim }
    const encoded = compressToEncodedURIComponent(JSON.stringify(payload))
    const url = `${location.origin}${location.pathname}#share=${encoded}`
    navigator.clipboard
      ?.writeText(url)
      .then(() => flashToast('✅ 分享链接已复制（不含头像）'))
      .catch(() => flashToast(`📋 请手动复制：${url.slice(0, 60)}…`))
  }

  return (
    <div className="preview-panel">
      <div className="preview-toolbar">
        <div className="template-switch">
          <button
            type="button"
            className="template-open-btn"
            onClick={() => setShowTpl(true)}
            title="打开模板库"
          >
            🎨 模板 · {current.name}
          </button>
          <div className="theme-picker" title="自定义主题色">
            {THEME_PRESETS.map((c) => (
              <button
                key={c}
                type="button"
                className={`theme-swatch ${themeColor === c ? 'active' : ''}`}
                style={{ background: c }}
                onClick={() => setThemeColor(c)}
                aria-label={`主题色 ${c}`}
              />
            ))}
            <input
              type="color"
              className="theme-color-input"
              value={themeColor || '#2563eb'}
              onChange={(e) => setThemeColor(e.target.value)}
              title="自定义颜色"
            />
            {themeColor && (
              <button
                type="button"
                className="btn btn-ghost btn-sm theme-reset"
                onClick={() => setThemeColor('')}
                title="恢复各模板默认配色"
              >
                默认
              </button>
            )}
          </div>
        </div>
        <div className="preview-actions">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setShowScore(true)}
            title="简历体检：完整性 / 量化 / 改进建议"
          >
            📊 体检
          </button>
          {coverLetter && (
            <button
              type="button"
              className="btn btn-ghost btn-sm"
              onClick={() => setShowCover(true)}
              title="查看 AI 生成的求职信"
            >
              💌 求职信
            </button>
          )}
          <button type="button" className="btn btn-primary" onClick={exportPDF} title="浏览器打印 → 另存为 PDF">
            🖨️ PDF
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={exportWord}
            disabled={busy === 'word'}
            title="导出为 Word 文档 (.docx)"
          >
            {busy === 'word' ? '导出中…' : '📄 Word'}
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={exportPNG}
            disabled={busy === 'png'}
            title="导出为 PNG 图片"
          >
            {busy === 'png' ? '导出中…' : '🖼️ 图片'}
          </button>
        </div>
      </div>

      <div className="preview-toolbar preview-toolbar-sub">
        <span className="preview-file-label">文件：</span>
        <button type="button" className="btn btn-ghost btn-sm" onClick={exportJSON}>
          ⬇️ 导出 JSON
        </button>
        <button
          type="button"
          className="btn btn-ghost btn-sm"
          onClick={() => fileRef.current?.click()}
        >
          ⬆️ 导入 JSON
        </button>
        <button type="button" className="btn btn-ghost btn-sm" onClick={shareLink}>
          🔗 分享链接
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".json,application/json"
          style={{ display: 'none' }}
          onChange={(e) => {
            handleImportFile(e.target.files?.[0])
            e.target.value = ''
          }}
        />
        {toast && <span className="preview-toast">{toast}</span>}
      </div>

      <div className="preview-scroll">
        <div id="resume-print-area" className="page-a4">
          <Template resume={data} />
        </div>
      </div>

      {showCover && coverLetter && (
        <div className="cover-modal" onClick={() => setShowCover(false)}>
          <div className="cover-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="cover-modal-head">
              <span className="cover-modal-title">💌 求职信</span>
              <div className="cover-modal-actions">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={() => {
                    navigator.clipboard?.writeText(coverLetter).catch(() => {})
                    flashToast('✅ 求职信已复制')
                  }}
                >
                  复制
                </button>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setShowCover(false)}
                >
                  关闭
                </button>
              </div>
            </div>
            <pre className="cover-modal-text">{coverLetter}</pre>
          </div>
        </div>
      )}

      {showTpl && <TemplatePicker onClose={() => setShowTpl(false)} />}
      {showScore && <ScoreModal onClose={() => setShowScore(false)} />}
    </div>
  )
}
