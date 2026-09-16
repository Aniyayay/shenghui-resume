// 多彩侧栏模板：左侧彩色渐变边栏 + 白字，右侧内容区，视觉突出
import type { CSSProperties } from 'react'
import { ResumeData } from '../../types/resume'
import { useResumeStore } from '../../store/useResumeStore'

function LevelBar({ level }: { level: number }) {
  return (
    <span className="colorside-bar">
      <i style={{ width: `${(level / 5) * 100}%` }} />
    </span>
  )
}

export default function ColorSideTemplate({ resume }: { resume: ResumeData }) {
  const themeColor = useResumeStore((s) => s.themeColor)
  const { basic, education, work, projects, skills, certificates } = resume

  return (
    <div className="colorside-template" style={{ '--tp': themeColor || undefined } as CSSProperties}>
      <aside className="colorside-side">
        <div className="colorside-avatar">
          {basic.avatar ? (
            <img src={basic.avatar} alt="头像" />
          ) : (
            <span>{(basic.name || '名').slice(0, 1)}</span>
          )}
        </div>
        <h1 className="colorside-name">{basic.name || '你的姓名'}</h1>
        <p className="colorside-role">{basic.title}</p>

        <div className="colorside-block">
          <h3>联系方式</h3>
          <ul className="colorside-contact">
            {basic.phone && <li>📞 {basic.phone}</li>}
            {basic.email && <li>✉️ {basic.email}</li>}
            {basic.location && <li>📍 {basic.location}</li>}
            {basic.birthYear && <li>🎂 {basic.birthYear} 年</li>}
            {basic.website && <li>🔗 {basic.website}</li>}
          </ul>
        </div>

        {skills.length > 0 && (
          <div className="colorside-block">
            <h3>专业技能</h3>
            <ul className="colorside-skills">
              {skills.map((s) => (
                <li key={s.id}>
                  <span className="colorside-skill-name">{s.name || '技能'}</span>
                  <LevelBar level={s.level} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {certificates.length > 0 && (
          <div className="colorside-block">
            <h3>证书荣誉</h3>
            <ul className="colorside-certs">
              {certificates.map((c) => (
                <li key={c.id}>{c.name}</li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      <main className="colorside-main">
        {basic.summary && (
          <section className="colorside-section">
            <h2>个人简介</h2>
            <p className="colorside-summary">{basic.summary}</p>
          </section>
        )}

        {work.length > 0 && (
          <section className="colorside-section">
            <h2>工作经历</h2>
            {work.map((w) => (
              <div className="colorside-entry" key={w.id}>
                <div className="colorside-entry-head">
                  <span className="colorside-entry-title">{w.title || '职位'}</span>
                  <span className="colorside-date">{w.start} — {w.end}</span>
                </div>
                <div className="colorside-sub">{w.company}</div>
                {w.description && <p className="colorside-desc">{w.description}</p>}
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section className="colorside-section">
            <h2>项目经历</h2>
            {projects.map((p) => (
              <div className="colorside-entry" key={p.id}>
                <div className="colorside-entry-head">
                  <span className="colorside-entry-title">{p.name || '项目名称'}</span>
                  <span className="colorside-date">{p.start} — {p.end}</span>
                </div>
                <div className="colorside-sub">{p.role}</div>
                {p.description && <p className="colorside-desc">{p.description}</p>}
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className="colorside-section">
            <h2>教育经历</h2>
            {education.map((e) => (
              <div className="colorside-entry" key={e.id}>
                <div className="colorside-entry-head">
                  <span className="colorside-entry-title">{e.school || '学校'}</span>
                  <span className="colorside-date">{e.start} — {e.end}</span>
                </div>
                <div className="colorside-sub">{e.major} · {e.degree}</div>
                {e.description && <p className="colorside-desc">{e.description}</p>}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}
