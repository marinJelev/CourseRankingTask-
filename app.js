/* ── Course data ── */
const COURSES = [
  {
    id: 1, title: "Machine Learning A–Z: Hands-on Python & R",
    inst: "Jose Portilla", lvl: "int", ll: "Intermediate",
    dh: 40, ek: 214, rat: 4.8, rct: 3241, mo: 5,
    score: 94, q: 96, e: 91, f: 95, fit: 98, mom: 88,
    cert: true, free: false
  },
  {
    id: 2, title: "Python for Data Science & ML Bootcamp",
    inst: "Jose Portilla", lvl: "beg", ll: "Beginner",
    dh: 25, ek: 189, rat: 4.7, rct: 2879, mo: 3,
    score: 91, q: 94, e: 89, f: 98, fit: 85, mom: 90,
    cert: true, free: false
  },
  {
    id: 3, title: "Deep Learning Specialization with TensorFlow 2.0",
    inst: "Andrew Ng", lvl: "adv", ll: "Advanced",
    dh: 60, ek: 92, rat: 4.9, rct: 1104, mo: 7,
    score: 88, q: 98, e: 95, f: 88, fit: 72, mom: 79,
    cert: true, free: false
  },
  {
    id: 4, title: "Practical Statistics for Data Scientists",
    inst: "Peter Bruce", lvl: "int", ll: "Intermediate",
    dh: 18, ek: 47, rat: 4.6, rct: 812, mo: 4,
    score: 85, q: 90, e: 84, f: 96, fit: 80, mom: 72,
    cert: false, free: false
  },
  {
    id: 5, title: "Feature Engineering for ML — Modern Techniques",
    inst: "Soledad Galli", lvl: "int", ll: "Intermediate",
    dh: 12, ek: 31, rat: 4.8, rct: 441, mo: 2,
    score: 83, q: 88, e: 80, f: 99, fit: 76, mom: 94,
    cert: true, free: false
  },
  {
    id: 6, title: "Data Visualization with Python & Matplotlib",
    inst: "Jose Portilla", lvl: "beg", ll: "Beginner",
    dh: 8, ek: 62, rat: 4.5, rct: 1203, mo: 9,
    score: 79, q: 85, e: 78, f: 87, fit: 82, mom: 65,
    cert: false, free: true
  },
  {
    id: 7, title: "Applied Machine Learning in Python",
    inst: "Andreas Müller", lvl: "adv", ll: "Advanced",
    dh: 22, ek: 38, rat: 4.4, rct: 598, mo: 14,
    score: 74, q: 82, e: 76, f: 72, fit: 70, mom: 58,
    cert: true, free: false
  },
  {
    id: 8, title: "SQL for Data Analysis — Zero to Hero",
    inst: "Colt Steele", lvl: "beg", ll: "Beginner",
    dh: 14, ek: 104, rat: 4.6, rct: 2100, mo: 6,
    score: 80, q: 87, e: 82, f: 90, fit: 78, mom: 70,
    cert: false, free: true
  },
  {
    id: 9, title: "NLP with Transformers and HuggingFace",
    inst: "Lewis Tunstall", lvl: "adv", ll: "Advanced",
    dh: 35, ek: 29, rat: 4.7, rct: 388, mo: 4,
    score: 82, q: 89, e: 83, f: 95, fit: 74, mom: 91,
    cert: true, free: false
  },
  {
    id: 10, title: "Introduction to Data Science with R",
    inst: "Rafael Irizarry", lvl: "beg", ll: "Beginner",
    dh: 20, ek: 55, rat: 4.3, rct: 930, mo: 18,
    score: 70, q: 79, e: 72, f: 65, fit: 76, mom: 52,
    cert: false, free: true
  },
];

/* ── Quick-filter toggles state ── */
const Q = { rating: false, cert: false, free: false };

/* ── Helpers ── */
function durationBucket(h) {
  return h < 2 ? 'sh' : h <= 10 ? 'md' : 'lg';
}

function updatedLabel(mo) {
  if (mo <= 6)  return 'Last 6 months';
  if (mo <= 12) return 'Last year';
  if (mo <= 24) return 'Last 2 years';
  return 'Older';
}

function renderStars(r) {
  let s = '';
  for (let i = 0; i < Math.floor(r); i++) s += '<i class="ti ti-star-filled" aria-hidden="true"></i>';
  if (r % 1 >= 0.5) s += '<i class="ti ti-star-half-filled" aria-hidden="true"></i>';
  return s;
}

/* ── Read current filter state from DOM ── */
function getFilters() {
  const lvls = [];
  if (document.getElementById('f-beg').checked) lvls.push('beg');
  if (document.getElementById('f-int').checked) lvls.push('int');
  if (document.getElementById('f-adv').checked) lvls.push('adv');

  const mrRaw = parseFloat(document.querySelector('input[name="mr"]:checked')?.value || 0);
  const mr = Q.rating ? Math.max(mrRaw, 4.0) : mrRaw;

  const mxm = parseInt(document.querySelector('input[name="fr"]:checked')?.value || 999);

  const dur = [];
  if (document.getElementById('f-sh').checked) dur.push('sh');
  if (document.getElementById('f-md').checked) dur.push('md');
  if (document.getElementById('f-lg').checked) dur.push('lg');

  const cert = document.getElementById('f-cert').checked || Q.cert;
  const free = document.getElementById('f-free').checked || Q.free;

  return { lvls, mr, mxm, dur, cert, free };
}

