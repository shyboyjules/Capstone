// Loads /partials/sidebar-teacher.html into #sidebar-container and dispatches 'teacherSidebarLoaded'
function loadTeacherSidebar() {
  const container = document.getElementById('sidebar-container');
  if (!container) return;

  // Try multiple candidate paths so the partial loads whether the page
  // is opened from a server root or from a nested folder (or file://).
  const candidates = [
    '/partials/sidebar-teacher.html',
    'partials/sidebar-teacher.html',
    '../partials/sidebar-teacher.html',
    '../../partials/sidebar-teacher.html'
  ];

  let tried = 0;
  function tryNext() {
    if (tried >= candidates.length) {
      console.error('loadSidebarTeacher: all fetch attempts failed');
      return;
    }
    const url = candidates[tried++];
    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch sidebar partial: ' + res.status + ' (' + url + ')');
        return res.text();
      })
      .then(html => {
        container.innerHTML = html;
        window.dispatchEvent(new Event('teacherSidebarLoaded'));
      })
      .catch(err => {
        // try the next candidate
        console.warn('loadSidebarTeacher warning, fetch failed for', url, err.message);
        tryNext();
      });
  }

  tryNext();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadTeacherSidebar);
} else {
  loadTeacherSidebar();
}
