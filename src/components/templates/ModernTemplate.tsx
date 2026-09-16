// 现代简洁模板：左侧边栏（联系方式/技能/证书）+ 右侧主栏（简介/经历）
import type { CSSProperties } from 'react'
import { ResumeData } from '../../types/resume'
import { useResumeStore } from '../../store/useResumeStore'

function LevelDots({ level }: { level: number }) {
  const max = 5
  return (
    <span className="modern-dots">
      {Array.from({ length: max }, (_, i) => (
        <i key={i} className={i < level ? 'on' : ''} />
      ))}
    </span>
  )
}

export default function ModernTemplate({ resume }: { resume: ResumeData }) {
  const themeColor = useResumeStore((s) => s.themeColor)
  const { basic, education, work, projects, skills, certificates } = resume

  return (
    <div className="modern-template" style={{ '--tp': themeColor || undefined } as CSSProperties}>
      <aside className="modern-side">
        <div className="modern-avatar">
          {basic.avatar ? (
            <img src={basic.avatar} alt="头像" />
          ) : (
            <span>{(basic.name || '名').slice(0, 1)}</span>
          )}
        </div>
        <h1 className="modern-name">{basic.name || '你的姓名'}</h1>
        <p className="modern-role">{basic.title}</p>

        <div className="modern-block">
          <h3>联系方式</h3>
          <ul className="modern-contact">
            {basic.phone && <li>📞 {basic.phone}</li>}
            {basic.email && <li>✉️ {basic.email}</li>}
            {basic.location && <li>📍 {basic.location}</li>}
            {basic.birthYear && <li>🎂 {basic.birthYear} 年</li>}
            {basic.website && <li>🔗 {basic.website}</li>}
          </ul>
        </div>

        {skills.length > 0 && (
          <div className="modern-block">
            <h3>专业技能</h3>
            <ul className="modern-skills">
              {skills.map((s) => (
                <li key={s.id}>
                  <span>{s.name || '技能'}</span>
                  <LevelDots level={s.level} />
                </li>
              ))}
            </ul>
          </div>
        )}

        {certificates.length > 0 && (
          <div className="modern-block">
            <h3>证书荣誉</h3>
            <ul className="modern-certs">
              {certificates.map((c) => (
                <li key={c.id}>
                  {c.name}
                  <span>{c.date}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>

      <main className="modern-main">
        {basic.summary && (
          <section className="modern-section">
            <h2>个人简介</h2>
            <p className="modern-summary">{basic.summary}</p>
          </section>
        )}

        {work.length > 0 && (
          <section className="modern-section">
            <h2>工作经历</h2>
            {work.map((w) => (
              <div className="modern-entry" key={w.id}>
                <div className="modern-entry-head">
                  <span className="modern-entry-title">{w.title || '职位'}</span>
                  <span className="modern-entry-date">
                    {w.start} — {w.end}
                  </span>
                </div>
                <div className="modern-entry-sub">{w.company}</div>
                {w.description && <p className="modern-entry-desc">{w.description}</p>}
              </div>
            ))}
          </section>
        )}

        {projects.length > 0 && (
          <section className="modern-section">
            <h2>项目经历</h2>
            {projects.map((p) => (
              <div className="modern-entry" key={p.id}>
                <div className="modern-entry-head">
                  <span className="modern-entry-title">{p.name || '项目名称'}</span>
                  <span className="modern-entry-date">
                    {p.start} — {p.end}
                  </span>
                </div>
                <div className="modern-entry-sub">
                  {p.role}
                  {p.link ? ` · ${p.link}` : ''}
                </div>
                {p.description && <p className="modern-entry-desc">{p.description}</p>}
              </div>
            ))}
          </section>
        )}

        {education.length > 0 && (
          <section className="modern-section">
            <h2>教育经历</h2>
            {education.map((e) => (
              <div className="modern-entry" key={e.id}>
                <div className="modern-entry-head">
                  <span className="modern-entry-title">{e.school || '学校'}</span>
                  <span className="modern-entry-date">
                    {e.start} — {e.end}
                  </span>
                </div>
                <div className="modern-entry-sub">
                  {e.major} · {e.degree}
                </div>
                {e.description && <p className="modern-entry-desc">{e.description}</p>}
              </div>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}
