async function loadAINews() {
    try {
        const resp = await fetch('data/news.json');
        const data = await resp.json();
        
        const dates = Object.keys(data).sort().reverse();
        
        if (document.getElementById('ai-news-list')) {
            renderTodayAI(dates, data);
        }
        if (document.getElementById('ai-archive-list')) {
            renderArchiveAI(dates, data);
        }
    } catch (e) {
        const containers = ['ai-news-list', 'ai-archive-list'];
        containers.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '<div class="loading">No news yet — check back tomorrow at 8 AM!</div>';
        });
    }
}

const rankEmojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];

function renderTodayAI(dates, data) {
    const container = document.getElementById('ai-news-list');
    const today = dates[0];
    
    if (!today) {
        container.innerHTML = '<div class="loading">No news yet — check back tomorrow at 8 AM!</div>';
        return;
    }
    
    document.getElementById('current-date').innerHTML = '📅 ' + today;
    
    const items = data[today];
    if (!items || items.length === 0) {
        container.innerHTML = '<div class="loading">No news available for today.</div>';
        return;
    }
    
    container.innerHTML = items.map((item, i) => `
        <div class="news-card">
            <div class="news-rank">${rankEmojis[i] || (i + 1)}</div>
            <h2>${item.title}</h2>
            <div class="news-source">${item.source || 'Unknown source'}</div>
            <div class="news-summary">${item.summary}</div>
            <a class="news-link" href="${item.url}" target="_blank" rel="noopener">Read full article →</a>
        </div>
    `).join('');
}

function renderArchiveAI(dates, data) {
    const container = document.getElementById('ai-archive-list');
    
    if (dates.length === 0) {
        container.innerHTML = '<div class="loading">No archives yet.</div>';
        return;
    }
    
    container.innerHTML = dates.map(date => {
        const count = data[date] ? data[date].length : 0;
        return `
            <div class="archive-item">
                <a href="ai-it/news-ai/${date}.html">${date}</a>
                <span class="archive-count">${count} stories</span>
            </div>
        `;
    }).join('');
}

loadAINews();
