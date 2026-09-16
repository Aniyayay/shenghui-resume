// 顶栏横幅模板：顶部深色横幅放姓名/职位/联系方式，专业醒目，大厂面试官常见偏好
import type { CSSProperties } from 'react'
import { ResumeData } from '../../types/resume'
import { useResumeStore } from '../../store/useResumeStore'

export default function BannerTemplate({ resume }: { resume: ResumeData }) {
  const themeColor = useResumeStore((s) => s.themeColor)
  const { basic, education, work, projects, skills, certificates } = resume

  return (
    <div className="banner-template" style={{ '--tp': themeColor || undefined } as CSSProperties}>
      <header className="banner-header">
        <div className="banner-identity">
          {basic.avatar && (
            <div className="banner-avatar">
              <img src={basic.avatar} alt="头像" />
            </div>
          )}
          <div className="banner-names">
            <h1>{basic.name || '你的姓名'}</h1>
            <p className="banner-role">{basic.title}</p>
          </div>
        </div>
        <div className="banner-contact">
          {basic.phone && <span>📞 {basic.phone}</span>}
          {basic.email && <span>✉️ {basic.email}</span>}
          {basic.location && <span>📍 {basic.location}</span>}
          {basic.website && <span>🔗 {basic.website}</span>}
        </div>
      </header>

      {basic.summary && (
        <section className="banner-section">
          <h2>个人简介</h2>
          <p className="banner-summary">{basic.summary}</p>
        </section>
      )}

      {work.length > 0 && (
        <section className="banner-section">
          <h2>工作经历</h2>
          {work.map((w) => (
            <div className="banner-entry" key={w.id}>
              <div className="banner-entry-head">
                <div>
                  <span className="banner-title">{w.title || '职位'}</span>
                  <span className="banner-company">{w.company}</span>
                </div>
                <span className="banner-date">{w.start} — {w.end}</span>
              </div>
              {w.description && <p className="banner-desc">{w.description}</p>}
            </div>
          ))}
        </section>
      )}

      {projects.length > 0 && (
        <section className="banner-section">
          <h2>项目经历</h2>
          {projects.map((p) => (
            <div className="banner-entry" key={p.id}>
              <div className="banner-entry-head">
                <div>
                  <span className="banner-title">{p.name || '项目名称'}</span>
                  <span className="banner-company">{p.role}</span>
                </div>
                <span className="banner-date">{p.start} — {p.end}</span>
              </div>
              {p.description && <p className="banner-desc">{p.description}</p>}
            </div>
          ))}
        </section>
      )}

      {education.length > 0 && (
        <section className="banner-section">
          <h2>教育经历</h2>
          {education.map((e) => (
            <div className="banner-entry" key={e.id}>
              <div className="banner-entry-head">
                <div>
                  <span className="banner-title">{e.school || '学校'}</span>
                  <span className="banner-company">{e.major} · {e.degree}</span>
                </div>
                <span className="banner-date">{e.start} — {e.end}</span>
              </div>
              {e.description && <p className="banner-desc">{e.description}</p>}
            </div>
          ))}
        </section>
      )}

      {skills.length > 0 && (
        <section className="banner-section">
          <h2>专业技能</h2>
          <div className="banner-skills">
            {skills.map((s) => (
              <span key={s.id}>{s.name || '技能'}</span>
            ))}
          </div>
        </section>
      )}

      {certificates.length > 0 && (
        <section className="banner-section">
          <h2>证书荣誉</h2>
          <div className="banner-certs">
            {certificates.map((c) => (
              <span key={c.id}>🏅 {c.name} <em>{c.date}</em></span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
