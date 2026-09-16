// 神绘简历 - 应用根组件
import { useEffect, useState } from 'react'
import EditorPanel from './components/editor/EditorPanel'
import PreviewPanel from './components/PreviewPanel'
import Wizard from './components/Wizard'

export default function App() {
  const [showWizard, setShowWizard] = useState(false)

  // 首次访问（无已保存数据、未看过引导）时弹出新手向导
  useEffect(() => {
    const seen = localStorage.getItem('shenghui-wizard-seen')
    const hasData = localStorage.getItem('shenghui-resume:v1')
    if (!seen && !hasData) setShowWizard(true)
  }, [])

  return (
    <div className="app-shell">
      <EditorPanel />
      <PreviewPanel />
      {showWizard && <Wizard onClose={() => setShowWizard(false)} />}
    </div>
  )
}
