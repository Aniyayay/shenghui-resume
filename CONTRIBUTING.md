# 贡献指南

感谢你对「神绘简历」的关注！欢迎任何形式的贡献：提 Issue、修 Bug、加模板、改进文档。

## 🐛 报告 Bug

在 [Issues](https://github.com/Aniyayay/shenghui-resume/issues) 中新建 Issue，请尽量包含：

- 复现步骤
- 期望行为 vs 实际行为
- 浏览器 / 系统环境
- 报错信息（如有）

## 💡 提出新功能

也欢迎在 Issues 中描述你的想法。有价值的功能会被优先实现。

## 🔧 本地开发

```bash
npm install
npm run dev      # 前端 Vite 开发服务器 http://localhost:5173
node server.mjs  # AI 代理服务（端口 3001，Vite 已配置 /api 代理）
```

## 🧩 提交 PR

1. Fork 本仓库并创建你的分支
2. 完成修改，确保 `npm run build` 通过（TS 编译 + 打包无错误）
3. 提交 PR，描述改动内容与理由

## 📝 代码规范

- TypeScript + React，保持类型严格（`npm run build` 会执行 `tsc` 检查）
- 组件使用 kebab-case 的类名，样式写在 `src/styles/global.css`
- 新增模板：在 `src/components/templates/` 新建组件，并在 `src/data/templates.ts` 注册

## ⚖️ 许可

本项目采用 MIT License，贡献即代表你同意你的代码以 MIT 协议发布。
