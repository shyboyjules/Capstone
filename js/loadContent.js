document.addEventListener('sidebarLoaded', () => {
    const container = document.getElementById('main-content-container');
    const sidebar = document.getElementById('sidebar');
    if (!container || !sidebar) return;

    // delegate clicks on nav items having data-partial
    sidebar.addEventListener('click', (e) => {
        const a = e.target.closest('[data-partial]');
        if (!a) return;
        e.preventDefault();
        const partialPath = a.getAttribute('data-partial');
        if (!partialPath) return;

        // fetch and insert
        fetch(partialPath).then(res => {
            if (!res.ok) throw new Error('Failed to fetch partial');
            return res.text();
        }).then(html => {
            container.innerHTML = html;
            // mark the inserted content section as active so CSS shows it
            const insertedSection = container.querySelector('.content-section');
            if (insertedSection) {
                insertedSection.classList.add('active');
            }
            if (window.afterContentLoad) {
                try { window.afterContentLoad(); } catch(e) { console.error(e); }
            }
            // update active nav state
            sidebar.querySelectorAll('.nav-item').forEach(it => it.classList.remove('active'));
            a.classList.add('active');

            // re-run some UI setup that depends on content existing
            if (window.updateDashboard) window.updateDashboard();
            if (window.renderScores) window.renderScores();
            if (window.updateLeaderboard) window.updateLeaderboard();

            // re-bind modal buttons and other event listeners if needed by initializeApp's setup
        }).catch(err => console.error('loadContent error:', err));
    });

    // Load the initial active partial (or default to the first nav item)
    (function loadInitial() {
        const active = sidebar.querySelector('.nav-item.active') || sidebar.querySelector('.nav-item');
        if (!active) return;
        const partialPath = active.getAttribute('data-partial');
        if (!partialPath) return;

        fetch(partialPath).then(res => {
            if (!res.ok) throw new Error('Failed to fetch initial partial');
            return res.text();
        }).then(html => {
            container.innerHTML = html;
            // ensure the inserted content is visible
            const insertedSection = container.querySelector('.content-section');
            if (insertedSection) insertedSection.classList.add('active');
            if (window.afterContentLoad) {
                try { window.afterContentLoad(); } catch(e) { console.error(e); }
            }
            // ensure active state
            sidebar.querySelectorAll('.nav-item').forEach(it => it.classList.remove('active'));
            active.classList.add('active');

            if (window.updateDashboard) window.updateDashboard();
            if (window.renderScores) window.renderScores();
            if (window.updateLeaderboard) window.updateLeaderboard();
        }).catch(err => console.error('loadContent initial load error:', err));
    })();
});

// If the sidebar is already present (loaded inline), start binding immediately
if (document.getElementById('sidebar')) {
    document.dispatchEvent(new Event('sidebarLoaded'));
}
