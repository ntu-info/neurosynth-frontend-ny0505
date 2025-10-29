// When deployed to Netlify this will be proxied at /api/*
const BASE = '/api';

const qinput = document.getElementById('qinput');
const mode = document.getElementById('mode');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');
const results = document.getElementById('results');
const resultsList = document.getElementById('resultsList');
const pagination = document.getElementById('pagination');
const spinner = document.getElementById('spinner');
const banner = document.getElementById('banner');
const status = document.getElementById('status');

function setStatus(text) {
  status.textContent = text;
}

function showSpinner(visible) {
  spinner.classList.toggle('hidden', !visible);
}

function showBanner(message, type = 'error') {
  if (!message) {
    banner.classList.add('hidden');
    banner.textContent = '';
    banner.className = 'hidden mb-3 p-3 rounded text-sm';
    return;
  }
  banner.classList.remove('hidden');
  banner.textList = message;
  banner.textContent = message;
  banner.classList.remove('banner-error', 'banner-info');
  banner.classList.add(type === 'info' ? 'banner-info' : 'banner-error');
}

function renderJSON(obj) {
  // Pretty-print JSON and create clickable lists for arrays of strings
  results.innerHTML = '';
  if (Array.isArray(obj)) {
    const ul = document.createElement('ul');
    ul.className = 'divide-y divide-gray-100';
    obj.forEach(item => {
      const li = document.createElement('li');
      li.className = 'p-2 hover:bg-gray-50';
      if (typeof item === 'string') {
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = item;
        a.className = 'text-indigo-600 underline';
        a.addEventListener('click', (e) => {
          e.preventDefault();
          qinput.value = item;
          mode.value = 'term';
          doSearch();
        });
        li.appendChild(a);
      } else {
        const pre = document.createElement('pre');
        pre.className = 'whitespace-pre-wrap';
        pre.textContent = JSON.stringify(item, null, 2);
        li.appendChild(pre);
      }
      ul.appendChild(li);
    });
    results.appendChild(ul);
    return;
  }

  const pre = document.createElement('pre');
  pre.className = 'whitespace-pre-wrap';
  pre.textContent = JSON.stringify(obj, null, 2);
  results.appendChild(pre);
}

