// 神绘简历 - DeepSeek AI 调用封装
// 浏览器不能直连 LLM API（CORS），统一走同源 /api/ai 代理（server.mjs 或 vite dev 代理）。
// API Key 仅存用户浏览器本地，随请求体发送，由代理转发给 DeepSeek。

export interface AIResult {
  ok: boolean
  content?: string
  error?: string
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export async function callDeepSeek(options: {
  /** 用户自带 Key；为空字符串时表示依赖服务端共享 Key（server.mjs 配置 DEEPSEEK_API_KEY） */
  apiKey: string
  system: string
  user: string
  model?: string
}): Promise<AIResult> {
  try {
    const res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        apiKey: options.apiKey,
        model: options.model ?? 'deepseek-chat',
        messages: [
          { role: 'system', content: options.system },
          { role: 'user', content: options.user },
        ] as ChatMessage[],
      }),
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      return { ok: false, error: data.error ?? `请求失败（HTTP ${res.status}）` }
    }
    return { ok: true, content: data.content }
  } catch (e) {
    return { ok: false, error: `网络错误：${String(e)}` }
  }
}

/** 检测服务端是否配置了共享 AI Key（配置后用户无需自备 Key） */
export async function checkAIConfig(): Promise<boolean> {
  try {
    const res = await fetch('/api/ai/config')
    const data = await res.json()
    return Boolean(data?.serverKey)
  } catch {
    return false
  }
}

/** 通用系统提示词：简历优化专家 */
export const RESUME_EXPERT_SYSTEM = `你是一位资深的人力资源专家与简历优化顾问，精通中文求职简历的撰写规范。
你的职责是把用户提供的零散信息，改写成专业、简洁、结果导向的中文简历内容。
要求：
1. 用简洁有力的动词开头（如"负责、主导、搭建、推动、优化"）；
2. 尽量量化成果（数据、百分比、规模）；
3. 每段经历 3-5 条要点，每条一行（用换行分隔），不要编号；
4. 贴合国内求职市场习惯，不使用夸张词汇；
5. 直接输出改写后的内容，不要任何解释、标题或前后缀。`
