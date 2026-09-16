# 🚀 神绘简历 · 部署指南

本项目有两种部署形态，任选其一：

- **方式一（推荐）**：Zeabur 免费部署 —— 不用买服务器，国内访问快，几分钟上线
- **方式二**：自己的服务器（云服务器 / 家里电脑）—— 一条 Node 命令跑起来

> AI 功能说明：AI 调用需要 Node 环境（`server.mjs` 兼做代理）。纯静态托管（GitHub Pages / 对象存储等）只能跑简历编辑/预览/导出，**没有 AI**。

---

## 方式一：Zeabur 免费部署（推荐 ⭐）

[Zeabur](https://zeabur.com) 是国内团队做的部署平台，免费版 + 中文文档 + 国内访问快，支持直接跑 Node 服务。

### 准备（约 5 分钟）

1. 注册 GitHub 账号（没有的话注册一个，Zeabur 用 GitHub 登录）
2. 把项目代码推到你的 GitHub 仓库：
   ```bash
   cd shenghui-resume
   git init
   git add .
   git commit -m "神绘简历"
   # 在 GitHub 网页新建仓库后：
   git remote add origin https://github.com/<你的用户名>/shenghui-resume.git
   git push -u origin main
   ```

### 部署（约 3 分钟）

1. 打开 [zeabur.com](https://zeabur.com)，用 GitHub 登录，进入控制台
2. 点击「新建项目」→ 输入项目名（如 `shenghui-resume`）→ 选择区域（选**香港**或**新加坡**，国内访问更快）
3. 选择「部署新服务」→「从 GitHub 导入」→ 授权并选择 `shenghui-resume` 仓库
4. Zeabur 自动开始构建（本项目已配置 `zbpack.json`：`npm run build` 构建 → `node server.mjs` 启动），等待状态变绿
5. 部署完成后，点击服务 →「网络」标签 → 生成域名，会得到类似 `xxx.zeabur.app` 的地址

### 配置 AI 共享 Key（可选但推荐）

在服务「变量」标签添加环境变量：

| 变量名 | 值 |
|---|---|
| `DEEPSEEK_API_KEY` | 你的 DeepSeek API Key（[platform.deepseek.com](https://platform.deepseek.com) 获取） |

保存后重启服务，你的所有访问者**打开即用 AI，无需自己填 Key**。

> 不配置也能用：用户可自带 Key（AI 面板里填写）。

### 绑定自己的域名（可选）

在「网络」标签 → 自定义域名 → 输入你购买的域名，按提示添加 CNAME 记录指向 Zeabur 提供的地址，等待生效即可。

### 免费额度说明

Zeabur Free 版（$0/月）适合个人/小规模使用；流量较大时可升级 Dev 版（$5/月，14 天试用）。

---

## 方式二：自己的服务器

适用：阿里云 / 腾讯云轻量服务器、任何有公网 IP 的机器（含家里电脑）。

### 1. 装 Node.js

```bash
# Debian/Ubuntu
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # 需 >= 18
```

### 2. 上传代码并构建

```bash
# 本地先打包：在项目目录执行
npm install --ignore-scripts
npm run build

# 把整个 shenghui-resume 目录上传到服务器（scp / ftp / 宝塔面板均可）
cd /path/to/shenghui-resume
npm install --ignore-scripts   # 服务器上再装一次依赖
```

### 3. 启动

```bash
# 前台启动（测试用）
node server.mjs

# 后台常驻（生产用，可选配共享 Key）
DEEPSEEK_API_KEY=sk-xxx nohup node server.mjs > server.log 2>&1 &

# 或使用 pm2 守护进程
npm i -g pm2
DEEPSEEK_API_KEY=sk-xxx pm2 start server.mjs --name shenghui-resume
```

### 4. 开放端口并访问

- 默认端口 **3001**（可用环境变量 `PORT` 修改）
- 云服务器需要在**安全组/防火墙**放行 3001 端口
- 访问 `http://服务器公网IP:3001`

### 5. （可选）Nginx 反代 + 域名 + HTTPS

```nginx
server {
    listen 80;
    server_name your-domain.com;
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

配置好域名解析后，可用 certbot 免费申请 HTTPS 证书。

---

## ✅ 部署后验证清单

1. 打开网站 → 应弹出「新手向导」（首次访问）
2. 「✨ 一键生成」→ 描述经历 → 点生成（配了共享 Key 应直接成功；否则需在 AI 面板填 Key）
3. 加载岗位示例 → 切换模板 → 改主题色 → 预览正常
4. 「📊 体检」出分 → 「🖨️ PDF / 📄 Word / 🖼️ 图片」导出正常

## ❓ 常见问题

- **页面打开了但 AI 报错「缺少 Key」**：未配置 `DEEPSEEK_API_KEY`，且用户也没填 Key——配置共享 Key 或让用户自带
- **部署后一直构建失败**：确认 `package.json` 的 `packageManager` 为 `npm@10.9.2`（Zeabur 默认用 yarn，本项目指定了 npm）
- **国内访问慢**：Zeabur 选香港/新加坡区域；或绑定自定义域名
