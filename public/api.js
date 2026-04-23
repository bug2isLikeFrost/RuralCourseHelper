const API_CONFIG = {
  apiKey: 'sk-e397eb9c02964beea4414ff32b235201',
  apiUrl: 'https://api.deepseek.com/chat/completions',
  localUrl: '/api/generate',
  model: 'deepseek-chat',
  useLocal: true
};

async function callAI(prompt) {
  if (API_CONFIG.useLocal) {
    const response = await fetch(API_CONFIG.localUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!response.ok) {
      throw new Error(`本地服务器调用失败: ${response.status}`);
    }
    const data = await response.json();
    return data.result;
  }

  const response = await fetch(API_CONFIG.apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${API_CONFIG.apiKey}`
    },
    body: JSON.stringify({
      model: API_CONFIG.model,
      messages: [
        { role: 'system', content: PROMPT_TEMPLATES.systemPrompt },
        { role: 'user', content: prompt }
      ]
    })
  });

  if (!response.ok) {
    throw new Error(`API调用失败: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

function setApiKey(key) {
  API_CONFIG.apiKey = key;
}

function setModel(model) {
  API_CONFIG.model = model;
}