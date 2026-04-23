# 乡野课程助手

让乡土资源走进课堂，AI 助力乡村教师快速生成跨学科课程方案。

## 功能特点

- 📝 输入本地事物（竹林、稻田、腌菜、春节习俗、二十四节气等）
- 🎯 支持多种素材类型：植物、动物、食物、习俗、节气等
- ✨ AI 自动生成 4-6 个跨学科课程方案
- 📚 每个方案包含学科、课程名称、适合年级、核心知识点、活动步骤、延伸问题及备课参考资料
- 🔗 提供真实可靠的参考资源链接

## 技术栈

- **前端**: HTML5 + CSS3 + Vanilla JavaScript
- **后端**: Node.js + Express.js
- **AI API**: DeepSeek Chat API

## 快速开始

### 环境要求

- Node.js >= 14.x
- DeepSeek API Key

### 安装

```bash
npm install
```

### 配置

设置 DeepSeek API Key：

**方式一：环境变量（推荐）**

```bash
# Windows
set DEEPSEEK_API_KEY=your_api_key_here

# macOS/Linux
export DEEPSEEK_API_KEY=your_api_key_here
```

**方式二：运行后端服务后在前端界面输入**

启动服务后，在页面输入框中输入您的 DeepSeek API Key（可选）。

### 启动服务

```bash
npm start
```

服务启动后，访问 http://localhost:3000

### 使用演示模式

如果不输入 API Key，系统将使用演示模式，显示预设的课程案例。

## 项目结构

```
RuralCourseHelper/
├── public/
│   ├── index.html      # 主页面
│   ├── detail.html     # 详情页面
│   ├── app.js         # 前端应用逻辑
│   ├── api.js         # API 调用模块
│   ├── prompt.js      # AI 提示词模板
│   └── style.css      # 样式文件
├── server.js          # Express 服务器
├── package.json       # 项目配置
└── README.md
```

## API 接口

### POST /api/generate

生成课程方案。

**请求体：**

```json
{
  "prompt": "用户输入的提示词"
}
```

**响应：**

```json
{
  "result": "AI 生成的课程方案内容"
}
```

## 课程生成示例

输入示例：
- 本地事物：竹林
- 素材类型：植物

输出示例：
- 学科：语文
- 课程名称：竹韵诗文赏析
- 适合年级：3-4年级
- 核心知识点：古诗词中的竹意象、咏竹名句
- 活动步骤：...
- 延伸问题：...
- 知识库：...
- 相关链接：[...]

## License

MIT
