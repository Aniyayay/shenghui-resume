// 时间轴模板：经历按时间线呈现，清晰易扫读，热门风格
import type { CSSProperties } from 'react'
import { ResumeData } from '../../types/resume'
import { useResumeStore } from '../../store/useResumeStore'

export default function TimelineTemplate({ resume }: { resume: ResumeData }) {
  const themeColor = useResumeStore((s) => s.themeColor)
  const { basic, education, work, projects, skills, certificates } = resume

  return (
    <div className="timeline-template" style={{ '--tp': themeColor || undefined } as CSSProperties}>
      <header className="timeline-header">
        <h1>{basic.name || '你的姓名'}</h1>
        <p className="timeline-role">{basic.title}</p>
        <div className="timeline-contact">
          {basic.phone && <span>{basic.phone}</span>}
          {basic.email && <span>{basic.email}</span>}
          {basic.location && <span>{basic.location}</span>}
          {basic.website && <span>{basic.website}</span>}
        </div>
      </header>

      {basic.summary && (
        <section className="timeline-section">
          <h2>个人简介</h2>
          <p className="timeline-summary">{basic.summary}</p>
        </section>
      )}

      {work.length > 0 && (
        <section className="timeline-section">
          <h2>工作经历</h2>
          <div className="timeline-line">
            {work.map((w) => (
              <div className="timeline-item" key={w.id}>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-head">
                    <span className="timeline-title">{w.title || '职位'}</span>
                    <span className="timeline-date">{w.start} — {w.end}</span>
                  </div>
                  <div className="timeline-sub">{w.company}</div>
                  {w.description && <p className="timeline-desc">{w.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {projects.length > 0 && (
        <section className="timeline-section">
          <h2>项目经历</h2>
          <div className="timeline-line">
            {projects.map((p) => (
              <div className="timeline-item" key={p.id}>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-head">
                    <span className="timeline-title">{p.name || '项目名称'}</span>
                    <span className="timeline-date">{p.start} — {p.end}</span>
                  </div>
                  <div className="timeline-sub">{p.role}</div>
                  {p.description && <p className="timeline-desc">{p.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {education.length > 0 && (
        <section className="timeline-section">
          <h2>教育经历</h2>
          <div className="timeline-line">
            {education.map((e) => (
              <div className="timeline-item" key={e.id}>
                <div className="timeline-dot" />
                <div className="timeline-content">
                  <div className="timeline-head">
                    <span className="timeline-title">{e.school || '学校'}</span>
                    <span className="timeline-date">{e.start} — {e.end}</span>
                  </div>
                  <div className="timeline-sub">{e.major} · {e.degree}</div>
                  {e.description && <p className="timeline-desc">{e.description}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {skills.length > 0 && (
        <section className="timeline-section">
          <h2>专业技能</h2>
          <div className="timeline-skills">
            {skills.map((s) => (
              <span key={s.id}>{s.name || '技能'}</span>
            ))}
          </div>
        </section>
      )}

      {certificates.length > 0 && (
        <section className="timeline-section">
          <h2>证书荣誉</h2>
          <div className="timeline-certs">
            {certificates.map((c) => (
              <span key={c.id}>🏅 {c.name}</span>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
