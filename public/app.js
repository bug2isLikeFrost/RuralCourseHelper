(function() {
  let currentType = '其他';
  let lastInput = '';

  function init() {
    setupSplashScreen();
    setupTypeButtons();
    setupGenerateButton();
    setupActionButtons();
    setupApiKeyInput();
  }

  function setupApiKeyInput() {
    const apiKeyInput = document.getElementById('api-key');
    apiKeyInput.addEventListener('input', (e) => {
      const key = e.target.value.trim();
      if (key) {
        setApiKey(key);
        API_CONFIG.useLocal = false;
      } else {
        API_CONFIG.useLocal = true;
        API_CONFIG.apiKey = undefined;
      }
    });
  }

  function setupSplashScreen() {
    setTimeout(() => {
      showPage('input-page');
    }, 2000);
  }

  function setupTypeButtons() {
    const buttons = document.querySelectorAll('.type-btn');
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentType = btn.dataset.type;
      });
    });
  }

  function setupGenerateButton() {
    const btn = document.getElementById('generate-btn');
    btn.addEventListener('click', handleGenerate);
  }

  function setupActionButtons() {
    document.getElementById('regenerate-btn').addEventListener('click', handleGenerate);
    document.getElementById('back-btn').addEventListener('click', () => {
      showPage('input-page');
    });
  }

  function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
      page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
  }

  async function handleGenerate() {
    const input = document.getElementById('local-thing').value.trim();

    if (!input) {
      alert('请描述本地事物');
      return;
    }

    lastInput = input;
    showLoading(true);

    try {
      if (!API_CONFIG.apiKey) {
        showDemoResult(input);
        return;
      }

      const prompt = PROMPT_TEMPLATES.generateCourses(input, currentType);
      const response = await callAI(prompt);
      const courses = PROMPT_TEMPLATES.parseResponse(response);

      if (courses && courses.length > 0) {
        renderCourses(courses, input);
        showPage('result-page');
      } else {
        console.warn('AI返回内容解析失败，显示演示模式');
        showDemoResult(input);
      }
    } catch (error) {
      console.error('生成失败:', error);
      alert('生成失败: ' + error.message);
      showPage('input-page');
      showLoading(false);
      return;
    } finally {
      showLoading(false);
    }
  }

  function showDemoResult(input) {
    const demoCourses = [
      {
        学科: '语文',
        课程名称: `${input}观察日记`,
        适合年级: '3-4年级',
        核心知识点: '观察描写顺序、修辞手法',
        活动步骤: ['带领学生实地观察', '运用五感法描写', '分享交流观察心得'],
        所需材料: '白纸、铅笔、放大镜（可选）',
        延伸问题: `${input}在我们的生活中还有什么用途？`,
        知识库: '观察是写作的基础，通过五感法（视觉、听觉、嗅觉、味觉、触觉）可以让学生更全面地描述事物。',
        相关链接: [
          { name: '国家中小学智慧教育平台', url: 'https://www.zxx.edu.cn/' }
        ]
      },
      {
        学科: '科学',
        课程名称: `${input}的科学奥秘`,
        适合年级: '4-5年级',
        核心知识点: '自然科学观察方法',
        活动步骤: ['提出科学问题', '设计观察实验', '记录分析数据', '总结科学结论'],
        所需材料: '尺子、记录本、笔',
        延伸问题: `${input}随季节变化有什么不同？`,
        知识库: '科学观察需要系统的方法，包括提出问题、做出假设、设计实验、收集数据、分析结论等步骤。',
        相关链接: [
          { name: '中国科普博览', url: 'https://www.kepu.com.cn/' }
        ]
      },
      {
        学科: '数学',
        课程名称: `${input}中的数学`,
        适合年级: '2-3年级',
        核心知识点: '数量统计与图形认识',
        活动步骤: ['分类计数', '测量记录', '制作统计图表'],
        所需材料: '计数石、尺子、彩笔、白纸',
        延伸问题: `如何用数学语言描述${input}？`,
        知识库: '数学源于生活，通过对身边事物的计数和测量，学生可以建立数感和量感。',
        相关链接: [
          { name: '教育部官网', url: 'https://www.moe.gov.cn/' }
        ]
      },
      {
        学科: '美术',
        课程名称: `${input}写生课`,
        适合年级: '1-6年级',
        核心知识点: '色彩搭配与线条运用',
        活动步骤: ['观察实物形态', '分析色彩变化', '创作写生作品'],
        所需材料: '画纸、铅笔、水彩笔',
        延伸问题: `如何用画笔捕捉${input}的神韵？`,
        知识库: '写生训练学生的观察能力和造型能力，是美术学习的重要基础。',
        相关链接: [
          { name: '中国科普博览', url: 'https://www.kepu.com.cn/' }
        ]
      }
    ];

    renderCourses(demoCourses, input);
    showPage('result-page');
  }

  function formatSteps(steps) {
    if (Array.isArray(steps)) {
      return steps.join('<br>');
    }
    if (typeof steps === 'string') {
      return steps.replace(/\n/g, '<br>');
    }
    return String(steps);
  }

  function truncateText(text, maxLength) {
    if (!text) return '';
    if (typeof text === 'string') {
      return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
    }
    if (Array.isArray(text)) {
      return text.length > 2 ? text.slice(0, 2).join('、') + '...' : text.join('、');
    }
    return String(text);
  }

  window.openCourseDetail = function(index) {
    const course = window.courseData[index];
    if (!course) return;
    const data = { course, localThing: window.courseInput };
    const encoded = btoa(encodeURIComponent(JSON.stringify(data)));
    window.open('detail.html?data=' + encoded, '_blank');
  };

  function renderCourses(courses, input) {
    window.courseData = courses;
    window.courseInput = input;
    const container = document.getElementById('course-cards');
    container.innerHTML = courses.map((course, index) => {
      const knowledge = truncateText(course.核心知识点 || course.knowledge, 30);
      return `
      <div class="course-card">
        <div class="card-header">
          <span class="card-title">${course.课程名称 || course.name || '未命名课程'}</span>
          <span class="card-subject">${course.学科 || course.subject || '综合'}</span>
        </div>
        <div class="card-grade">适合年级：${course.适合年级 || course.grade || '未知'}</div>
        <div class="card-section">
          <div class="card-section-title">核心知识点</div>
          <div class="card-section-content">${knowledge}</div>
        </div>
        <div class="card-actions">
          <button class="detail-btn" onclick="openCourseDetail(${index})">📖 查看完整课程</button>
        </div>
      </div>
      `;
    }).join('');

    document.getElementById('result-subtitle').textContent = `基于"${input}"生成的课程方案`;
  }

  function showLoading(show) {
    const loading = document.getElementById('loading');
    const btn = document.getElementById('generate-btn');
    if (show) {
      loading.classList.remove('hidden');
      btn.disabled = true;
    } else {
      loading.classList.add('hidden');
      btn.disabled = false;
    }
  }

  document.addEventListener('DOMContentLoaded', init);
})();