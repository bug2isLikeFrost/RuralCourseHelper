(function() {
  let currentType = '其他';
  let lastInput = '';

  function init() {
    setupSplashScreen();
    setupTypeButtons();
    setupGenerateButton();
    setupActionButtons();
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
        活动步骤: '1.带领学生实地观察\n2.运用五感法描写\n3.分享交流观察心得',
        延伸问题: `${input}在我们的生活中还有什么用途？`
      },
      {
        学科: '科学',
        课程名称: `${input}的科学奥秘`,
        适合年级: '4-5年级',
        核心知识点: '自然科学观察方法',
        活动步骤: '1.提出科学问题\n2.设计观察实验\n3.记录分析数据\n4.总结科学结论',
        延伸问题: `${input}随季节变化有什么不同？`
      },
      {
        学科: '数学',
        课程名称: `${input}中的数学`,
        适合年级: '2-3年级',
        核心知识点: '数量统计与图形认识',
        活动步骤: '1.分类计数\n2.测量记录\n3.制作统计图表',
        延伸问题: `如何用数学语言描述${input}？`
      },
      {
        学科: '美术',
        课程名称: `${input}写生课`,
        适合年级: '1-6年级',
        核心知识点: '色彩搭配与线条运用',
        活动步骤: '1.观察实物形态\n2.分析色彩变化\n3.创作写生作品',
        延伸问题: `如何用画笔捕捉${input}的神韵？`
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

  function openCourseDetail(course, localThing) {
    const encoded = encodeURIComponent(JSON.stringify({ course, localThing }));
    window.open(`detail.html?data=${encoded}`, '_blank');
  }

  function renderCourses(courses, input) {
    const container = document.getElementById('course-cards');
    container.innerHTML = courses.map((course, index) => `
      <div class="course-card">
        <div class="card-header">
          <span class="card-title">${course.课程名称 || course.name || '未命名课程'}</span>
          <span class="card-subject">${course.学科 || course.subject || '综合'}</span>
        </div>
        <div class="card-grade">适合年级：${course.适合年级 || course.grade || '未知'}</div>
        <div class="card-section">
          <div class="card-section-title">核心知识点</div>
          <div class="card-section-content">${course.核心知识点 || course.knowledge || '无'}</div>
        </div>
        <div class="card-section">
          <div class="card-section-title">活动步骤</div>
          <div class="card-section-content">${formatSteps(course.活动步骤 || course.steps)}</div>
        </div>
        <div class="card-section">
          <div class="card-section-title">延伸问题</div>
          <div class="card-section-content">${course.延伸问题 || course.question || '无'}</div>
        </div>
        <div class="card-actions">
          <button class="detail-btn" onclick="openCourseDetail(courses[${index}], '${input.replace(/'/g, "\\'")}')">📖 查看详情</button>
        </div>
      </div>
    `).join('');

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