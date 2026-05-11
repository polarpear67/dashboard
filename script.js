// Load news data and render
async function loadNews() {
    try {
        const resp = await fetch('/data/news.json');
        const data = await resp.json();
        
        // Sort by date descending
        const dates = Object.keys(data).sort().reverse();
        
        if (document.getElementById('news-list')) {
            renderToday(dates, data);
        }
        if (document.getElementById('archive-list')) {
            renderArchive(dates, data);
        }
    } catch (e) {
        const containers = ['news-list', 'archive-list'];
        containers.forEach(id => {
            const el = document.getElementById(id);
            if (el) el.innerHTML = '<div class="loading">No news yet — check back tomorrow morning!</div>';
        });
    }
}

function renderToday(dates, data) {
    const container = document.getElementById('news-list');
    const today = dates[0];
    
    if (!today) {
        container.innerHTML = '<div class="loading">No news yet — check back tomorrow morning!</div>';
        return;
    }
    
    document.getElementById('current-date').textContent = today;
    
    const items = data[today];
    if (!items || items.length === 0) {
        container.innerHTML = '<div class="loading">No news for today yet.</div>';
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

function renderArchive(dates, data) {
    const container = document.getElementById('archive-list');
    
    if (dates.length === 0) {
        container.innerHTML = '<div class="loading">No archives yet.</div>';
        return;
    }
    
    container.innerHTML = dates.map(date => {
        const count = data[date] ? data[date].length : 0;
        return `
            <div class="archive-item">
                <a href="/news/${date}.html">${date}</a>
                <span class="archive-count">${count} stories</span>
            </div>
        `;
    }).join('');
}

// Generate static daily page content (for server-rendered pages)
function renderDailyPage(items, date) {
    const rankEmojis = ['🥇', '🥈', '🥉', '4️⃣', '5️⃣'];
    return items.map((item, i) => `
        <div class="news-card">
            <div class="news-rank">${i + 1}</div>
            <h2>${rankEmojis[i] || ''} ${item.title}</h2>
            <div class="news-source">${item.source || 'Unknown source'}</div>
            <div class="news-summary">${item.summary}</div>
            <a class="news-link" href="${item.url}" target="_blank" rel="noopener">Read full article →</a>
        </div>
    `).join('');
}

loadNews();
