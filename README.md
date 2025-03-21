# Life Coach - AI 个人成长助手

一个基于 Vue 3 + TypeScript + Tailwind CSS 构建的 AI 个人成长助手应用，集成了 DeepSeek API 实现智能对话功能。

## 项目状态检查清单

### 基础配置
- [x] Vue 3 + TypeScript + Vite 环境
- [x] Tailwind CSS 样式框架
- [x] 路由系统配置
- [x] API 服务集成
- [x] 环境变量配置

### 功能实现
- [x] 用户认证
  - [x] 登录/注册界面
  - [x] 路由守卫
  - [x] Token 管理
- [x] 聊天功能
  - [x] 消息发送/接收
  - [x] 新对话创建
  - [x] 会话历史记录
  - [x] 消息持久化
- [x] UI 组件
  - [x] 导航栏
  - [x] 侧边栏
  - [x] 聊天窗口
  - [x] 响应式布局

### 待实现功能
- [ ] 用户设置页面
- [ ] 成长记录功能
- [ ] 目标追踪系统
- [ ] 数据分析报告
- [ ] 主题切换功能

## 技术栈

- 前端框架：Vue 3
- 类型系统：TypeScript
- 状态管理：Vue Composition API
- 路由系统：Vue Router
- 样式框架：Tailwind CSS
- UI 组件：自定义组件
- API 集成：DeepSeek API
- 构建工具：Vite

## 项目结构

```
life-coach/
├── src/
│   ├── components/          # 通用组件
│   │   ├── NavBar.vue      # 导航栏组件
│   │   ├── Sidebar.vue     # 侧边栏组件
│   │   └── ChatWindow.vue  # 对话窗口组件
│   ├── views/              # 页面视图
│   │   ├── LoginView.vue   # 登录页面
│   │   ├── SessionView.vue # 对话会话页面
│   │   └── GrowthView.vue  # 成长记录页面
│   ├── router/             # 路由配置
│   │   └── index.ts
│   ├── services/           # API 服务
│   │   ├── api.ts         # API 配置
│   │   ├── auth.ts        # 认证服务
│   │   └── chat.ts        # 对话服务
│   ├── types/             # 类型定义
│   │   └── chat.ts        # 类型定义
│   ├── App.vue            # 根组件
│   └── main.ts            # 入口文件
├── public/                # 静态资源
├── .env                   # 环境变量
├── index.html            # HTML 模板
├── package.json          # 项目依赖
├── tsconfig.json         # TypeScript 配置
├── vite.config.ts        # Vite 配置
└── README.md             # 项目说明
```

## 安装和使用

1. 克隆项目
```bash
git clone <repository-url>
cd life-coach
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
# 复制环境变量示例文件
cp .env.example .env

# 编辑 .env 文件，添加必要的配置
VITE_DEEPSEEK_API_KEY=your_api_key_here
VITE_API_BASE_URL=https://api.deepseek.com/v1
```

4. 启动开发服务器
```bash
npm run dev
```

5. 构建生产版本
```bash
npm run build
```

## 使用说明

1. 首次使用
   - 访问 /register 注册新账号
   - 使用邮箱和密码创建账号
   - 登录系统

2. 开始对话
   - 点击"新对话"按钮开始新的对话
   - 在输入框中输入消息
   - 使用 Enter 键快速发送消息
   - 等待 AI 助手回复

3. 会话管理
   - 使用历史记录按钮查看过往对话
   - 点击洞察按钮查看对话分析
   - 会话自动保存到本地存储

4. 注意事项
   - 确保已正确配置 DeepSeek API Key
   - 保持网络连接稳定
   - 定期清理浏览器缓存以获得最佳体验

## 常见问题

1. 新对话按钮无响应
   - 检查 API Key 配置是否正确
   - 查看浏览器控制台是否有错误信息
   - 清除浏览器缓存后重试

2. 消息发送失败
   - 确认网络连接正常
   - 验证 API Key 是否有效
   - 检查请求是否被跨域限制

3. 登录状态丢失
   - 检查 localStorage 是否被清除
   - 确认 token 是否过期
   - 重新登录系统

## 开发规范

1. 代码风格
   - 使用 TypeScript 类型注解
   - 遵循 Vue 3 组合式 API 风格
   - 保持组件单一职责

2. 提交规范
   - 使用清晰的提交信息
   - 遵循语义化版本控制
   - 保持提交粒度适中

3. 文档维护
   - 及时更新 README
   - 添加必要的代码注释
   - 记录重要的更新日志

## 许可证

MIT License 