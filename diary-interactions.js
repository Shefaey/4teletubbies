/* 4teletubbies Diary interactions — vanilla JS, no framework required */
(() => {
  const header = document.querySelector('header');
  const nav = header?.querySelector('nav');
  if (!header || !nav) return;

  // Mobile navigation
  const menuButton = document.createElement('button');
  menuButton.className = 'menu-toggle';
  menuButton.type = 'button';
  menuButton.setAttribute('aria-label', 'Buka navigasi');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.innerHTML = '<span></span><span></span><span></span>';
  header.insertBefore(menuButton, nav);
  menuButton.addEventListener('click', () => {
    const opened = nav.classList.toggle('is-open');
    menuButton.classList.toggle('is-active', opened);
    menuButton.setAttribute('aria-expanded', String(opened));
    menuButton.setAttribute('aria-label', opened ? 'Tutup navigasi' : 'Buka navigasi');
  });
  nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    nav.classList.remove('is-open');
    menuButton.classList.remove('is-active');
    menuButton.setAttribute('aria-expanded', 'false');
  }));

  // Theme switch, remembered on this device
  const themeButton = document.createElement('button');
  themeButton.className = 'theme-toggle';
  themeButton.type = 'button';
  themeButton.innerHTML = '<span aria-hidden="true">🌙</span><span class="theme-label">Dark mode</span>';
  themeButton.setAttribute('aria-label', 'Ganti tema');
  header.appendChild(themeButton);
  const applyTheme = dark => {
    document.body.classList.toggle('dark-theme', dark);
    themeButton.innerHTML = dark
      ? '<span aria-hidden="true">☀️</span><span class="theme-label">Light mode</span>'
      : '<span aria-hidden="true">🌙</span><span class="theme-label">Dark mode</span>';
    try { localStorage.setItem('4t-theme', dark ? 'dark' : 'light'); } catch (_) {}
  };
  let savedTheme = 'light';
  try { savedTheme = localStorage.getItem('4t-theme') || 'light'; } catch (_) {}
  applyTheme(savedTheme === 'dark');
  themeButton.addEventListener('click', () => applyTheme(!document.body.classList.contains('dark-theme')));

  // Reveal content as it enters the viewport
  const revealTargets = document.querySelectorAll('.section, .teletubby, .card, .blog-post, .profile-card');
  revealTargets.forEach(el => el.classList.add('reveal'));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    }), { threshold: 0.12 });
    revealTargets.forEach(el => observer.observe(el));
  } else revealTargets.forEach(el => el.classList.add('is-visible'));

  // Image lightbox (images inside profile-navigation links remain clickable links)
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', 'Pratinjau foto');
  lightbox.innerHTML = '<button class="lightbox-close" type="button" aria-label="Tutup foto">×</button><img alt="Pratinjau foto">';
  document.body.appendChild(lightbox);
  const lightboxImage = lightbox.querySelector('img');
  const closeLightbox = () => { lightbox.classList.remove('is-open'); document.body.classList.remove('no-scroll'); };
  document.querySelectorAll('main img').forEach(img => {
    if (img.closest('a')) return;
    img.classList.add('zoomable');
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'Perbesar foto');
    const open = () => {
      lightboxImage.src = img.currentSrc || img.src;
      lightboxImage.alt = img.alt || 'Foto kenangan';
      lightbox.classList.add('is-open');
      document.body.classList.add('no-scroll');
    };
    img.addEventListener('click', open);
    img.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
  });
  lightbox.addEventListener('click', e => { if (e.target === lightbox || e.target.closest('.lightbox-close')) closeLightbox(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeLightbox(); });

  // Back-to-top button
  const topButton = document.createElement('button');
  topButton.className = 'back-to-top';
  topButton.type = 'button';
  topButton.textContent = '↑';
  topButton.setAttribute('aria-label', 'Kembali ke atas');
  document.body.appendChild(topButton);
  const updateTopButton = () => topButton.classList.toggle('show', window.scrollY > 420);
  window.addEventListener('scroll', updateTopButton, { passive: true });
  updateTopButton();
  topButton.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
})();