async function doSearch() {
  const q = qinput.value.trim();
  const m = mode.value;
  let url = '';
  if (m === 'terms') {
    url = `${BASE}/terms`;
    // If user provided a term, try term endpoint instead
    if (q) url = `${BASE}/terms/${encodeURIComponent(q)}`;
  } else if (m === 'term') {
    if (!q) {
      setStatus('Enter a term for /terms/<term>');
      return;
    }
    url = `${BASE}/terms/${encodeURIComponent(q)}`;
  } else if (m === 'query') {
    if (!q) {
      setStatus('Enter a query for /query/<q>/studies');
      return;
    }
    url = `${BASE}/query/${encodeURIComponent(q)}/studies`;
  }

  setStatus('Loading...');
  showSpinner(true);
  showBanner(null);
  resultsList.innerHTML = '<p class="text-gray-400">Loading…</p>';
  pagination.innerHTML = '';

  try {
    const res = await fetch(url, { mode: 'cors' });
    const ct = res.headers.get('content-type') || '';
    if (!res.ok) {
      const text = await res.text();
      showBanner(`Error ${res.status}: ${text}`);
      resultsList.innerHTML = `<div class="text-red-600">Error ${res.status}: ${text}</div>`;
      setStatus(`Error ${res.status}`);
      return;
    }

    if (ct.includes('application/json')) {
      const data = await res.json();
      // If the response is an array of objects (studies), render cards with pagination
      if (Array.isArray(data) && data.length > 0 && typeof data[0] === 'object') {
        renderStudyCards(data, { pageSize: 10 });
        setStatus(`Loaded ${data.length} items`);
      } else {
        // fallback to generic JSON renderer
        renderJSON(data);
        setStatus('Loaded (JSON)');
      }
    } else {
      const text = await res.text();
      resultsList.innerHTML = `<pre class="whitespace-pre-wrap">${escapeHtml(text)}</pre>`;
      setStatus('Loaded (text)');
    }
  } catch (err) {
    showBanner(`Network error: ${err.message}`);
    resultsList.innerHTML = `<div class="text-red-600">Network error: ${err.message}</div>`;
    setStatus('Network error');
  }
  finally {
    showSpinner(false);
  }
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

searchBtn.addEventListener('click', (e) => { e.preventDefault(); doSearch(); });
clearBtn.addEventListener('click', (e) => { e.preventDefault(); qinput.value = ''; resultsList.innerHTML = '<p class="text-gray-400">Cleared.</p>'; pagination.innerHTML = ''; showBanner(null); setStatus('Idle'); });

// sample links
document.querySelectorAll('[data-sample]').forEach(a => {
  a.addEventListener('click', (e) => {
    e.preventDefault();
    const s = a.getAttribute('data-sample');
    // prefill inputs based on sample
    if (s === '/terms') { mode.value = 'terms'; qinput.value = ''; }
    else if (s.startsWith('/terms/')) { mode.value = 'term'; qinput.value = decodeURIComponent(s.replace('/terms/','')); }
    else if (s.startsWith('/query/')) { mode.value = 'query'; const inner = s.replace('/query/','').replace('/studies',''); qinput.value = decodeURIComponent(inner); }
    doSearch();
  });
});

// helpful: run sample /terms on load
// doSearch();

// --- Study card rendering + pagination ---
function renderStudyCards(items, opts = {}) {
  const pageSize = opts.pageSize || 10;
  let currentPage = 1;

  function renderPage(page) {
    currentPage = page;
    const start = (page - 1) * pageSize;
    const pageItems = items.slice(start, start + pageSize);
    resultsList.innerHTML = '';
    pageItems.forEach(it => {
      const card = document.createElement('div');
      card.className = 'card mb-3';

      // Title heuristics
      const title = document.createElement('div');
      title.className = 'study-title';
      title.textContent = it.title || it.name || (it.id ? `Study ${it.id}` : 'Study');
      card.appendChild(title);

      // meta
      const meta = document.createElement('div');
      meta.className = 'study-meta';
      const metaParts = [];
      if (it.authors) metaParts.push(Array.isArray(it.authors) ? it.authors.join(', ') : it.authors);
      if (it.journal) metaParts.push(it.journal);
      if (it.year) metaParts.push(it.year);
      if (it.pmid) metaParts.push('PMID: ' + it.pmid);
      meta.textContent = metaParts.join(' · ');
      card.appendChild(meta);

      // snippet / payload
      const body = document.createElement('div');
      body.className = 'mt-2 text-sm text-gray-700';
      if (it.abstract) body.textContent = it.abstract.slice(0, 300) + (it.abstract.length > 300 ? '…' : '');
      else body.textContent = JSON.stringify(it, null, 2);
      card.appendChild(body);

      // actions
      const actions = document.createElement('div');
      actions.className = 'card-actions';
      if (it.pmid) {
        const link = document.createElement('a');
        link.href = `https://pubmed.ncbi.nlm.nih.gov/${it.pmid}`;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.className = 'text-indigo-600 underline';
        link.textContent = 'View (PubMed)';
        actions.appendChild(link);
      }
      card.appendChild(actions);

      resultsList.appendChild(card);
    });

    renderPagination(items.length, pageSize, currentPage);
  }

  renderPage(1);

  function renderPagination(total, pageSize, current) {
    pagination.innerHTML = '';
    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    const prev = document.createElement('button');
    prev.className = 'px-3 py-1 rounded border bg-white';
    prev.textContent = 'Prev';
    prev.disabled = current === 1;
    prev.addEventListener('click', () => renderPage(Math.max(1, current - 1)));
    pagination.appendChild(prev);

    const info = document.createElement('span');
    info.className = 'px-2 text-sm text-gray-600';
    info.textContent = `${current} / ${totalPages}`;
    pagination.appendChild(info);

    const next = document.createElement('button');
    next.className = 'px-3 py-1 rounded border bg-white';
    next.textContent = 'Next';
    next.disabled = current === totalPages;
    next.addEventListener('click', () => renderPage(Math.min(totalPages, current + 1)));
    pagination.appendChild(next);
  }
}
