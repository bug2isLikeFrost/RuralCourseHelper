const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const API_CONFIG = {
  apiKey: process.env.DEEPSEEK_API_KEY || '',
  apiUrl: 'https://api.deepseek.com/chat/completions',
  model: 'deepseek-chat'
};

console.log('API Key loaded:', API_CONFIG.apiKey ? 'YES (length: ' + API_CONFIG.apiKey.length + ')' : 'NO');

app.post('/api/generate', async (req, res) => {
  const { prompt } = req.body;

  if (!API_CONFIG.apiKey) {
    return res.status(500).json({ error: 'API Key not configured' });
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
          { role: 'system', content: '你是一位乡村教育专家，擅长将本地乡土资源转化为跨学科课程方案。' },
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