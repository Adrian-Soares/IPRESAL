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

// 1) filtro de linhas
const filtro = document.getElementById('filtro');
const tbody  = document.getElementById('tabela-legislacao');
if (filtro && tbody) {
  filtro.addEventListener('input', () => {
    const termo = filtro.value.toLowerCase();
    tbody.querySelectorAll('tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(termo) ? '' : 'none';
    });
  });
}

// 2) paginação desktop
(function() {
  if (!tbody) return;
  const rows     = Array.from(tbody.querySelectorAll('tr'));
  const pageSize = 25;
  const pages    = Math.ceil(rows.length / pageSize);
  const info     = document.getElementById('paginationInfo');
  const controls = document.getElementById('paginationControls');
  
  function render(page) {
    const start = (page - 1) * pageSize;
    const end   = start + pageSize;
    rows.forEach((r,i) => r.style.display = (i>=start && i<end) ? '' : 'none');
    info.textContent = `Mostrando ${start+1}–${Math.min(end, rows.length)} de ${rows.length}`;
    
    controls.innerHTML = '';
    const prev = document.createElement('button');
    prev.textContent = 'Anterior';
    prev.disabled   = page === 1;
    prev.onclick    = () => render(page-1);
    controls.appendChild(prev);
    
    for (let p=1; p<=pages; p++) {
      const span = document.createElement('span');
      span.textContent = p;
      span.className   = 'page-number' + (p === page ? ' active' : '');
      span.onclick     = () => render(p);
      controls.appendChild(span);
    }
    
    const next = document.createElement('button');
    next.textContent = 'Próximo';
    next.disabled   = page === pages;
    next.onclick    = () => render(page+1);
    controls.appendChild(next);
  }
  
  if (rows.length > pageSize) render(1);
})();

// 3) Accordion mobile
function initLegisMobile() {
  if (window.innerWidth > 767) return;
  const mobileDiv = document.getElementById('mobileLegis');
  if (!tbody || !mobileDiv) return;

  Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
    const [tdAno, tdNum, tdTipo, tdDesc, tdView] = tr.children;
    const ano   = tdAno.textContent.trim();
    const num   = tdNum.textContent.trim();
    const tipo  = tdTipo.textContent.trim();
    const desc  = tdDesc.textContent.trim();
    const a     = tdView.querySelector('a');
    const href  = a ? a.href : '#';
    const txt   = a ? a.textContent.trim() : 'Visualizar';

    const item = document.createElement('div');
    item.className = 'legis-item';
    item.innerHTML = `
      <div class="legis-header">
        <div class="info">
          <span>${ano}</span><span>${num}</span><span>${tipo}</span>
        </div>
        <button class="toggle-btn">+</button>
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
      detail.style.display = open ? 'none' : 'block';
      btn.textContent      = open ? '+' : '−';
    });

    mobileDiv.appendChild(item);
  });
}
window.addEventListener('DOMContentLoaded', initLegisMobile);

// Função genérica de accordion mobile
function initMobileTable(tableTbodyId, mobileDivId) {
  const tbody     = document.getElementById(tableTbodyId);
  const mobileDiv = document.getElementById(mobileDivId);
  if (!tbody || !mobileDiv) return;

  // Cabeçalho mínimo: Ano / Núm. / Tipo
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

  // Cria um card para cada <tr>
  Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
    const [tdAno, tdNum, tdTipo, tdView] = Array.from(tr.children);
    const ano  = tdAno?.textContent.trim()  || '';
    const num  = tdNum?.textContent.trim()  || '';
    const tipo = tdTipo?.textContent.trim() || '';
    const link = tdView?.querySelector('a');
    const href = link?.href || '#';
    const txt  = link?.textContent.trim() || 'Visualizar';

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
        <div class="view-link"><strong>Visualizar:</strong> <a href="${href}" target="_blank">${txt}</a></div>
      </div>
    `;

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
  // só roda em mobile e na página de Legislação
  if (window.innerWidth > 767 || 
      !document.body.classList.contains('page-legislacao')) {
    console.log('>>> NÃO é página-legislacao em mobile, abortando accordion.');
    return;
  }
  console.log('>>> Iniciando accordion Legislação em mobile.');

  const tbody     = document.getElementById('tabela-legislacao');
  const mobileDiv = document.getElementById('mobileLegis');
  if (!tbody || !mobileDiv) {
    console.warn('>>> tbody ou mobileLegis não encontrados:', tbody, mobileDiv);
    return;
  }

  // 1) cabeçalho “Ano Num Tipo”
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

  // 2) cada <tr> vira um cartão
  Array.from(tbody.querySelectorAll('tr')).forEach((tr, idx) => {
    const [tdAno, tdNum, tdTipo, tdDesc, tdView] = tr.children;
    const ano   = tdAno?.textContent.trim()   || '';
    const num   = tdNum?.textContent.trim()   || '';
    const tipo  = tdTipo?.textContent.trim()  || '';
    const desc  = tdDesc?.textContent.trim()  || '';
    const a     = tdView.querySelector('a');
    const href  = a?.href  || '#';
    const txt   = a?.textContent.trim() || 'Visualizar';

    console.log(`Linha ${idx}:`, ano, num, tipo);

    const item = document.createElement('div');
    item.className = 'legis-item';
    item.innerHTML = `
      <div class="legis-header">
        <div class="info">
          <span>${ano}</span>
          <span>${num}</span>
          <span>${tipo}</span>
        </div>
        <button class="toggle-btn">+</button>
      </div>
      <div class="legis-detail">
        <div class="desc"><strong>Descrição:</strong> ${desc}</div>
        <div class="view-link">
          <strong>Visualizar:</strong>
          <a href="${href}" target="_blank">${txt}</a>
        </div>
      </div>
    `;
    mobileDiv.appendChild(item);

    // toggle
    const btn    = item.querySelector('.toggle-btn');
    const detail = item.querySelector('.legis-detail');
    btn.addEventListener('click', () => {
      const aberto = detail.style.display === 'block';
      detail.style.display = aberto ? 'none' : 'block';
      btn.textContent      = aberto ? '+' : '−';
    });
  });

  console.log('>>> Accordion Legislação inicializado.');
});

