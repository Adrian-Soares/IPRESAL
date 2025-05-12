document.addEventListener('DOMContentLoaded', () => {
  // ——————————————
  // 1) Menu dropdown (hover)
  // ——————————————
  document.querySelectorAll('.menu-dropdown').forEach(item => {
    const submenu = item.querySelector('.submenu');
    item.addEventListener('mouseenter', () => submenu.style.display = 'block');
    item.addEventListener('mouseleave', () => submenu.style.display = 'none');
  });

  // ——————————————
  // 2) Busca na navbar
  // ——————————————
  const navBtn = document.getElementById('navSearchBtn');
  const navInp = document.getElementById('navSearch');
  if (navBtn && navInp) {
    navBtn.addEventListener('click', () => {
      const q = navInp.value.trim();
      if (q) window.location.href = 'search.html?q=' + encodeURIComponent(q);
    });
    navInp.addEventListener('keypress', e => {
      if (e.key === 'Enter') navBtn.click();
    });
  }

  // ——————————————
  // 3) Filtro genérico de tabelas
  // ——————————————
  document.querySelectorAll('input#filtro').forEach(filtro => {
    const section = filtro.closest('section') || document;
    const tbody   = section.querySelector('tbody');
    if (!tbody) return;

    filtro.addEventListener('input', () => {
      const termo = filtro.value.trim().toLowerCase();
      tbody.querySelectorAll('tr').forEach(row => {
        row.style.display = row.textContent.toLowerCase().includes(termo) ? '' : 'none';
      });
    });
  });

  // ——————————————
  // 4) Widget de Acessibilidade
  // ——————————————
  const widget = document.querySelector('.a11y-widget');
  if (!widget) return;

  const toggleBtn = widget.querySelector('.a11y-toggle');
  const menu      = widget.querySelector('.a11y-menu');
  const body      = document.body;

  // abre/fecha painel
  toggleBtn.addEventListener('click', () => {
    const open = toggleBtn.getAttribute('aria-expanded') === 'true';
    toggleBtn.setAttribute('aria-expanded', String(!open));
    menu.style.display     = open ? 'none' : 'flex';
    menu.setAttribute('aria-hidden', String(open));
  });

  // helper para alternar classes
  function toggleClass(cls) {
    body.classList.toggle(cls);
  }
  function clearAll() {
    ['high-contrast','bw','invert','highlight-links','large-font','small-font','font-regular']
      .forEach(c => body.classList.remove(c));
    body.style.fontSize = '';
  }

  // cada ação
  widget.querySelector('#a11y-contrast')?.addEventListener('click', () => toggleClass('high-contrast'));
  widget.querySelector('#a11y-bw')      ?.addEventListener('click', () => toggleClass('bw'));
  widget.querySelector('#a11y-invert')  ?.addEventListener('click', () => toggleClass('invert'));
  widget.querySelector('#a11y-highlight')?.addEventListener('click', () => toggleClass('highlight-links'));

  // fontes
  const htmlRoot = document.documentElement;
  let baseFont = parseFloat(getComputedStyle(htmlRoot).fontSize) || 16;

  widget.querySelector('#a11y-font-up')?.addEventListener('click', () => {
    clearAll(); // remove small-font if present
    baseFont = Math.min(baseFont + 2, 32);
    htmlRoot.style.fontSize = baseFont + 'px';
  });
  widget.querySelector('#a11y-font-down')?.addEventListener('click', () => {
    clearAll(); // remove large-font if present
    baseFont = Math.max(baseFont - 2, 10);
    htmlRoot.style.fontSize = baseFont + 'px';
  });
  widget.querySelector('#a11y-font-regular')?.addEventListener('click', () => toggleClass('font-regular'));

  // resetar tudo
  widget.querySelector('#a11y-reset')?.addEventListener('click', clearAll);
});
