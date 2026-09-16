// 单栏 ATS 友好模板：纯白单栏、标准字体、无装饰，招聘系统解析率最高（95%+），外企/大厂投递首选
import { ResumeData } from '../../types/resume'

export default function AtsTemplate({ resume }: { resume: ResumeData }) {
  const { basic, education, work, projects, skills, certificates } = resume

  return (
    <div className="ats-template">
      <header className="ats-header">
        <h1>{basic.name || '你的姓名'}</h1>
        <p className="ats-role">{basic.title}</p>
        <div className="ats-contact">
          {[basic.phone, basic.email, basic.location, basic.website]
            .filter(Boolean)
            .join('  |  ')}
        </div>
      </header>

      {basic.summary && (
        <section className="ats-section">
          <h2>个人简介</h2>
          <p className="ats-text">{basic.summary}</p>
        </section>
      )}

      {work.length > 0 && (
        <section className="ats-section">
          <h2>工作经历</h2>
          {work.map((w) => (
            <div className="ats-entry" key={w.id}>
              <div className="ats-entry-head">
                <span className="ats-title">{w.title || '职位'}，{w.company}</span>
                <span className="ats-date">{w.start} — {w.end}</span>
              </div>
              {w.description && <p className="ats-text">{w.description}</p>}
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className="ats-section">
          <h2>项目经历</h2>
          {projects.map((p) => (
            <div className="ats-entry" key={p.id}>
              <div className="ats-entry-head">
                <span className="ats-title">{p.name || '项目名称'}，{p.role}</span>
                <span className="ats-date">{p.start} — {p.end}</span>
              </div>
              {p.description && <p className="ats-text">{p.description}</p>}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="ats-section">
          <h2>教育经历</h2>
          {education.map((e) => (
            <div className="ats-entry" key={e.id}>
              <div className="ats-entry-head">
                <span className="ats-title">{e.school || '学校'}，{e.major}，{e.degree}</span>
                <span className="ats-date">{e.start} — {e.end}</span>
              </div>
              {e.description && <p className="ats-text">{e.description}</p>}
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="ats-section">
          <h2>专业技能</h2>
          <p className="ats-text">{skills.map((s) => s.name || '技能').join('、')}</p>
        </section>
      )}

      {certificates.length > 0 && (
        <section className="ats-section">
          <h2>证书荣誉</h2>
          <p className="ats-text">{certificates.map((c) => c.name).join('、')}</p>
        </section>
      )}
    </div>
  )
}