// ===============================
// PORTARIAS – Accordion Mobile
// ===============================
document.addEventListener('DOMContentLoaded', () => {
  // roda só em telas ≤767px e na página Portarias
  if (window.innerWidth > 767) return;
  if (!document.body.classList.contains('page-portarias')) return;

  const tbody     = document.getElementById('tabela-portarias');
  const mobileDiv = document.getElementById('mobilePortarias');
  if (!tbody || !mobileDiv) return;

  // limpa qualquer conteúdo anterior
  mobileDiv.innerHTML = '';

  // para cada linha da tabela, cria um card
  Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
    const [tdAno, tdNum, tdBen, tdVis] = tr.children;
    if (!tdAno || !tdNum || !tdBen) return;

    const ano  = tdAno.textContent.trim();
    const num  = tdNum.textContent.trim();
    const ben  = tdBen.textContent.trim();
    const link = tdVis.querySelector('a');
    const href = link?.href || '#';
    const txt  = link?.textContent.trim() || '';

    // monta o card
    const item = document.createElement('div');
    item.className = 'port-item';
    item.innerHTML = `
      <div class="port-header">
        <div class="info">
          <span>${ano}</span>
          <span>${num}</span>
          <span>${ben}</span>
        </div>
        <button type="button" class="toggle-btn">+</button>
      </div>
      <div class="port-detail">
        <a href="${href}" target="_blank">${txt}</a>
      </div>
    `;
    mobileDiv.appendChild(item);

    // comportamento de abrir/fechar
    const btn    = item.querySelector('.toggle-btn');
    const detail = item.querySelector('.port-detail');
    btn.addEventListener('click', () => {
      const isOpen = detail.style.display === 'block';
      detail.style.display = isOpen ? 'none' : 'block';
      btn.textContent      = isOpen ? '+' : '−';
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // só roda em mobile e na página de CONTRATOS
  if (window.innerWidth > 767) return;
  if (!document.body.classList.contains('page-contratos')) return;

  const table     = document.getElementById('tabela-contratos');
  const tbody     = table.querySelector('tbody') || table;
  const mobileDiv = document.getElementById('mobileContratos');
  if (!tbody || !mobileDiv) return;

  // 1) monta o cabeçalho fixo
  mobileDiv.innerHTML = '';  // limpa
  const header = document.createElement('div');
  header.className = 'labels';
  header.innerHTML = `
    <div class="info">
      <span>Ano</span>
      <span>Núm.</span>
      <span>Descrição</span>
    </div>
  `;
  mobileDiv.appendChild(header);

  // 2) para cada linha, cria um card
  Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
    const [tdAno, tdNum, tdDesc, tdVis] = tr.children;
    if (!tdAno || !tdNum || !tdDesc) return;

    const ano  = tdAno.textContent.trim();
    const num  = tdNum.textContent.trim();
    const desc = tdDesc.textContent.trim();
    const link = tdVis.querySelector('a');
    const href = link?.href || '#';

    const item = document.createElement('div');
    item.className = 'contr-item';
    item.innerHTML = `
      <div class="contr-header">
        <div class="info">
          <span>${ano}</span>
          <span>${num}</span>
          <span>${desc}</span>
        </div>
        <button class="toggle-btn">+</button>
      </div>
      <div class="contr-detail">
        <a href="${href}" target="_blank">Visualizar</a>
      </div>
    `;
    mobileDiv.appendChild(item);

    // toggle do detalhe
    const btn    = item.querySelector('.toggle-btn');
    const detail = item.querySelector('.contr-detail');
    btn.addEventListener('click', () => {
      const aberto = detail.style.display === 'block';
      detail.style.display = aberto ? 'none' : 'block';
      btn.textContent      = aberto ? '+'  : '−';
    });
  });
});

