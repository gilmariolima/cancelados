// ==UserScript==
// @name         SmartBus - Mostrar somente status cancelado
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Oculta linhas da tabela que não possuem status Cancelado
// @author       Gilvan
// @match        *://*.smarttravelit.com/*
// @match        *://prod-guanabara-frontoffice-smartbus.smarttravelit.com/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
  'use strict';

  function normalizarTexto(txt) {
    return (txt || '')
      .replace(/\s+/g, ' ')
      .trim()
      .toUpperCase();
  }

  function encontrarIndiceColunaStatus(tabela) {
    const ths = tabela.querySelectorAll('thead th');

    for (let i = 0; i < ths.length; i++) {
      const texto = normalizarTexto(ths[i].innerText || ths[i].textContent);

      if (texto === 'STATUS' || texto.includes('STATUS')) {
        return i;
      }
    }

    return -1;
  }

  function filtrarSomenteCancelado() {
    const wrappers = document.querySelectorAll('.dataTables_wrapper.no-footer');

    wrappers.forEach(wrapper => {
      const tabela = wrapper.querySelector('table');
      if (!tabela) return;

      const indiceStatus = encontrarIndiceColunaStatus(tabela);
      if (indiceStatus === -1) return;

      const linhas = tabela.querySelectorAll('tbody tr');

      linhas.forEach(linha => {
        const colunas = linha.querySelectorAll('td');

        if (!colunas[indiceStatus]) return;

        const status = normalizarTexto(colunas[indiceStatus].innerText || colunas[indiceStatus].textContent);

        if (status.includes('CANCELADO')) {
          linha.style.display = '';
        } else {
          linha.style.display = 'none';
        }
      });
    });
  }

  function iniciar() {
    filtrarSomenteCancelado();

    const observer = new MutationObserver(() => {
      filtrarSomenteCancelado();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    setInterval(filtrarSomenteCancelado, 1000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }

})();
