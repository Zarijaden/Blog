// themes/redefine/source/js/talk.js
document.addEventListener('DOMContentLoaded', function() {
  // 初始化变量
  let currentStart = 0;
  const limit = 10; // 每次加载10条
  const container = document.getElementById('hpp-talk-container');
  const loadMoreBtn = document.getElementById('load-more').querySelector('button');

  // 初始加载
  fetchTalks();

  // 定义获取说说的函数
  function fetchTalks() {
    const apiUrl = '/hpp/api/gethpptalk'; // 请确保此路径正确，可能需要填写完整URL
    const postData = {
      limit: limit,
      start: currentStart
    };

    fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      if (data.length > 0) {
        renderTalks(data);
        currentStart += data.length; // 更新起始位置
        if (data.length < limit) {
          // 如果返回的数据少于请求数，说明没有更多了
          loadMoreBtn.style.display = 'none';
          container.insertAdjacentHTML('beforeend', '<p style="text-align:center;">没有更多说说了。</p>');
        }
      } else {
        // 没有数据
        if (currentStart === 0) {
          container.innerHTML = '<p>暂时还没有说说。</p>';
        }
        loadMoreBtn.style.display = 'none';
        container.insertAdjacentHTML('beforeend', '<p style="text-align:center;">没有更多说说了。</p>');
      }
    })
    .catch(error => {
      console.error('获取说说失败:', error);
      container.innerHTML = '<p>加载说说时出错，请稍后再试。</p>';
    });
  }

  // 定义渲染说说的函数
  function renderTalks(talks) {
    talks.forEach(talk => {
      const talkEl = document.createElement('div');
      talkEl.className = 'talk-item';
      talkEl.innerHTML = `
        <div class="talk-header">
          <img src="${talk.avatar}" alt="${talk.name}" class="talk-avatar" onerror="this.src='/default-avatar.png'">
          <div>
            <strong class="talk-user">${talk.name}</strong>
            <div class="talk-time">${talk.time}</div>
          </div>
        </div>
        <div class="talk-content">${marked.parse(talk.content)}</div> <!-- 使用marked解析Markdown -->
        <hr>
      `;
      container.appendChild(talkEl);
    });
  }

  // 将loadMore函数挂载到window，以便HTML中的onclick调用
  window.loadMore = fetchTalks;
});