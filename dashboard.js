async function loadDashboard() {
    const recentList = document.getElementById('recent-list');
    
    try {
        const [aiResp, hkResp] = await Promise.all([
            fetch('data/news.json'),
            fetch('data-hk/news-hk.json')
        ]);
        
        const aiData = await aiResp.json();
        const hkData = await hkResp.json();
        
        const aiDates = Object.keys(aiData).sort().reverse();
        const hkDates = Object.keys(hkData).sort().reverse();
        
        const metaAI = document.getElementById('meta-ai');
        const metaHK = document.getElementById('meta-hk');
        const cardAI = document.getElementById('card-ai');
        const cardHK = document.getElementById('card-hk');
        
        if (aiDates.length > 0) {
            metaAI.textContent = '📅 ' + aiDates[0];
            cardAI.href = 'ai-it/';
        } else {
            metaAI.textContent = 'No data yet';
        }
        
        if (hkDates.length > 0) {
            metaHK.textContent = '📅 ' + hkDates[0];
        } else {
            metaHK.textContent = 'No data yet';
        }
        
        const updates = [];
        
        aiDates.forEach(date => {
            const items = aiData[date];
            if (items && items.length > 0) {
                updates.push({
                    date,
                    tag: 'AI & IT',
                    tagClass: 'tag-ai',
                    url: 'ai-it/news-ai/' + date + '.html',
                    label: items[0].title.substring(0, 55) + (items[0].title.length > 55 ? '...' : '') + ' (+' + (items.length - 1) + ' more)'
                });
            }
        });
        
        hkDates.forEach(date => {
            const items = hkData[date];
            if (items && items.length > 0) {
                updates.push({
                    date,
                    tag: '🇭🇰 Hong Kong',
                    tagClass: 'tag-hk',
                    url: 'hk-news/news-hk/' + date + '.html',
                    label: items[0].title.substring(0, 55) + (items[0].title.length > 55 ? '...' : '') + ' (+' + (items.length - 1) + ' more)'
                });
            }
        });
        
        updates.sort((a, b) => b.date.localeCompare(a.date));
        
        if (updates.length === 0) {
            recentList.innerHTML = '<div class="loading">No updates yet.</div>';
            return;
        }
        
        recentList.innerHTML = updates.map(up => `
            <div class="recent-item">
                <a href="${up.url}">${up.label}</a>
                <div style="display:flex;align-items:center;gap:0.5rem;flex-shrink:0;">
                    <span style="color:var(--muted);font-size:0.8rem;">${up.date}</span>
                    <span class="recent-item-tag ${up.tagClass}">${up.tag}</span>
                </div>
            </div>
        `).join('');
        
    } catch (e) {
        recentList.innerHTML = '<div class="loading">Unable to load updates.</div>';
    }
}

loadDashboard();
