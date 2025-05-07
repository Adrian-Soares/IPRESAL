// scripts.js

document.addEventListener('DOMContentLoaded', () => {
    // 1) Menu dropdown: exibe e oculta o submenu ao passar o mouse
    document.querySelectorAll('.menu-dropdown').forEach(item => {
      const submenu = item.querySelector('.submenu');
      item.addEventListener('mouseenter', () => {
        submenu.style.display = 'block';
      });
      item.addEventListener('mouseleave', () => {
        submenu.style.display = 'none';
      });
    });
  
    // 2) Busca na navbar: redireciona para search.html?q=…
    const btn = document.getElementById('navSearchBtn');
    const inp = document.getElementById('navSearch');
    if (btn && inp) {
      btn.addEventListener('click', () => {
        const q = inp.value.trim();
        if (q) {
          window.location.href = 'search.html?q=' + encodeURIComponent(q);
        }
      });
      inp.addEventListener('keypress', e => {
        if (e.key === 'Enter') btn.click();
      });
    }
  
    // 3) Filtro genérico de tabelas:
    //    - detecta todos os <input id="filtro">
    //    - procura o <tbody> na mesma <section> e filtra as linhas
    document.querySelectorAll('input#filtro').forEach(filtro => {
      // encontra o container (section) mais próximo, ou o documento inteiro
      const container = filtro.closest('section') || document;
      const tbody = container.querySelector('tbody');
      if (!tbody) return;
  
      // ao digitar (evento input), filtra as linhas pela presença do termo
      filtro.addEventListener('input', () => {
        const termo = filtro.value.trim().toLowerCase();
        tbody.querySelectorAll('tr').forEach(row => {
          row.style.display = row.textContent.toLowerCase().includes(termo)
            ? ''
            : 'none';
        });
      });
    });
  });
  