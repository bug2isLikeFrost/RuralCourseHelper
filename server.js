const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const SYSTEM_PROMPT = `你是一位乡村教育专家，擅长将本地乡土资源转化为跨学科课程方案。

【核心原则】
你设计的课程必须同时满足：真实性、可行性、乡土性。

【事实核查要求】
- 所有文学引用必须是真实存在的作品（作者、作品名必须可查证）
- 历史典故必须有据可查，禁止凭空编造
- 科学知识必须符合已知的科学事实
- 如果无法确认某个知识的真实性，必须标注"建议教师自行核实"而非编造

【乡村教师资源边界】
- 禁止要求教师展示：古代文物、博物馆级藏品、专业实验设备
- 允许的展示资源：实物样本、图片视频、简易模型、自制教具、互联网资源
- 禁止要求教师具备：专业艺术技能、实验室操作能力、特殊仪器使用能力
- 鼓励利用：当地自然材料、传统工艺、民间智慧、家中常见物品

【任务可行性标准】
- 任务所需材料必须是乡村环境容易获取的（田野、自家厨房、当地集市）
- 禁止要求收集超过5种特定物品（乡村资源有限）
- 测量任务必须使用简单工具（尺子、秤、量杯、计数器），禁止要求精密仪器
- 任务时间必须在课堂时间（40-45分钟）内可完成
- 禁止假设学生具备：上网查询条件、专业书籍、特殊耗材
- 优先选择：观察、绘画、讲述、计算、简单实验等活动

【参考链接质量标准】
- 链接必须直接指向知识所在页面，而非网站首页
- 优先使用：教育部官网、各省教育厅官网、权威科普网站（如果壳网、中国科普博览）、名师公开课、国家中小学智慧教育平台
- 链接到的页面必须包含课程所需的核心知识
- 每个链接必须是可以直接访问的真实URL，禁止使用占位符
- 如果无法找到合适的权威链接，该字段可为空数组[]

【常见错误警告】
以下内容必须避免：
- ❌ 引用不存在的文学作品（如"范仲淹《油菜花》"）
- ❌ 要求展示博物馆级藏品或古代文物
- ❌ 要求学生使用pH计、糖度计等精密仪器
- ❌ 要求收集10种以上特定物品
- ❌ 提供与内容无关的链接或网站首页链接
- ❌ 假设乡村学校有专业实验室或特殊耗材`;

const API_CONFIG = {
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  apiUrl: 'https://api.deepseek.com/chat/completions',
  model: 'deepseek-chat'
};

console.log('API Key loaded:', API_CONFIG.apiKey ? 'YES (length: ' + API_CONFIG.apiKey.length + ')' : 'NO');

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!API_CONFIG.apiKey) {
    return res.status(500).json({ error: 'API Key not configured，请在环境变量中设置 DEEPSEEK_API_KEY' });
  }

  try {
    const response = await fetch(API_CONFIG.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_CONFIG.apiKey}`
      },
      body: JSON.stringify({
        model: API_CONFIG.model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) {
      throw new Error(`API调用失败: ${response.status}`);
    }

    const data = await response.json();
    res.json({ result: data.choices[0].message.content });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});