// ============================================================
// 神绘简历 - 单文件部署服务
// 一条命令：node server.mjs
// 功能：
//   1) 托管构建产物 dist/（纯静态主站）
//   2) 转发 /api/ai 到 DeepSeek 官方 API（浏览器不能直连 LLM，CORS 限制）
// 用法：
//   开发：npm run dev（Vite + 本服务 3001 端口，Vite 代理 /api）
//   生产：npm run build && npm run serve（同源托管静态文件 + AI 代理）
// 环境变量：PORT（默认 3001）、DEEPSEEK_BASE_URL（默认官方地址）、DEEPSEEK_API_KEY（可选，配置后所有访问者共享该 Key 调用 AI，无需自备）
// ============================================================

import { createServer } from 'node:http'
import { readFile } from 'node:fs/promises'
import { extname, join, normalize } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))
const PORT = Number(process.env.PORT || 3001)
const DIST_DIR = join(__dirname, 'dist')
const DEEPSEEK_BASE_URL = process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com'
// 共享 API Key（可选）：配置后 /api/ai 使用该 Key，访问者无需自备 Key
const SERVER_API_KEY = process.env.DEEPSEEK_API_KEY || ''

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.map': 'application/json',
}

function sendJson(res, status, obj) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' })
  res.end(JSON.stringify(obj))
}

// ---- AI 代理：POST /api/ai ----
async function handleAI(req, res) {
  let raw = ''
  for await (const chunk of req) raw += chunk

  let payload
  try {
    payload = JSON.parse(raw)
  } catch {
    return sendJson(res, 400, { error: '请求体不是合法 JSON' })
  }

  const { apiKey, model, messages } = payload
  // Key 选择：优先服务端共享 Key（配置了就用它），否则用请求携带的 Key
  const useKey = SERVER_API_KEY || apiKey
  if (!useKey) return sendJson(res, 400, { error: '缺少 DeepSeek API Key' })
  if (!Array.isArray(messages) || messages.length === 0) {
    return sendJson(res, 400, { error: '缺少 messages' })
  }

  try {
    const upstream = await fetch(`${DEEPSEEK_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${useKey}`,
      },
      body: JSON.stringify({
        model: model || 'deepseek-chat',
        messages,
        stream: false,
      }),
    })

    const data = await upstream.json().catch(() => ({}))
    if (!upstream.ok) {
      const msg = data?.error?.message || `DeepSeek 返回错误（HTTP ${upstream.status}）`
      return sendJson(res, upstream.status, { error: msg })
    }

    const content = data?.choices?.[0]?.message?.content ?? ''
    return sendJson(res, 200, { content })
  } catch (e) {
    return sendJson(res, 502, { error: `AI 服务调用失败：${String(e)}` })
  }
}

// ---- 静态文件托管（SPA 回退）----
async function serveStatic(req, res, pathname) {
  // 防目录穿越
  const safe = normalize(pathname).replace(/^(\.\.[/\\])+/, '')
  let filePath = join(DIST_DIR, safe)
  if (safe === '/' || safe === '\\' || safe === '') {
    filePath = join(DIST_DIR, 'index.html')
  }

  try {
    let data = await readFile(filePath)
    let type = MIME[extname(filePath).toLowerCase()] || 'application/octet-stream'
    // SPA 回退：未命中资源时返回 index.html（排除带扩展名的请求，避免资源 404 变 html）
    if (data === undefined) throw new Error('not found')
    res.writeHead(200, { 'Content-Type': type })
    return res.end(data)
  } catch {
    if (!extname(pathname)) {
      try {
        const idx = await readFile(join(DIST_DIR, 'index.html'))
        res.writeHead(200, { 'Content-Type': MIME['.html'] })
        return res.end(idx)
      } catch {
        return sendJson(res, 404, { error: '未找到页面。请先执行 npm run build 生成 dist/' })
      }
    }
    return sendJson(res, 404, { error: '资源不存在' })
  }
}

const server = createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`)

  // 健康检查 / AI 配置
  if (url.pathname === '/api/health') {
    return sendJson(res, 200, { ok: true, name: 'shenghui-resume' })
  }
  if (url.pathname === '/api/ai/config' && req.method === 'GET') {
    return sendJson(res, 200, { serverKey: Boolean(SERVER_API_KEY) })
  }

  // AI 代理
  if (url.pathname === '/api/ai' && req.method === 'POST') {
    return handleAI(req, res)
  }

  // 静态资源
  if (req.method === 'GET' || req.method === 'HEAD') {
    return serveStatic(req, res, decodeURIComponent(url.pathname))
  }

  sendJson(res, 405, { error: 'Method Not Allowed' })
})

server.listen(PORT, () => {
  console.log(`\n✏️  神绘简历已启动`)
  console.log(`   http://localhost:${PORT}`)
  console.log(`   （静态托管：${DIST_DIR}；AI 代理：POST /api/ai → ${DEEPSEEK_BASE_URL}）\n`)
})