document.addEventListener('DOMContentLoaded', () => {
  // só roda em mobile e na página de CONTRATOS
  if (window.innerWidth > 767) return;
  if (!document.body.classList.contains('page-contratos')) return;

  const table     = document.getElementById('tabela-contratos');
  const tbody     = table.querySelector('tbody') || table;
  const mobileDiv = document.getElementById('mobileContratos');
  if (!tbody || !mobileDiv) return;

  // monta o cabeçalho fixo
  mobileDiv.innerHTML = '';
  const header = document.createElement('div');
  header.className = 'labels';
  header.innerHTML = `
    <div class="info">
      <span>Ano</span>
      <span>Núm.</span>
      <span>Descrição</span>
    </div>
  `;
  mobileDiv.appendChild(header);

  // cria um card para cada linha da tabela
  Array.from(tbody.querySelectorAll('tr')).forEach(tr => {
    const [tdAno, tdNum, tdDesc, tdVis] = tr.children;
    if (!tdAno || !tdNum || !tdDesc) return;

    const ano  = tdAno.textContent.trim();
    const num  = tdNum.textContent.trim();
    const desc = tdDesc.textContent.trim();
    const link = tdVis.querySelector('a');
    const href = link?.href || '#';

    const item = document.createElement('div');
    item.className = 'contr-item';
    item.innerHTML = `
      <div class="contr-header">
        <div class="info">
          <span>${ano}</span>
          <span>${num}</span>
          <span>${desc}</span>
        </div>
        <button class="toggle-btn">+</button>
      </div>
      <div class="contr-detail">
        <a href="${href}" target="_blank">Visualizar</a>
      </div>
    `;
    mobileDiv.appendChild(item);

    // toggle do detalhe
    const btn    = item.querySelector('.toggle-btn');
    const detail = item.querySelector('.contr-detail');
    btn.addEventListener('click', () => {
      const aberto = detail.style.display === 'block';
      detail.style.display = aberto ? 'none' : 'block';
      btn.textContent      = aberto ? '+' : '−';
    });
  });
});
