const PROMPT_TEMPLATES = {
  systemPrompt: `你是一位乡村教育专家，擅长将本地乡土资源转化为跨学科课程方案。`,

  generateCourses: function(localThing, type) {
    return `请根据教师提供的本地事物，生成4-6个跨学科课程方案。

本地事物：${localThing}
素材类型：${type}

输出格式要求：
1. 必须输出有效的JSON数组格式
2. 每个课程方案必须包含以下字段：
   - 学科：课程所属学科（如：语文、数学、科学、美术、音乐、综合实践等）
   - 课程名称：富有创意和吸引力的课程名称
   - 适合年级：具体年级范围
   - 核心知识点：1-2个主要知识点
   - 活动步骤：具体的3-4个活动步骤
   - 延伸问题：1个启发性思考问题
   - 知识库：简要的备课参考资料（200字以内），帮助教师理解课程内容
   - 相关链接：一个JSON数组，包含2-3个参考链接，每个链接需要有name（网站名称）和url（真实可访问的URL）

3. 课程要体现跨学科融合特点，注重实践性和趣味性
4. 活动步骤要具体可操作，适合乡村学校实际情况
5. 相关链接必须是真实可靠的资源（如：教育部官网、科普网站、名师公开课等）

请直接输出JSON数组，不要包含任何其他文字说明。`;
  },

  parseResponse: function(text) {
    try {
      let jsonStr = text.trim();
      const jsonMatch = jsonStr.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        jsonStr = jsonMatch[0];
      }
      const courses = JSON.parse(jsonStr);
      if (Array.isArray(courses)) {
        return courses.slice(0, 6);
      }
      return null;
    } catch (e) {
      console.error('JSON解析失败:', e);
      return null;
    }
  }
};