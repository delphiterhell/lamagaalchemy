/* =============================================
   LA MAGA ALCHEMY — script.js
   ============================================= */

/* --- Header: cambia stile allo scroll --- */
(function () {
  const header = document.getElementById('header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* --- Hamburger menu mobile --- */
(function () {
  const btn = document.getElementById('hamburger');
  const nav = document.getElementById('nav');
  if (!btn || !nav) return;

  btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', open);
  });

  // Chiude menu al click su un link
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      btn.classList.remove('open');
      btn.setAttribute('aria-expanded', false);
    });
  });
})();

/* --- Reveal on scroll (Intersection Observer) --- */
(function () {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  els.forEach(el => observer.observe(el));
})();

/* --- Tabs collezioni --- */
(function () {
  const tabs = document.querySelectorAll('.tab-btn');
  const groups = document.querySelectorAll('.collezione-group');
  if (!tabs.length) return;

  tabs.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;

      tabs.forEach(t => t.classList.remove('active'));
      groups.forEach(g => g.classList.remove('active'));

      btn.classList.add('active');
      const group = document.querySelector(`.collezione-group[data-group="${target}"]`);
      if (group) group.classList.add('active');
    });
  });
})();

/* --- Lightbox prodotto: apre immagine + descrizione al click --- */
(function () {
  const lightbox = document.getElementById('product-lightbox');
  if (!lightbox) return;

  const media = document.getElementById('lightbox-media');
  const nameEl = document.getElementById('lightbox-name');
  const descEl = document.getElementById('lightbox-desc');
  const tagEl = document.getElementById('lightbox-tag');
  let lastFocused = null;

  function open(card) {
    const img = card.querySelector('.product-img');
    const ph = card.querySelector('.product-ph');
    const name = card.querySelector('.product-name');
    const desc = card.querySelector('.product-desc');
    const tag = card.querySelector('.product-tag');

    media.innerHTML = img
      ? `<img src="${img.getAttribute('src')}" alt="${img.getAttribute('alt') || ''}" />`
      : (ph ? ph.outerHTML : '');

    nameEl.textContent = name ? name.textContent.trim() : '';
    descEl.textContent = desc ? desc.textContent.trim() : '';
    tagEl.textContent = tag ? tag.textContent.trim() : '';
    tagEl.style.display = tag ? '' : 'none';

    lastFocused = document.activeElement;
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    lightbox.querySelector('.product-lightbox-close').focus();
  }

  function close() {
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', () => open(card));
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        open(card);
      }
    });
  });

  lightbox.querySelectorAll('[data-lightbox-close]').forEach(el => {
    el.addEventListener('click', close);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) close();
  });
})();

/* --- Smooth scroll per i link interni --- */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();

/* --- Form contatti (gestione base) --- */
(function () {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const btn = form.querySelector('[type="submit"]');
    const success = document.getElementById('form-success');

    btn.disabled = true;
    btn.textContent = 'Invio in corso…';

    // Simulazione invio — sostituire con fetch() verso un endpoint reale
    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.textContent = 'Invia messaggio';
      if (success) {
        success.style.display = 'block';
        setTimeout(() => { success.style.display = 'none'; }, 5000);
      }
    }, 1200);
  });
})();

/* --- Active nav link in base alla sezione visibile --- */
(function () {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle('nav-link--active', link.getAttribute('href') === `#${id}`);
        });
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach(s => observer.observe(s));
})();


/* ================================================================
   MERCATINI DA GOOGLE SHEETS
   ================================================================
   Setup: vedi le istruzioni nel commento HTML della sezione eventi.

   1. Pubblica il tuo foglio Google Sheets come CSV
      (File → Condividi → Pubblica sul web → CSV)
   2. Copia l'ID del foglio dall'URL e incollalo qui sotto:
   ================================================================ */
