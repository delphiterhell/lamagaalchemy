/* =============================================
   LA MAGA ALCHEMY — script.js
   ============================================= */

/* --- Helpers condivisi --- */
function escHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/* --- Reveal on scroll (Intersection Observer) ---
   Condiviso: usato sia per gli elementi statici sia per le card
   generate dinamicamente da Collezioni ed Eventi. */
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);

function observeReveal(root) {
  (root || document).querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
}

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

/* --- Attiva le animazioni reveal sugli elementi statici --- */
observeReveal();

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

/* --- Lightbox prodotto: apre immagine + descrizione al click ---
   Usa event delegation così funziona anche con le card
   generate dinamicamente dalle Collezioni. */
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

  document.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (card) open(card);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) {
      close();
      return;
    }
    if (e.key !== 'Enter' && e.key !== ' ') return;
    const card = e.target.closest('.product-card');
    if (card) {
      e.preventDefault();
      open(card);
    }
  });

  lightbox.querySelectorAll('[data-lightbox-close]').forEach(el => {
    el.addEventListener('click', close);
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
   COLLEZIONI — alimentate da Decap CMS (content/collezioni.json)
   ================================================================
   Magalì gestisce i pezzi dal pannello /admin senza toccare il
   codice. Qui leggiamo il JSON e generiamo le card riusando
   esattamente lo stesso markup/classi CSS di prima.

   Le foto vengono servite tramite Netlify Image CDN
   (/.netlify/images?url=...) così Magalì può caricare foto pesanti
   dal telefono senza doverle ridimensionare a mano.
   ================================================================ */
(function () {
  const CATEGORIE = {
    'piccolini':   'I Piccolini',
    'chokers':     'I Chokers',
    'pezzi-unici': 'Pezzi Unici'
  };

  function productImageUrl(foto) {
    const path = foto.startsWith('/') ? foto : `/${foto}`;
    return `/.netlify/images?url=${encodeURIComponent(path)}&w=600&q=75`;
  }

  function renderProductCard(pezzo, index, tagLabel) {
    const delay = index > 0 ? ` reveal-delay-${Math.min(index, 3)}` : '';
    const nome = pezzo.nome || '';
    const descrizione = pezzo.descrizione || '';

    const media = pezzo.foto
      ? `<img src="${productImageUrl(pezzo.foto)}" alt="${escHtml(nome)}" class="product-img" loading="lazy" />`
      : `<div class="product-ph product-ph--${(index % 6) + 1}" aria-label="Foto prodotto in arrivo">
           <span class="product-ph-label">inserisci foto</span>
         </div>`;

    return `
      <article class="product-card reveal${delay}" tabindex="0" role="button">
        <div class="product-img-wrap">
          ${media}
          <div class="product-overlay" aria-hidden="true">
            <span class="product-overlay-icon">✦</span>
          </div>
        </div>
        <div class="product-info">
          <h3 class="product-name">${escHtml(nome)}</h3>
          <p class="product-desc">${escHtml(descrizione)}</p>
          <span class="product-tag">${escHtml(tagLabel)}</span>
        </div>
      </article>`;
  }

  fetch('/content/collezioni.json')
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(data => {
      const pezzi = Array.isArray(data.pezzi) ? data.pezzi : [];

      Object.keys(CATEGORIE).forEach(categoria => {
        const grid = document.querySelector(`.products-grid[data-products-grid="${categoria}"]`);
        if (!grid) return;

        const items = pezzi.filter(p => p.categoria === categoria);

        if (!items.length) {
          grid.innerHTML = '<p class="eventi-empty">Presto nuovi pezzi in questa collezione!</p>';
          return;
        }

        grid.innerHTML = items
          .map((pezzo, i) => renderProductCard(pezzo, i, CATEGORIE[categoria]))
          .join('');

        observeReveal(grid);
      });
    })
    .catch(err => {
      console.error('[Collezioni] errore:', err.message);
      document.querySelectorAll('.products-grid[data-products-grid]').forEach(grid => {
        grid.innerHTML = '<p class="eventi-empty">Impossibile caricare la collezione al momento.</p>';
      });
    });
})();


/* ================================================================
   MERCATINI & EVENTI — alimentati da Decap CMS (content/eventi.json)
   ================================================================
   Magalì gestisce gli eventi dal pannello /admin senza toccare il
   codice. Il prossimo evento futuro riceve automaticamente
   l'etichetta "Prossimo".
   ================================================================ */
(function () {
  const MESI = ['GEN', 'FEB', 'MAR', 'APR', 'MAG', 'GIU', 'LUG', 'AGO', 'SET', 'OTT', 'NOV', 'DIC'];

  const container = document.getElementById('eventi-container');
  if (!container) return;

  container.innerHTML = '<p class="eventi-loading">Caricamento eventi…</p>';

  fetch('/content/eventi.json')
    .then(r => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.json();
    })
    .then(data => {
      const eventi = Array.isArray(data.eventi) ? data.eventi : [];

      if (!eventi.length) {
        container.innerHTML = renderEmpty('Nessun evento in programma al momento.<br>Seguimi su Instagram per aggiornamenti!');
        return;
      }

      // Ordina cronologicamente
      const sorted = [...eventi].sort((a, b) => String(a.data).localeCompare(String(b.data)));

      // Il primo evento con data >= oggi è il "Prossimo"
      const todayStr = new Date().toISOString().slice(0, 10);
      const prossimo = sorted.find(ev => String(ev.data) >= todayStr);

      container.innerHTML = sorted.map((ev, i) => {
        const dataStr = String(ev.data || '');
        const [anno, mese, giorno] = dataStr.split('-');
        const meseAbbr = mese ? MESI[parseInt(mese, 10) - 1] : '';
        const delay = i > 0 ? ` reveal-delay-${Math.min(i, 3)}` : '';
        const isProssimo = prossimo && ev === prossimo;

        return `
          <article class="evento-card reveal${delay}">
            <div class="evento-date">${giorno ? parseInt(giorno, 10) : ''}</div>
            <span class="evento-month">${meseAbbr}${anno ? ' ' + anno : ''}</span>
            ${isProssimo ? '<div class="evento-badge">Prossimo</div>' : ''}
            <h3 class="evento-nome">${escHtml(ev.nome || '')}</h3>
            ${ev.luogo ? `
            <p class="evento-luogo">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"/>
                <circle cx="12" cy="9" r="2.5"/>
              </svg>
              ${escHtml(ev.luogo)}
            </p>` : ''}
            ${ev.note ? `<p class="evento-desc">${escHtml(ev.note)}</p>` : ''}
          </article>`;
      }).join('');

      observeReveal(container);
    })
    .catch(err => {
      console.error('[Eventi] errore:', err.message);
      container.innerHTML = renderEmpty('Impossibile caricare gli eventi.<br>Riprova più tardi o visita il profilo Instagram.');
    });

  function renderEmpty(msg) {
    return `<p class="eventi-empty">${msg}</p>`;
  }
})();