/* ── Filter courses ── */
function filterCourses(f) {
  return COURSES.filter(c => {
    if (f.lvls.length && !f.lvls.includes(c.lvl)) return false;
    if (c.rat < f.mr) return false;
    if (c.mo > f.mxm) return false;
    if (f.dur.length && !f.dur.includes(durationBucket(c.dh))) return false;
    if (f.cert && !c.cert) return false;
    if (f.free && !c.free) return false;
    return true;
  });
}

/* ── Sort courses ── */
function sortCourses(list, mode) {
  const s = [...list];
  switch (mode) {
    case 'rating':  s.sort((a, b) => b.rat - a.rat || b.rct - a.rct); break;
    case 'popular': s.sort((a, b) => b.ek - a.ek); break;
    case 'newest':  s.sort((a, b) => a.mo - b.mo); break;
    case 'trending':s.sort((a, b) => b.mom - a.mom); break;
    default:        s.sort((a, b) => b.score - a.score); break;
  }
  return s;
}

/* ── Main render ── */
function run() {
  const f    = getFilters();
  const mode = document.getElementById('sort').value;
  const filtered = filterCourses(f);
  const sorted   = sortCourses(filtered, mode);

  renderCards(sorted, mode);
  renderActiveTags(f);
  updateFilterBadge(f);

  const dc = document.getElementById('dc');
  if (dc) dc.textContent = filtered.length + ' course' + (filtered.length !== 1 ? 's' : '') + ' match';
}

/* ── Render course cards ── */
function renderCards(list, mode) {
  const labels = {
    best: 'best match', rating: 'highest rated',
    popular: 'most popular', newest: 'newest', trending: 'trending'
  };
  const lbl = labels[mode] || 'best match';

  document.getElementById('psub').textContent = list.length + ' courses · sorted by ' + lbl;
  document.getElementById('rcount').innerHTML =
    '<strong>' + list.length + ' course' + (list.length !== 1 ? 's' : '') + '</strong> found · sorted by ' + lbl;

  const el = document.getElementById('clist');

  if (!list.length) {
    el.innerHTML = `
      <div class="empty" role="status">
        <i class="ti ti-mood-empty" aria-hidden="true"></i>
        <p>No courses match your current filters.<br>
        <button class="reset-link" onclick="resetAll()">Clear all filters</button> to see all courses.</p>
      </div>`;
    return;
  }

  el.innerHTML = list.map((c, i) => {
    const rank   = i + 1;
    const dLabel = c.dh < 2 ? '<2h' : c.dh + 'h';
    return `
    <div class="card" role="listitem">
      <div class="rb ${rank <= 3 ? 'rbt' : ''}" aria-label="Rank ${rank}">${rank}</div>
      <div>
        <div class="ct">${c.title}</div>
        <div class="cm">
          <span><i class="ti ti-user" aria-hidden="true"></i>${c.inst}</span>
          <span><i class="ti ti-clock" aria-hidden="true"></i>${dLabel}</span>
          <span><i class="ti ti-users" aria-hidden="true"></i>${c.ek}k enrolled</span>
        </div>
        <div class="sr">
          <span class="rv">${c.rat.toFixed(1)}</span>
          <span class="sv" aria-label="${c.rat} stars">${renderStars(c.rat)}</span>
          <span class="rc">(${c.rct.toLocaleString()})</span>
        </div>
        <div class="tags">
          <span class="tag t${c.lvl}">${c.ll}</span>
          <span class="tag tupd">
            <i class="ti ti-refresh" style="font-size:10px;vertical-align:-1px" aria-hidden="true"></i>
            ${updatedLabel(c.mo)}
          </span>
          ${c.cert ? '<span class="tag tcert"><i class="ti ti-certificate" style="font-size:10px;vertical-align:-1px" aria-hidden="true"></i> Certificate</span>' : ''}
          ${c.free ? '<span class="tag tfree">Free</span>' : ''}
        </div>
      </div>
      <div class="sc" aria-label="Rank score ${c.score}">
        <div class="slb">Rank score</div>
        <div class="sbw"><div class="sb" style="width:${c.score}%"></div></div>
        <div class="sval">${c.score}</div>
        <div class="sbd">Q:${c.q} E:${c.e}<br>F:${c.f} Fit:${c.fit}</div>
      </div>
    </div>`;
  }).join('');
}

