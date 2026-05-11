async function loadHKNews() {
    try {
        const resp = await fetch('data-hk/news-hk.json');
        const data = await resp.json();
        
        const dates = Object.keys(data).sort().reverse();
        
        if (document.getElementById('hk-news-list')) {
            renderTodayHK(dates, data);
        }
        if (document.getElementById('hk-archive-list')) {
            renderArchiveHK(dates, data);
        }
    } catch (e) {
        const containers = ['hk-news-list', 'hk-archive-list'];
        containers.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '<div class="loading">No news yet — check back tomorrow at 8 AM!</div>';
        });
    }
}

function renderTodayHK(dates, data) {
    const container = document.getElementById('hk-news-list');
    const today = dates[0];
    
    if (!today) {
        container.innerHTML = '<div class="loading">No news yet — check back tomorrow at 8 AM!</div>';
        return;
    }
    
    document.getElementById('current-date').textContent = today + ' 🇭🇰';
    
    const items = data[today];
    if (!items || items.length === 0) {
        container.innerHTML = '<div class="loading">No news available for today.</div>';
        return;
    }
    
    container.innerHTML = items.map((item, i) => `
        <div class="news-card">
            <div class="news-rank">${i + 1}</div>
            <h2>${item.title}</h2>
            <div class="news-source">${item.source || 'Unknown source'}</div>
            <div class="news-summary">${item.summary}</div>
            <a class="news-link" href="${item.url}" target="_blank" rel="noopener">Read full article →</a>
        </div>
    `).join('');
}

function renderArchiveHK(dates, data) {
    const container = document.getElementById('hk-archive-list');
    
    if (dates.length === 0) {
        container.innerHTML = '<div class="loading">No archives yet.</div>';
        return;
    }
    
    container.innerHTML = dates.map(date => {
        const count = data[date] ? data[date].length : 0;
        return `
            <div class="archive-item">
                <a href="hk-news/news-hk/${date}.html">${date}</a>
                <span class="archive-count">${count} stories</span>
            </div>
        `;
    }).join('');
}

loadHKNews();
