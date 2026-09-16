// 清新蓝模板：浅蓝主色、圆角卡片、清爽明亮，适合互联网/新兴行业
import type { CSSProperties } from 'react'
import { ResumeData } from '../../types/resume'
import { useResumeStore } from '../../store/useResumeStore'

function Avatar({ resume }: { resume: ResumeData }) {
  const name = resume.basic.name || '名'
  return (
    <div className="fresh-avatar">
      {resume.basic.avatar ? (
        <img src={resume.basic.avatar} alt="头像" />
      ) : (
        <span>{name.slice(0, 1)}</span>
      )}
    </div>
  )
}

export default function FreshBlueTemplate({ resume }: { resume: ResumeData }) {
  const themeColor = useResumeStore((s) => s.themeColor)
  const { basic, education, work, projects, skills, certificates } = resume

  return (
    <div className="fresh-template" style={{ '--tp': themeColor || undefined } as CSSProperties}>
      <header className="fresh-header">
        <Avatar resume={resume} />
        <div className="fresh-header-info">
          <h1>{basic.name || '你的姓名'}</h1>
          <p className="fresh-role">{basic.title}</p>
          <div className="fresh-contact">
            {basic.phone && <span>📞 {basic.phone}</span>}
            {basic.email && <span>✉️ {basic.email}</span>}
            {basic.location && <span>📍 {basic.location}</span>}
            {basic.website && <span>🔗 {basic.website}</span>}
          </div>
        </div>
      </header>

      {basic.summary && (
        <section className="fresh-card">
          <h2>个人简介</h2>
          <p className="fresh-summary">{basic.summary}</p>
        </section>
      )}

      {work.length > 0 && (
        <section className="fresh-card">
          <h2>工作经历</h2>
          {work.map((w) => (
            <div className="fresh-entry" key={w.id}>
              <div className="fresh-entry-head">
                <span className="fresh-entry-title">{w.title || '职位'}</span>
                <span className="fresh-badge">{w.company}</span>
                <span className="fresh-date">{w.start} — {w.end}</span>
              </div>
              {w.description && <p className="fresh-desc">{w.description}</p>}
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className="fresh-card">
          <h2>项目经历</h2>
          {projects.map((p) => (
            <div className="fresh-entry" key={p.id}>
              <div className="fresh-entry-head">
                <span className="fresh-entry-title">{p.name || '项目名称'}</span>
                <span className="fresh-badge">{p.role}</span>
                <span className="fresh-date">{p.start} — {p.end}</span>
              </div>
              {p.link ? <div className="fresh-link">🔗 {p.link}</div> : null}
              {p.description && <p className="fresh-desc">{p.description}</p>}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="fresh-card">
          <h2>教育经历</h2>
          {education.map((e) => (
            <div className="fresh-entry" key={e.id}>
              <div className="fresh-entry-head">
                <span className="fresh-entry-title">{e.school || '学校'}</span>
                <span className="fresh-badge">{e.degree}</span>
                <span className="fresh-date">{e.start} — {e.end}</span>
              </div>
              <div className="fresh-sub">{e.major}</div>
              {e.description && <p className="fresh-desc">{e.description}</p>}
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="fresh-card">
          <h2>专业技能</h2>
          <div className="fresh-skills">
            {skills.map((s) => (
              <span className="fresh-skill" key={s.id}>{s.name || '技能'}</span>
            ))}
          </div>
        </section>
      )}

      {certificates.length > 0 && (
        <section className="fresh-card">
          <h2>证书荣誉</h2>
          <div className="fresh-certs">
            {certificates.map((c) => (
              <span className="fresh-cert" key={c.id}>
                🏅 {c.name} <em>{c.date}</em>
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
