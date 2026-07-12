(function () {
  const menuToggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.site-menu');
  const headerLinks = Array.from(document.querySelectorAll('.site-menu a[href^="#"]'));
  const backToTop = document.querySelector('.back-to-top');
  const toast = document.querySelector('.toast');
  const form = document.querySelector('#leadForm');

  const menuSections = ['#inicio', '#sobre', '#recursos', '#indicacao', '#contato'];

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    window.clearTimeout(showToast.timer);
    showToast.timer = window.setTimeout(() => toast.classList.remove('show'), 4200);
  }

  function closeMobileMenu() {
    if (menu && menuToggle) {
      menu.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menu');
    }
  }

  function scrollToTarget(hash) {
    const target = document.querySelector(hash);
    const header = document.querySelector('.site-header');
    if (!target) return false;

    const headerHeight = header ? header.offsetHeight : 0;
    const extraGap = 16;
    const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - extraGap;

    window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
    history.pushState(null, '', hash);
    updateActiveLink(hash);
    return true;
  }

  function clearMenuState() {
    document.querySelectorAll('.site-menu > a[href^="#"]').forEach((link) => link.classList.remove('active'));
  }

  function setActiveMenu(current) {
    clearMenuState();
    if (!menuSections.includes(current)) return;

    const topLink = document.querySelector(`.site-menu > a[href="${current}"]`);
    if (topLink) topLink.classList.add('active');
  }

  function getCurrentSectionByPosition() {
    const header = document.querySelector('.site-header');
    const headerHeight = header ? header.offsetHeight : 0;
    const probeY = headerHeight + 56;

    const sections = menuSections
      .map((id) => ({ id, element: document.querySelector(id) }))
      .filter((item) => item.element);

    let current = '#inicio';

    sections.forEach((item) => {
      const rect = item.element.getBoundingClientRect();
      if (rect.top <= probeY) current = item.id;
    });

    return current;
  }

  function updateActiveLink(forcedHash) {
    const current = forcedHash || getCurrentSectionByPosition();
    setActiveMenu(current);

    if (backToTop) backToTop.classList.toggle('visible', window.scrollY > 560);
  }

  if (menuToggle && menu) {
    menuToggle.addEventListener('click', () => {
      const isOpen = menu.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(isOpen));
      menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });
  }

  headerLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (hash && hash.startsWith('#')) {
        event.preventDefault();
        scrollToTarget(hash);
      }
      closeMobileMenu();
    });
  });

  document.querySelectorAll('a[href^="#"]:not(.site-menu a)').forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (hash && hash.length > 1 && document.querySelector(hash)) {
        event.preventDefault();
        scrollToTarget(hash);
      }
    });
  });

  window.addEventListener('scroll', () => updateActiveLink(), { passive: true });
  window.addEventListener('resize', () => {
    if (window.innerWidth > 940) closeMobileMenu();
    updateActiveLink();
  });
  window.addEventListener('hashchange', () => updateActiveLink(window.location.hash || '#inicio'));
  updateActiveLink(window.location.hash || '#inicio');

  if (backToTop) {
    backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  const revealItems = Array.from(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  document.querySelectorAll('[data-subject]').forEach((button) => {
    button.addEventListener('click', () => {
      const subject = button.getAttribute('data-subject');
      const select = document.querySelector('select[name="assunto"]');
      if (select && subject) select.value = subject;
    });
  });

  if (form) {
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const fields = Array.from(form.querySelectorAll('input[required], textarea[required], select[required]'));
      let valid = true;

      fields.forEach((field) => {
        const isInvalid = !field.value.trim() || (field.type === 'email' && !field.checkValidity());
        field.classList.toggle('field-error', isInvalid);
        if (isInvalid) valid = false;
      });

      if (!valid) {
        showToast('Confira os campos obrigatórios antes de enviar.');
        return;
      }

      const data = new FormData(form);
      const nome = data.get('nome') || '';
      const email = data.get('email') || '';
      const telefone = data.get('telefone') || '';
      const loterica = data.get('loterica') || '';
      const assunto = data.get('assunto') || 'Solicitar Demonstração';
      const mensagem = data.get('mensagem') || '';
      const body = [
        `Nome: ${nome}`,
        `E-mail: ${email}`,
        `Telefone / WhatsApp: ${telefone}`,
        `Nome da lotérica: ${loterica}`,
        '',
        'Mensagem:',
        mensagem || 'Gostaria de receber mais informações sobre o SGCL.'
      ].join('\n');

      const mailto = `mailto:sgclloterica@sgcl.com.br?subject=${encodeURIComponent(String(assunto))}&body=${encodeURIComponent(body)}`;
      window.location.href = mailto;
      showToast('Abrindo seu aplicativo de e-mail para enviar a mensagem.');
    });

    form.querySelectorAll('input, textarea, select').forEach((field) => {
      field.addEventListener('input', () => field.classList.remove('field-error'));
    });
  }
})();
