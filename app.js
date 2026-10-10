/**
 * Catalyst Creative Studio — Interactive Logic
 * Handles theme toggling, work filtering, inquiry scope builder,
 * mobile navigation drawer, and live studio clock.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* --------------------------------------------------------------------------
     1. Theme Toggle (Light / Dark Mode)
     -------------------------------------------------------------------------- */
  const themeToggleBtn = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');
  const htmlRoot = document.documentElement;

  // Determine initial theme
  const savedTheme = localStorage.getItem('catalyst_theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');

  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const activeTheme = htmlRoot.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(activeTheme);
      localStorage.setItem('catalyst_theme', activeTheme);
    });
  }

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    if (!themeIcon) return;

    if (theme === 'dark') {
      // Sun icon for dark mode (click to switch to light)
      themeIcon.innerHTML = `
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      `;
      themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      // Moon icon for light mode (click to switch to dark)
      themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
      themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  /* --------------------------------------------------------------------------
     2. Selected Work Category Filtering
     -------------------------------------------------------------------------- */
  const filterButtons = document.querySelectorAll('.filter-btn');
  const workCards = document.querySelectorAll('.work-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filterVal = btn.getAttribute('data-filter');

      workCards.forEach(card => {
        const categories = card.getAttribute('data-category') || '';
        if (filterVal === 'all' || categories.includes(filterVal)) {
          card.style.display = 'flex';
          card.style.animation = 'fadeInCard 0.3s ease forwards';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });

  /* --------------------------------------------------------------------------
     3. Interactive Scope Helper / Email Inquiry Builder
     -------------------------------------------------------------------------- */
  const serviceOptions = document.querySelectorAll('#service-options .scope-pill-btn');
  const timelineOptions = document.querySelectorAll('#timeline-options .scope-pill-btn');
  const scopeSummary = document.getElementById('scope-summary');
  const scopeLaunchBtn = document.getElementById('scope-launch-btn');

  let selectedService = 'UI/UX & Product Design';
  let selectedTimeline = 'Within 2-4 Weeks';

  serviceOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      serviceOptions.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedService = btn.getAttribute('data-value');
      updateScopeLink();
    });
  });

  timelineOptions.forEach(btn => {
    btn.addEventListener('click', () => {
      timelineOptions.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedTimeline = btn.getAttribute('data-value');
      updateScopeLink();
    });
  });

  function updateScopeLink() {
    if (scopeSummary) {
      scopeSummary.innerHTML = `Inquiry Draft: Looking for <strong>${selectedService}</strong> with an estimated timeline of <strong>${selectedTimeline}</strong>.`;
    }

    if (scopeLaunchBtn) {
      const subject = encodeURIComponent(`Project Inquiry: ${selectedService} — Catalyst Studio`);
      const body = encodeURIComponent(
        `Hi Juliet,\n\nI'm reaching out from the Catalyst Creative Studio website regarding a project inquiry.\n\n` +
        `• Primary Service: ${selectedService}\n` +
        `• Target Timeline: ${selectedTimeline}\n\n` +
        `Brief Overview of the Project:\n[Please describe your product, team, and current stage]\n\n` +
        `Best regards,\n[Your Name]`
      );
      scopeLaunchBtn.href = `mailto:ogunleyejuliet15@gmail.com?subject=${subject}&body=${body}`;
    }
  }

  /* --------------------------------------------------------------------------
     4. Copy Email to Clipboard with Toast Notification
     -------------------------------------------------------------------------- */
  const copyEmailBtn = document.getElementById('copy-email-btn');
  const toastNotice = document.getElementById('toast-notice');
  const studioEmailText = 'ogunleyejuliet15@gmail.com';

  if (copyEmailBtn && toastNotice) {
    copyEmailBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(studioEmailText);
        showToast('Email address copied to clipboard!');
      } catch (err) {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = studioEmailText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Email address copied to clipboard!');
      }
    });
  }

  function showToast(message) {
    const toastMsg = document.getElementById('toast-msg');
    if (toastMsg) toastMsg.textContent = message;

    toastNotice.classList.add('show');
    setTimeout(() => {
      toastNotice.classList.remove('show');
    }, 3200);
  }

  /* --------------------------------------------------------------------------
     5. Mobile Menu Drawer
     -------------------------------------------------------------------------- */
  const mobileMenuTrigger = document.getElementById('mobile-menu-trigger');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const mobileDrawer = document.getElementById('mobile-drawer');
  const drawerLinks = document.querySelectorAll('.drawer-link');

  function openDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.add('open');
    mobileDrawer.setAttribute('aria-hidden', 'false');
    mobileMenuTrigger.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    if (!mobileDrawer) return;
    mobileDrawer.classList.remove('open');
    mobileDrawer.setAttribute('aria-hidden', 'true');
    mobileMenuTrigger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (mobileMenuTrigger) mobileMenuTrigger.addEventListener('click', openDrawer);
  if (closeDrawerBtn) closeDrawerBtn.addEventListener('click', closeDrawer);

  if (mobileDrawer) {
    mobileDrawer.addEventListener('click', (e) => {
      if (e.target === mobileDrawer) closeDrawer();
    });
  }

  drawerLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileDrawer && mobileDrawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  /* --------------------------------------------------------------------------
     6. Studio Clock (GMT+1 Local Time)
     -------------------------------------------------------------------------- */
  const studioTimeEl = document.getElementById('studio-time-str');
  const currentYearEl = document.getElementById('current-year');

  if (currentYearEl) {
    currentYearEl.textContent = new Date().getFullYear();
  }

  function updateStudioClock() {
    if (!studioTimeEl) return;
    const now = new Date();
    // Format in GMT+1
    const options = {
      timeZone: 'Europe/London',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    try {
      const timeStr = now.toLocaleTimeString('en-US', options);
      studioTimeEl.textContent = `${timeStr} (GMT+1)`;
    } catch (e) {
      studioTimeEl.textContent = `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')} (GMT+1)`;
    }
  }

  updateStudioClock();
  setInterval(updateStudioClock, 1000);

});