(function () {

  // ▼ INCOLLA QUI l'ID del tuo foglio Google Sheets ▼
  const SHEET_ID = '12vZzkT6LEmMibRkJna4AsOO-ucupTFNSvtJkOVOY6oM';
  // ▲ esempio: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgVE2upms' ▲

  // Nome del foglio (tab in basso). Default: il primo foglio.
  const SHEET_NAME = 'Foglio1';

  // ----------------------------------------------------------------

  const container = document.getElementById('eventi-container');
  if (!container || SHEET_ID === 'INSERISCI_ID_FOGLIO') {
    // ID non ancora configurato: mostra messaggio placeholder
    if (container) {
      container.innerHTML = renderEmpty('Nessun evento in programma al momento.');
    }
    return;
  }

  // CSV: semplice, senza problemi di tipo booleano
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv`;

  container.innerHTML = '<p class="eventi-loading">Caricamento eventi…</p>';

  fetch(url)
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.text();
    })
    .then(csv => {
      const rows = parseCSV(csv);
      if (rows.length < 2) {
        container.innerHTML = renderEmpty('Nessun evento in programma al momento.<br>Seguimi su Instagram per aggiornamenti!');
        return;
      }

      // Prima riga = intestazioni
      const headers = rows[0].map(h => h.toLowerCase().trim());
      const idx = name => {
        const i = headers.indexOf(name.toLowerCase());
        return i >= 0 ? i : -1;
      };

      // Righe dati (salta riga header, salta righe vuote)
      const dataRows = rows.slice(1).filter(r => r.some(v => v.trim()));

      if (dataRows.length === 0) {
        container.innerHTML = renderEmpty('Nessun evento in programma al momento.<br>Seguimi su Instagram per aggiornamenti!');
        return;
      }

      container.innerHTML = dataRows.map((r, i) => {
        const get = name => {
          const i = idx(name);
          return i >= 0 ? (r[i] ?? '').trim() : '';
        };

        const gg         = get('gg');
        const mese       = get('mese');
        const anno       = get('anno');
        const nome       = get('nome');
        const luogo      = get('luogo');
        const citta      = get('città') || get('citta');
        let desc         = get('descrizione');
        const rawProssimo = get('prossimo');

        // Rimuovi eventuale VERO/FALSO in coda alla descrizione (overflow da G→H)
        const trailing = desc.match(/\s+(VERO|FALSO|TRUE|FALSE|SI|SÌ|NO)$/i);
        if (trailing) desc = desc.slice(0, -trailing[0].length).trim();

        // La colonna H (Prossimo) ha la priorità assoluta se non è vuota;
        // altrimenti usa l'eventuale valore estratto dall'overflow in G.
        let isProssimo;
        if (rawProssimo) {
          isProssimo = /vero|true|sì|si|yes|1/i.test(rawProssimo);
        } else {
          isProssimo = trailing ? /vero|true|sì|si|yes/i.test(trailing[1]) : false;
        }
        const luogoText  = [luogo, citta].filter(Boolean).join(', ');
        const delay      = i > 0 ? ` reveal-delay-${Math.min(i, 3)}` : '';

        return `
          <article class="evento-card reveal${delay}">
            <div class="evento-date">${gg}</div>
            <span class="evento-month">${mese}${anno ? ' ' + anno : ''}</span>
            ${isProssimo ? '<div class="evento-badge">Prossimo</div>' : ''}
            <h3 class="evento-nome">${escHtml(nome)}</h3>
            ${luogoText ? `
            <p class="evento-luogo">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              ${escHtml(luogoText)}
            </p>` : ''}
            ${desc ? `<p class="evento-desc">${escHtml(desc)}</p>` : ''}
          </article>`;
      }).join('');

      // Attiva le animazioni reveal sulle card appena inserite
      container.querySelectorAll('.reveal').forEach(el => {
        const io = new IntersectionObserver((entries) => {
          entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
          });
        }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });
        io.observe(el);
      });
    })
    .catch(err => {
      console.error('[Mercatini] errore:', err.message);
      container.innerHTML = renderEmpty('Impossibile caricare gli eventi.<br>Riprova più tardi o visita il profilo Instagram.');
    });

  /* Minimal CSV parser: gestisce virgolette e virgole nei valori */
  function parseCSV(text) {
    const results = [];
    const lines = text.replace(/\r\n?/g, '\n').split('\n');
    lines.forEach(line => {
      if (!line.trim()) return;
      const cells = [];
      let cur = '', inQ = false;
      for (let i = 0; i < line.length; i++) {
        const ch = line[i];
        if (ch === '"') {
          if (inQ && line[i + 1] === '"') { cur += '"'; i++; }
          else inQ = !inQ;
        } else if (ch === ',' && !inQ) {
          cells.push(cur); cur = '';
        } else {
          cur += ch;
        }
      }
      cells.push(cur);
      results.push(cells);
    });
    return results;
  }

  function renderEmpty(msg) {
    return `<p class="eventi-empty">${msg}</p>`;
  }

  function escHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

})();
