(async function(){
    try {
        const res = await fetch('../partials/sidebar.html');
        if (!res.ok) throw new Error('Failed to fetch sidebar partial');
        const html = await res.text();
        const container = document.getElementById('sidebar-container');
        if (container) {
            container.innerHTML = html;
            // dispatch event so page can initialize behavior that depends on sidebar
            document.dispatchEvent(new Event('sidebarLoaded'));
        }
    } catch (err) {
        console.error('loadSidebar error:', err);
    }
})();