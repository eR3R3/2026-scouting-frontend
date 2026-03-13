# 2025 Scouting Frontend

一个用于FRC机器人比赛数据收集和分析的现代化前端应用。

## 功能特性

- 🤖 比赛数据收集和管理
- 📊 团队性能分析和图表展示
- 🔍 团队搜索和比较
- 📱 响应式设计，支持移动设备
- 🌙 深色/浅色主题切换

## 技术栈

- **框架**: Next.js 15
- **UI库**: HeroUI (React组件库)
- **样式**: Tailwind CSS
- **图表**: ECharts
- **状态管理**: React Hooks
- **类型检查**: TypeScript

## 安装和运行

### 前置要求

确保你的系统已安装：
- Node.js (18.x 或更高版本)
- npm 或 yarn

### 安装依赖

```bash
# 使用npm
npm install

# 或使用yarn
yarn install
```

### 环境配置

创建 `.env.local` 文件并配置API端点：

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/
```
### 配置临时docker数据库

1. docker stop scouting-db 
docker rm scouting-db 
docker run --name scouting-db \
-e POSTGRES_PASSWORD=123456 \
-p 5432:5432 \
-v workspaces_pgdata:/var/lib/postgresql/data \
-d postgres:16

### 运行开发服务器

```bash
# 使用npm
npm run dev

# 或使用yarn
yarn dev
```

应用将在 http://localhost:3000 启动。

### 构建生产版本

```bash
# 使用npm
npm run build
npm start

# 或使用yarn
yarn build
yarn start
```

## 项目结构

```
├── app/                    # Next.js 13+ App Router
│   ├── dashboard/         # 仪表板页面和组件
│   ├── scouting/          # 数据收集表单
│   ├── pit-scouting/      # 维修站侦察
│   └── auth/              # 认证相关
├── components/            # 共享UI组件
├── hooks/                 # 自定义React Hooks
├── public/               # 静态资源
└── ...
```

## 组件说明

### TeamSelector
- 使用HeroUI Autocomplete组件
- 支持实时搜索和筛选
- 显示团队编号和名称

### Dashboard
- 团队性能图表
- 比赛记录列表
- 多标签页界面

## 开发指南

### 添加新组件

1. 在 `components/` 或相应的页面目录下创建组件
2. 使用TypeScript定义接口
3. 遵循现有的命名约定

### 样式指南

- 使用Tailwind CSS类名
- 组件特定样式使用HeroUI的classNames属性
- 保持一致的间距和配色

## 故障排除

### 常见问题

1. **依赖冲突**: 确保只使用HeroUI，移除NextUI依赖
2. **环境变量**: 检查 `.env.local` 文件配置
3. **API连接**: 确认后端API服务正在运行

### 依赖清理

如果遇到依赖问题，可以清理并重新安装：

```bash
rm -rf node_modules package-lock.json
npm install
```

## 贡献

1. Fork此仓库
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开Pull Request

## 许可证

此项目使用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。
