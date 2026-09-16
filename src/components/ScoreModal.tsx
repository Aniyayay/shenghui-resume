// 简历体检：评分弹窗（本地规则即时评分 + 改进建议）
import { useResumeStore } from '../store/useResumeStore'
import { scoreResume } from '../utils/resumeScore'

interface Props {
  onClose: () => void
}

export default function ScoreModal({ onClose }: Props) {
  const data = useResumeStore((s) => s.data)
  const score = scoreResume(data)

  const ringColor =
    score.total >= 85 ? '#16a34a' : score.total >= 70 ? '#0ea5e9' : score.total >= 50 ? '#f59e0b' : '#dc2626'

  return (
    <div className="cover-modal" onClick={onClose}>
      <div className="cover-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="cover-modal-head">
          <span className="cover-modal-title">📊 简历体检</span>
          <button type="button" className="btn btn-ghost btn-sm" onClick={onClose}>
            关闭
          </button>
        </div>

        <div className="score-body">
          <div className="score-hero">
            <div
              className="score-ring"
              style={
                {
                  '--pct': score.total,
                  '--ring': ringColor,
                } as React.CSSProperties
              }
            >
              <div className="score-ring-inner">
                <strong>{score.total}</strong>
                <small>/ {score.max}</small>
              </div>
            </div>
            <div className="score-level" style={{ color: ringColor }}>
              {score.level}
            </div>
            <p className="score-hint">
              {score.total >= 85
                ? '非常棒！这份简历已经很能打了 🎉'
                : score.total >= 70
                  ? '不错的简历，按下面建议再打磨一下会更好'
                  : '还需要完善，按下面的建议逐项补充即可'}
            </p>
          </div>

          <div className="score-items">
            {score.items.map((it) => (
              <div className="score-item" key={it.key}>
                <div className="score-item-head">
                  <span className="score-item-label">{it.label}</span>
                  <span className="score-item-num">
                    {it.score}/{it.max}
                  </span>
                </div>
                <div className="score-bar">
                  <i
                    style={{
                      width: `${Math.min(100, (it.score / it.max) * 100)}%`,
                      background: ringColor,
                    }}
                  />
                </div>
                {it.tips.length > 0 && (
                  <ul className="score-tips">
                    {it.tips.map((t, i) => (
                      <li key={i}>💡 {t}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
