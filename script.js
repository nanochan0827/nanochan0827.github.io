(() => {
  const menu = document.querySelector('.side-menu');
  const toggle = document.querySelector('.menu-toggle');
  const closeMenu = () => {
    menu?.classList.remove('is-open');
    toggle?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
    toggle?.setAttribute('aria-label', 'メニューを開く');
  };

  toggle?.addEventListener('click', () => {
    const open = !menu?.classList.contains('is-open');
    menu?.classList.toggle('is-open', open);
    toggle.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  });
  document.addEventListener('pointerdown', (event) => {
    if (!menu?.classList.contains('is-open')) return;
    if (menu.contains(event.target) || toggle?.contains(event.target)) return;
    closeMenu();
  });
  menu?.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', closeMenu));

  const modal = document.querySelector('#rohto-modal');
  const modalOpen = document.querySelector('[data-modal-open="rohto-modal"]');
  const modalClose = modal?.querySelector('[data-modal-close]');
  const closeModal = () => {
    if (!modal || modal.hidden) return;
    modal.hidden = true;
    document.body.style.overflow = '';
    modalOpen?.focus();
  };
  modalOpen?.addEventListener('click', () => {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose?.focus();
  });
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('pointerdown', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeModal();
  });

  const workModal = document.querySelector('#work-modal');
  const workFrame = workModal?.querySelector('.work-modal__frame');
  const workClose = workModal?.querySelector('[data-work-modal-close]');
  const workDialog = workModal?.querySelector('.work-modal__dialog');
  let activeWorkCard = null;
  const resizeWorkDialog = () => {
    if (!workFrame || !workDialog || workModal?.hidden) return;
    try {
      const page = workFrame.contentDocument?.querySelector('.page');
      if (!page) return;
      const verticalMargin = window.innerWidth <= 1150 ? 32 : 80;
      workDialog.style.height = `${Math.min(Math.ceil(page.scrollHeight), window.innerHeight - verticalMargin)}px`;
    } catch (_) {}
  };
  const closeWorkModal = () => {
    if (!workModal || workModal.hidden) return;
    workModal.hidden = true;
    document.body.style.overflow = '';
    if (workFrame) workFrame.src = 'about:blank';
    activeWorkCard?.focus();
    activeWorkCard = null;
  };
  document.querySelectorAll('[data-work-detail]').forEach((card) => {
    card.addEventListener('click', (event) => {
      if (!workModal || !workFrame) return;
      event.preventDefault();
      activeWorkCard = card;
      workFrame.src = card.href;
      workModal.hidden = false;
      document.body.style.overflow = 'hidden';
      workClose?.focus();
    });
  });
  workClose?.addEventListener('click', closeWorkModal);
  workFrame?.addEventListener('load', resizeWorkDialog);
  window.addEventListener('resize', resizeWorkDialog);
  workModal?.addEventListener('pointerdown', (event) => {
    if (event.target === workModal) closeWorkModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeWorkModal();
  });

  const links = [...document.querySelectorAll('.side-menu nav a')];
  const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      const active = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!active) return;
      links.forEach((link) => link.classList.toggle('is-current', link.getAttribute('href') === `#${active.target.id}`));
    }, { rootMargin: '-15% 0px -65%', threshold: [0, .15, .4] });
    sections.forEach((section) => observer.observe(section));
  }
})();
