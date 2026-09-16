// 列表型 section 的字段配置（教育/工作/项目共用）
export interface ListField {
  key: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'month'
  options?: string[]
  span?: 1 | 2
  placeholder?: string
}

export const sectionConfigs: Record<
  'work' | 'projects' | 'education',
  ListField[]
> = {
  work: [
    { key: 'company', label: '公司名称', type: 'text', placeholder: '字节跳动' },
    { key: 'title', label: '职位', type: 'text', placeholder: '前端开发工程师' },
    { key: 'start', label: '开始时间', type: 'month' },
    { key: 'end', label: '结束时间', type: 'month' },
    {
      key: 'description',
      label: '工作内容与成果',
      type: 'textarea',
      span: 2,
      placeholder: '负责什么、做了什么、取得什么成果（每行一条，可让 AI 帮你润色）',
    },
  ],
  projects: [
    { key: 'name', label: '项目名称', type: 'text', placeholder: '企业级中后台脚手架' },
    { key: 'role', label: '担任角色', type: 'text', placeholder: '核心开发者' },
    { key: 'link', label: '项目链接（可选）', type: 'text' },
    { key: 'start', label: '开始时间', type: 'month' },
    { key: 'end', label: '结束时间', type: 'month' },
    {
      key: 'description',
      label: '项目描述与成果',
      type: 'textarea',
      span: 2,
      placeholder: '项目背景、你的贡献、技术亮点、量化成果',
    },
  ],
  education: [
    { key: 'school', label: '学校', type: 'text', placeholder: '北京邮电大学' },
    { key: 'major', label: '专业', type: 'text', placeholder: '计算机科学与技术' },
    {
      key: 'degree',
      label: '学历',
      type: 'select',
      options: ['大专', '本科', '硕士', '博士', '其他'],
    },
    { key: 'start', label: '开始时间', type: 'month' },
    { key: 'end', label: '结束时间', type: 'month' },
    {
      key: 'description',
      label: '在校经历 / 主修课程',
      type: 'textarea',
      span: 2,
      placeholder: '主修课程、绩点、荣誉、社团活动等',
    },
  ],
}
