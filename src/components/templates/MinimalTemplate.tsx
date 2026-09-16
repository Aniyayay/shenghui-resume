// 极简黑白模板：纯黑白、大留白、细线分隔，克制专业
import { ResumeData } from '../../types/resume'

export default function MinimalTemplate({ resume }: { resume: ResumeData }) {
  const { basic, education, work, projects, skills, certificates } = resume

  return (
    <div className="minimal-template">
      <header className="minimal-header">
        <h1>{basic.name || '你的姓名'}</h1>
        <p className="minimal-role">{basic.title}</p>
        <div className="minimal-contact">
          {[basic.phone, basic.email, basic.location, basic.website]
            .filter(Boolean)
            .map((c, i) => (
              <span key={i}>{c}</span>
            ))}
        </div>
      </header>

      {basic.summary && (
        <section className="minimal-section">
          <h2>PROFILE</h2>
          <p className="minimal-summary">{basic.summary}</p>
        </section>
      )}

      {work.length > 0 && (
        <section className="minimal-section">
          <h2>EXPERIENCE</h2>
          {work.map((w) => (
            <div className="minimal-entry" key={w.id}>
              <div className="minimal-entry-head">
                <span className="minimal-entry-title">{w.title || '职位'}</span>
                <span className="minimal-date">{w.start} — {w.end}</span>
              </div>
              <div className="minimal-sub">{w.company}</div>
              {w.description && <p className="minimal-desc">{w.description}</p>}
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className="minimal-section">
          <h2>PROJECTS</h2>
          {projects.map((p) => (
            <div className="minimal-entry" key={p.id}>
              <div className="minimal-entry-head">
                <span className="minimal-entry-title">{p.name || '项目名称'}</span>
                <span className="minimal-date">{p.start} — {p.end}</span>
              </div>
              <div className="minimal-sub">{p.role}</div>
              {p.description && <p className="minimal-desc">{p.description}</p>}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="minimal-section">
          <h2>EDUCATION</h2>
          {education.map((e) => (
            <div className="minimal-entry" key={e.id}>
              <div className="minimal-entry-head">
                <span className="minimal-entry-title">{e.school || '学校'}</span>
                <span className="minimal-date">{e.start} — {e.end}</span>
              </div>
              <div className="minimal-sub">{e.major} · {e.degree}</div>
              {e.description && <p className="minimal-desc">{e.description}</p>}
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="minimal-section">
          <h2>SKILLS</h2>
          <div className="minimal-skills">
            {skills.map((s) => (
              <span key={s.id}>{s.name || '技能'}</span>
            ))}
          </div>
        </section>
      )}

      {certificates.length > 0 && (
        <section className="minimal-section">
          <h2>CERTIFICATES</h2>
          <div className="minimal-certs">
            {certificates.map((c) => (
              <span key={c.id}>{c.name}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
