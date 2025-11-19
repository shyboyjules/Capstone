function bindSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (!sidebar) return;

  const navItems = sidebar.querySelectorAll('.nav-item');

  navItems.forEach(item => {
    // avoid attaching duplicate listeners
    if (item.__bound) return;
    item.__bound = true;

    item.addEventListener('click', (e) => {
      e.preventDefault();
      // support admin-style nav (data-page) by dispatching an event
      const pageName = item.dataset.page;
      if (pageName) {
        // mark active immediately
        navItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        // notify the app
        window.dispatchEvent(new CustomEvent('sidebar:navigate', { detail: { page: pageName } }));
        // if there's a main-content area, scroll to top
        const main = document.querySelector('.main-content') || document.querySelector('.dashboard-container');
        if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
      }

      const targetSelector = item.dataset.target;
      if (targetSelector) {
        const target = document.querySelector(targetSelector);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }

      navItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');

      // close mobile sidebar if open
      if (sidebar.classList.contains('mobile-open')) sidebar.classList.remove('mobile-open');
      const overlay = document.querySelector('.sidebar-overlay');
      if (overlay) overlay.classList.remove('active');
    });

    // keyboard accessibility
    item.tabIndex = 0;
    item.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        item.click();
      }
    });
  });

  // Build section map for IntersectionObserver
  const sectionMap = [];
  navItems.forEach(item => {
    // only build map for items that use data-target (content sections)
    const sel = item.dataset.target;
    if (!sel) return;
    const el = document.querySelector(sel);
    if (el) sectionMap.push({ el, item });
  });

  if (sectionMap.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          sectionMap.forEach(m => m.item.classList.remove('active'));
          const found = sectionMap.find(m => m.el === entry.target);
          if (found) found.item.classList.add('active');
        }
      });
    }, { threshold: 0.5 });

    sectionMap.forEach(m => io.observe(m.el));
  }

  // Mobile toggle and overlay behavior (optional)
  const toggle = document.querySelector('.sidebar-toggle');
  const overlay = document.querySelector('.sidebar-overlay');
  if (toggle) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('mobile-open');
      if (overlay) overlay.classList.toggle('active');
    });
  }
  if (overlay) {
    overlay.addEventListener('click', () => {
      sidebar.classList.remove('mobile-open');
      overlay.classList.remove('active');
    });
  }

  // Logout button
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', async () => {
      try {
        if (window.firebase && typeof window.firebase.auth === 'function') {
          await window.firebase.auth().signOut();
        } else if (window.firebase && window.firebase.auth && typeof window.firebase.auth().signOut === 'function') {
          await window.firebase.auth().signOut();
        } else if (window.auth && typeof window.auth.signOut === 'function') {
          await window.auth.signOut();
        } else if (typeof window.signOut === 'function') {
          await window.signOut();
        }
      } catch (err) {
        console.warn('Logout failed (continuing to redirect):', err);
      } finally {
        // try to be robust about path from different folders
        const candidates = ['../login and register/login.html', './login and register/login.html', '/login and register/login.html', '../login and register/login.html'];
        for (const c of candidates) {
          try { window.location.href = c; break; } catch (e) { /* try next */ }
        }
      }
    });
  }
}

// initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => bindSidebar());
// allow re-binding after dynamic injection
window.addEventListener('sidebar:injected', () => bindSidebar());