/* ── Render active filter tags ── */
function renderActiveTags(f) {
  const tags = [];
  const lvlMap = { beg: 'Beginner', int: 'Intermediate', adv: 'Advanced' };

  f.lvls.forEach(l => tags.push({
    lbl: lvlMap[l],
    clr: () => { document.getElementById('f-' + l).checked = false; run(); }
  }));

  if (f.mr > 0) tags.push({
    lbl: 'Rating ' + f.mr + '+',
    clr: () => {
      document.getElementById('r0').checked = true;
      Q.rating = false;
      document.getElementById('btn-r').classList.remove('on');
      run();
    }
  });

  if (f.mxm < 999) {
    const ml = { 6: '6 months', 12: '1 year', 24: '2 years' };
    tags.push({
      lbl: 'Updated: ' + (ml[f.mxm] || f.mxm + 'mo'),
      clr: () => { document.getElementById('fr99').checked = true; run(); }
    });
  }

  const durMap = { sh: '<2h', md: '2–10h', lg: '10h+' };
  f.dur.forEach(d => tags.push({
    lbl: 'Duration: ' + durMap[d],
    clr: () => { document.getElementById('f-' + d).checked = false; run(); }
  }));

  if (f.cert) tags.push({
    lbl: 'Certificate',
    clr: () => {
      document.getElementById('f-cert').checked = false;
      Q.cert = false;
      document.getElementById('btn-c').classList.remove('on');
      run();
    }
  });

  if (f.free) tags.push({
    lbl: 'Free only',
    clr: () => {
      document.getElementById('f-free').checked = false;
      Q.free = false;
      document.getElementById('btn-fr').classList.remove('on');
      run();
    }
  });

  const row = document.getElementById('arow');
  if (!tags.length) { row.innerHTML = ''; row._tags = []; return; }

  row.innerHTML = tags.map((t, i) =>
    `<div class="atag">${t.lbl}<i class="ti ti-x" aria-label="Remove ${t.lbl} filter" onclick="removeTag(${i})"></i></div>`
  ).join('') + `<button class="cla" onclick="resetAll()">Clear all</button>`;

  row._tags = tags;
}

function removeTag(i) {
  const tags = document.getElementById('arow')._tags || [];
  if (tags[i]) tags[i].clr();
}

/* ── Filter badge on Filters button ── */
function updateFilterBadge(f) {
  const count = [
    f.lvls.length > 0,
    f.mr > 0,
    f.mxm < 999,
    f.dur.length > 0,
    f.cert,
    f.free
  ].filter(Boolean).length;

  const badge = document.getElementById('fbadge');
  const btn   = document.getElementById('btn-f');

  if (count > 0) {
    badge.textContent = count;
    badge.setAttribute('aria-label', count + ' active filters');
    badge.style.display = 'inline';
    btn.classList.add('on');
  } else {
    badge.style.display = 'none';
    btn.classList.remove('on');
  }
}

/* ── Drawer open/close ── */
function toggleDrawer() {
  const d   = document.getElementById('drawer');
  const btn = document.getElementById('btn-f');
  const isOpen = d.classList.contains('open');
  if (isOpen) {
    closeDrawer();
  } else {
    d.classList.add('open');
    d.setAttribute('aria-hidden', 'false');
    btn.setAttribute('aria-expanded', 'true');
    run();
  }
}

function closeDrawer() {
  const d   = document.getElementById('drawer');
  const btn = document.getElementById('btn-f');
  d.classList.remove('open');
  d.setAttribute('aria-hidden', 'true');
  btn.setAttribute('aria-expanded', 'false');
  updateFilterBadge(getFilters());
}

/* ── Quick-filter pill toggles ── */
function qf(type) {
  if (type === 'rating') {
    Q.rating = !Q.rating;
    document.getElementById('btn-r').classList.toggle('on', Q.rating);
    document.getElementById(Q.rating ? 'r40' : 'r0').checked = true;
  } else if (type === 'cert') {
    Q.cert = !Q.cert;
    document.getElementById('btn-c').classList.toggle('on', Q.cert);
    document.getElementById('f-cert').checked = Q.cert;
  } else if (type === 'free') {
    Q.free = !Q.free;
    document.getElementById('btn-fr').classList.toggle('on', Q.free);
    document.getElementById('f-free').checked = Q.free;
  }
  run();
}

/* ── Reset everything ── */
function resetAll() {
  ['f-beg', 'f-int', 'f-adv', 'f-sh', 'f-md', 'f-lg', 'f-cert', 'f-free']
    .forEach(id => { document.getElementById(id).checked = false; });

  document.getElementById('r0').checked  = true;
  document.getElementById('fr99').checked = true;

  Q.rating = false; Q.cert = false; Q.free = false;

  ['btn-r', 'btn-c', 'btn-fr', 'btn-f'].forEach(id => {
    document.getElementById(id).classList.remove('on');
  });

  document.getElementById('fbadge').style.display = 'none';
  run();
}

/* ── Keyboard: close drawer on Escape ── */
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && document.getElementById('drawer').classList.contains('open')) {
    closeDrawer();
  }
});

/* ── Init ── */
run();
