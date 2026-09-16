// 经典商务模板：稳重专业，黑白灰，适合传统行业
import type { CSSProperties } from 'react'
import { ResumeData } from '../../types/resume'
import { useResumeStore } from '../../store/useResumeStore'

export default function ClassicTemplate({ resume }: { resume: ResumeData }) {
  const themeColor = useResumeStore((s) => s.themeColor)
  const { basic, education, work, projects, skills, certificates } = resume

  return (
    <div className="classic-template" style={{ '--tp': themeColor || undefined } as CSSProperties}>
      <header className="classic-header">
        <div className="classic-header-main">
          <h1>{basic.name || '你的姓名'}</h1>
          <p className="classic-role">{basic.title}</p>
          <div className="classic-contact">
            {basic.phone && <span>{basic.phone}</span>}
            {basic.email && <span>{basic.email}</span>}
            {basic.location && <span>{basic.location}</span>}
            {basic.website && <span>{basic.website}</span>}
          </div>
        </div>
        {basic.avatar && (
          <div className="classic-avatar">
            <img src={basic.avatar} alt="头像" />
          </div>
        )}
      </header>

      {basic.summary && (
        <section className="classic-section">
          <h2>个人简介</h2>
          <p className="classic-summary">{basic.summary}</p>
        </section>
      )}

      {work.length > 0 && (
        <section className="classic-section">
          <h2>工作经历</h2>
          {work.map((w) => (
            <div className="classic-entry" key={w.id}>
              <div className="classic-entry-head">
                <span className="classic-entry-title">{w.title || '职位'}</span>
                <span className="classic-entry-date">
                  {w.start} — {w.end}
                </span>
              </div>
              <div className="classic-entry-sub">{w.company}</div>
              {w.description && <p className="classic-entry-desc">{w.description}</p>}
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className="classic-section">
          <h2>项目经历</h2>
          {projects.map((p) => (
            <div className="classic-entry" key={p.id}>
              <div className="classic-entry-head">
                <span className="classic-entry-title">{p.name || '项目名称'}</span>
                <span className="classic-entry-date">
                  {p.start} — {p.end}
                </span>
              </div>
              <div className="classic-entry-sub">
                {p.role}
                {p.link ? ` · ${p.link}` : ''}
              </div>
              {p.description && <p className="classic-entry-desc">{p.description}</p>}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="classic-section">
          <h2>教育经历</h2>
          {education.map((e) => (
            <div className="classic-entry" key={e.id}>
              <div className="classic-entry-head">
                <span className="classic-entry-title">{e.school || '学校'}</span>
                <span className="classic-entry-date">
                  {e.start} — {e.end}
                </span>
              </div>
              <div className="classic-entry-sub">
                {e.major} · {e.degree}
              </div>
              {e.description && <p className="classic-entry-desc">{e.description}</p>}
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="classic-section">
          <h2>专业技能</h2>
          <div className="classic-skills">
            {skills.map((s) => (
              <span className="classic-skill" key={s.id}>
                {s.name || '技能'}
              </span>
            ))}
          </div>
        </section>
      )}

      {certificates.length > 0 && (
        <section className="classic-section">
          <h2>证书荣誉</h2>
          <div className="classic-cert-list">
            {certificates.map((c) => (
              <div className="classic-cert-item" key={c.id}>
                <span>{c.name}</span>
                <span className="classic-entry-date">{c.date}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
