// 神绘简历 - 导出 Word (.docx)
// 使用 docx 库在前端生成真正的 .docx 文件，中文字体统一为微软雅黑。
// docx 库体积较大，采用动态 import：仅在用户点击「导出 Word」时才加载，不影响页面初始体积。

import type { ResumeData } from '../types/resume'

const FONT = '微软雅黑'
const BODY_SIZE = 21 // 10.5pt（half-points）
const RIGHT_TAB = 9300 // 右对齐时间戳的 tab 位置（twips）

export async function exportResumeToWord(
  data: ResumeData,
  filename: string,
): Promise<Blob> {
  // 动态加载 docx（按需，Vite 会拆成独立 chunk）
  const docx = await import('docx')
  const { Document, Packer, Paragraph, TextRun, AlignmentType, BorderStyle, TabStopType } = docx
  type TParagraph = InstanceType<typeof Paragraph>
  type TTextRun = InstanceType<typeof TextRun>

  const t = (
    text: string,
    opts: { bold?: boolean; size?: number; color?: string } = {},
  ): TTextRun =>
    new TextRun({
      text,
      bold: opts.bold ?? false,
      size: opts.size ?? BODY_SIZE,
      color: opts.color ?? '333333',
      font: { ascii: FONT, eastAsia: FONT, hAnsi: FONT },
    })

  /** section 标题：加粗 + 下边框 */
  const sectionTitle = (text: string): TParagraph =>
    new Paragraph({
      spacing: { before: 200, after: 80 },
      border: { bottom: { style: BorderStyle.SINGLE, size: 6, color: '1F2937' } },
      children: [t(text, { bold: true, size: 26 })],
    })

  /** 一行：左侧标题（加粗），右侧时间（右对齐） */
  const headLine = (left: string, right: string): TParagraph =>
    new Paragraph({
      spacing: { before: 120, after: 20 },
      tabStops: [{ type: TabStopType.RIGHT, position: RIGHT_TAB }],
      children: [
        t(left, { bold: true, size: 23 }),
        new TextRun({ text: '\t', font: { ascii: FONT, eastAsia: FONT, hAnsi: FONT } }),
        t(right, { size: 19, color: '6B7280' }),
      ],
    })

  /** 正文段落（保留换行） */
  const bodyText = (text: string): TParagraph =>
    new Paragraph({
      spacing: { after: 60, line: 300 },
      children: [t(text)],
    })

  const children: TParagraph[] = []

  // ---- 头部 ----
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 40 },
      children: [t(data.basic.name || '你的姓名', { bold: true, size: 44 })],
    }),
  )
  if (data.basic.title) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 60 },
        children: [t(data.basic.title, { size: 24, color: '2563EB' })],
      }),
    )
  }
  const contact = [data.basic.phone, data.basic.email, data.basic.location, data.basic.website]
    .filter(Boolean)
    .join('  |  ')
  if (contact) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.CENTER,
        spacing: { after: 120 },
        children: [t(contact, { size: 19, color: '6B7280' })],
      }),
    )
  }

  // ---- 个人简介 ----
  if (data.basic.summary) {
    children.push(sectionTitle('个人简介'))
    children.push(bodyText(data.basic.summary))
  }

  // ---- 工作经历 ----
  if (data.work.length) {
    children.push(sectionTitle('工作经历'))
    data.work.forEach((w) => {
      children.push(headLine(`${w.title || '职位'} · ${w.company}`, `${w.start} — ${w.end}`))
      if (w.description) children.push(bodyText(w.description))
    })
  }

  // ---- 项目经历 ----
  if (data.projects.length) {
    children.push(sectionTitle('项目经历'))
    data.projects.forEach((p) => {
      children.push(headLine(`${p.name || '项目'} · ${p.role}`, `${p.start} — ${p.end}`))
      if (p.link) children.push(bodyText(`项目链接：${p.link}`))
      if (p.description) children.push(bodyText(p.description))
    })
  }

  // ---- 教育经历 ----
  if (data.education.length) {
    children.push(sectionTitle('教育经历'))
    data.education.forEach((e) => {
      children.push(
        headLine(
          `${e.school || '学校'} · ${e.major || ''} · ${e.degree || ''}`,
          `${e.start} — ${e.end}`,
        ),
      )
      if (e.description) children.push(bodyText(e.description))
    })
  }

  // ---- 专业技能 ----
  if (data.skills.length) {
    children.push(sectionTitle('专业技能'))
    children.push(bodyText(data.skills.map((s) => s.name || '技能').join('、')))
  }

  // ---- 证书荣誉 ----
  if (data.certificates.length) {
    children.push(sectionTitle('证书荣誉'))
    data.certificates.forEach((c) => {
      children.push(headLine(c.name, c.date))
    })
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: { ascii: FONT, eastAsia: FONT, hAnsi: FONT },
            size: BODY_SIZE,
            color: '333333',
          },
        },
      },
    },
    sections: [{ properties: {}, children }],
  })

  return Packer.toBlob(doc)
}
