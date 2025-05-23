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

// ==== Cookie Consent & Analytics Loader ====
(function(){
  const banner = document.getElementById('cookie-banner');
  const btnAccept = document.getElementById('cookie-accept');
  const btnDecline = document.getElementById('cookie-decline');
  const STORAGE_KEY = 'cookie_consent';

  // exibe banner se ainda não decidido
  const consent = localStorage.getItem(STORAGE_KEY);
  if (!consent) {
    banner.style.display = 'block';
  } else if (consent === 'accepted') {
    loadAnalytics();
  }

  btnAccept.addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'accepted');
    banner.style.display = 'none';
    loadAnalytics();
  });

  btnDecline.addEventListener('click', () => {
    localStorage.setItem(STORAGE_KEY, 'declined');
    banner.style.display = 'none';
  });

  function loadAnalytics(){
    // substitua G-XXXXXXXXXX pelo seu Measurement ID do GA4:
    const GA_ID = 'G-XXXXXXXXXX';
    // insere o script do Google Analytics
    const tag1 = document.createElement('script');
    tag1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
    tag1.async = true;
    document.head.appendChild(tag1);

    const tag2 = document.createElement('script');
    tag2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_ID}');
    `;
    document.head.appendChild(tag2);
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  const hamb = document.querySelector('.hamburger');
  const menu = document.querySelector('.menu-list');
  const dropdowns = document.querySelectorAll('.menu-dropdown');

  hamb.addEventListener('click', () => {
    menu.classList.toggle('open');
    hamb.classList.toggle('open');
  });

  document.addEventListener('click', e => {
    if (!menu.contains(e.target) && !hamb.contains(e.target)) {
      menu.classList.remove('open');
      hamb.classList.remove('open');
      dropdowns.forEach(li => li.classList.remove('open'));
    }
  });

  dropdowns.forEach(li => {
    const a = li.querySelector('a');
    a.addEventListener('click', e => {
      e.preventDefault();
      dropdowns.forEach(other => {
        if (other !== li) other.classList.remove('open');
      });
      li.classList.toggle('open');
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const tbody     = document.getElementById('tabela-legislacao');
  const rows      = Array.from(tbody.querySelectorAll('tr'));
  const infoEl    = document.getElementById('paginationInfo');
  const controls  = document.getElementById('paginationControls');
  const pageSize  = 25;
  let currentPage = 1;
  const total     = rows.length;
  const pages     = Math.ceil(total / pageSize);

  function render(page) {
    currentPage = page;
    const start = (page - 1) * pageSize;
    const end   = Math.min(start + pageSize, total);

    // mostra só as linhas da página
    rows.forEach((tr, i) => {
      tr.style.display = i >= start && i < end ? '' : 'none';
    });

    // sumário
    infoEl.textContent = `Mostrando de ${start + 1} até ${end} de ${total} registros`;

    // controles
    controls.innerHTML = '';
    // anterior
    const prev = document.createElement('button');
    prev.textContent = 'Anterior';
    prev.disabled    = page === 1;
    prev.addEventListener('click', () => render(page - 1));
    controls.appendChild(prev);

    // números de página
    for (let p = 1; p <= pages; p++) {
      const span = document.createElement('span');
      span.textContent = p;
      span.className   = 'page-number' + (p === page ? ' active' : '');
      span.addEventListener('click', () => render(p));
      controls.appendChild(span);
    }

    // próximo
    const next = document.createElement('button');
    next.textContent = 'Próximo';
    next.disabled    = page === pages;
    next.addEventListener('click', () => render(page + 1));
    controls.appendChild(next);
  }

  // inicia
  if (total > pageSize) {
    render(1);
  } else {
    infoEl.textContent = `Mostrando de 1 até ${total} de ${total} registros`;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // só rodar em mobile
  if (window.innerWidth > 767) return;

  const tbody = document.getElementById('tabela-legislacao');
  const rows  = Array.from(tbody.querySelectorAll('tr'));

  rows.forEach(row => {
    // pega o conteúdo existente de Descrição e Visualizar
    const descCell = row.querySelector('td:nth-child(5)');
    const vizCell  = row.querySelector('td:nth-child(6)');
    if (!descCell || !vizCell) return;

    const descHtml = descCell.innerHTML;
    const vizHtml  = vizCell.innerHTML;

    // remove as colunas originais
    descCell.remove();
    vizCell.remove();

    // cria a célula do toggle
    const toggleCell = document.createElement('td');
    toggleCell.className = 'toggle-col';
    toggleCell.innerHTML = '<button class="toggle-btn">+</button>';
    row.insertBefore(toggleCell, row.firstChild);

    // cria a linha de detalhe
    const detailRow = document.createElement('tr');
    detailRow.className = 'detail-row';
    detailRow.innerHTML = `
      <td colspan="5" class="detail-cell">
        <div><strong>Descrição:</strong> ${descHtml}</div>
        <div><strong>Visualizar:</strong> ${vizHtml}</div>
      </td>
    `;
    row.parentNode.insertBefore(detailRow, row.nextSibling);

    // adiciona o evento de abrir/fechar
    const btn = toggleCell.querySelector('.toggle-btn');
    btn.addEventListener('click', () => {
      const isOpen = detailRow.style.display === 'table-row';
      detailRow.style.display = isOpen ? 'none' : 'table-row';
      btn.textContent = isOpen ? '+' : '−';
    });
  });
});

// Função genérica para transformar uma tabela em accordion mobile
function initMobileTable(tableTbodyId, mobileDivId) {
  const tbody     = document.getElementById(tableTbodyId);
  const mobileDiv = document.getElementById(mobileDivId);
  if (!tbody || !mobileDiv) return;

  // Cabeçalho móvel fixo (Ano | Núm. | Tipo)
  const header = document.createElement('div');
  header.className = 'legis-header labels';
  header.innerHTML = `
    <div class="info">
      <span>Ano</span>
      <span>Núm.</span>
      <span>Tipo</span>
    </div>
  `;
  mobileDiv.appendChild(header);

  // Converte cada linha
  Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
    const [tdAno, tdNum, tdTipo, tdDesc, tdView] = Array.from(tr.children);
    // extrai conteúdos
    const ano     = tdAno.textContent.trim();
    const num     = tdNum.textContent.trim();
    const tipo    = tdTipo.textContent.trim();
    const desc    = tdDesc.textContent.trim();
    const linkEl  = tdView.querySelector('a');
    const href    = linkEl ? linkEl.href : '#';
    const viewTxt = linkEl ? linkEl.textContent.trim() : 'Visualizar';

    // cria card mobile
    const item = document.createElement('div');
    item.className = 'legis-item';
    item.innerHTML = `
      <div class="legis-header">
        <div class="info">
          <span>${ano}</span>
          <span>${num}</span>
          <span>${tipo}</span>
        </div>
        <button type="button" class="toggle-btn">+</button>
      </div>
      <div class="legis-detail">
        <div class="desc"><strong>Descrição:</strong> ${desc}</div>
        <div class="view-link"><strong>Visualizar:</strong> <a href="${href}" target="_blank">${viewTxt}</a></div>
      </div>
    `;

    // toggle
    const btn    = item.querySelector('.toggle-btn');
    const detail = item.querySelector('.legis-detail');
    btn.addEventListener('click', () => {
      const open = detail.style.display === 'block';
      detail.style.display = open ? 'none' : 'block';
      btn.textContent      = open ? '+' : '−';
    });

    mobileDiv.appendChild(item);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.innerWidth > 767) return;

  initMobileTable('tabela-legislacao',    'mobileLegis');
  initMobileTable('tabela-atas',          'mobileAtas');
  initMobileTable('tabela-contratos',     'mobileContratos');
  initMobileTable('tabela-investimentos', 'mobileInvest');
});

document.addEventListener('DOMContentLoaded', () => {
  // --- Só em mobile (≤767px) ---
  if (window.innerWidth > 767) {
    console.log('[Avaliação] largura > 767px, não inicializo o accordion.');
    return;
  }
  console.log('[Avaliação] iniciando accordion mobile…');

  const tbody     = document.getElementById('tabela-avaliacao');
  const mobileDiv = document.getElementById('mobileAval');
  console.log('[Avaliação] tbody:', tbody, 'mobileDiv:', mobileDiv);

  if (!tbody || !mobileDiv) {
    console.warn('[Avaliação] Não encontrei #tabela-avaliacao ou #mobileAval no DOM.');
    return;
  }

  // 1) Cabeçalho fixo com Ano | Descrição | Visualizar
  const header = document.createElement('div');
  header.className = 'legis-header labels';
  header.innerHTML = `
    <div class="info">
      <span>Ano</span>
      <span>Descrição</span>
      <span>Visualizar</span>
    </div>
  `;
  mobileDiv.appendChild(header);

  // 2) Monta um card para cada linha <tr>
  Array.from(tbody.querySelectorAll('tr')).forEach((tr, idx) => {
    const [tdAno, tdDesc, tdView] = Array.from(tr.children);
    const ano   = tdAno?.textContent.trim()   || '';
    const desc  = tdDesc?.textContent.trim()  || '';
    const link  = tdView?.querySelector('a');
    const href  = link?.href  || '#';
    const txt   = link?.textContent.trim() || 'Visualizar';

    console.log(`[Avaliação][linha ${idx}] ano=${ano}, desc="${desc.slice(0,20)}…"`);

    const item = document.createElement('div');
    item.className = 'legis-item';
    item.innerHTML = `
      <div class="legis-header">
        <div class="info">
          <span>${ano}</span>
          <span>${desc.length > 25 ? desc.slice(0,25) + '…' : desc}</span>
        </div>
        <button type="button" class="toggle-btn">+</button>
      </div>
      <div class="legis-detail">
        <div class="desc"><strong>Descrição:</strong> ${desc}</div>
        <div class="view-link"><strong>Visualizar:</strong>
          <a href="${href}" target="_blank">${txt}</a>
        </div>
      </div>
    `;

    const btn    = item.querySelector('.toggle-btn');
    const detail = item.querySelector('.legis-detail');
    btn.addEventListener('click', () => {
      const open = detail.style.display === 'block';
      detail.style.display  = open ? 'none' : 'block';
      btn.textContent       = open ? '+'  : '−';
    });

    mobileDiv.appendChild(item);
  });

  console.log('[Avaliação] accordion mobile criado com sucesso.');
});
