async function loadNews() {
    try {
        const resp = await fetch('data/news.json');
        const data = await resp.json();
        
        const dates = Object.keys(data).sort().reverse();
        
        if (document.getElementById('archive-list')) {
            renderArchive(dates, data);
        }
    } catch (e) {
        const el = document.getElementById('archive-list');
        if (el) el.innerHTML = '<div class="loading">No archives yet.</div>';
    }
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
                <a href="ai-it/news-ai/${date}.html">${date}</a>
                <span class="archive-count">${count} stories</span>
            </div>
        `;
    }).join('');
}

loadNews();
