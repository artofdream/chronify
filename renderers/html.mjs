import { renderPagesRailSvg } from './pages-rail-svg.mjs';

function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function renderHtml(doc) {
  const svg = renderPagesRailSvg(doc);
  const milestones = [...doc.milestones].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const list = milestones
    .map((m) => {
      const href = esc(m.href || `#${m.slug}`);
      return `<li><a href="${href}"><time>${esc(m.date)}</time> <strong>${esc(m.title)}</strong>${m.summary ? ` — ${esc(m.summary)}` : ''}</a></li>`;
    })
    .join('\n');
  const cards = (doc.cards || [])
    .map(
      (c) =>
        `<article class="card"><h3>${esc(c.title)}</h3><ul>${(c.items || []).map((i) => `<li>${esc(i)}</li>`).join('')}</ul></article>`
    )
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en" data-theme="dark">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>${esc(doc.meta.title)} — chronify</title>
  <style>
    :root { color-scheme: dark light; --bg:#121417; --fg:#e7e4dc; --muted:#78716c; --accent:#c4b08a; --card:#181c22; --rule:#2a2e33; }
    html[data-theme="light"] { --bg:#f7f3eb; --fg:#1c1917; --muted:#78716c; --accent:#7c6a4a; --card:#fff; --rule:#e7e5e4; }
    body{margin:0;font:16px/1.5 system-ui,sans-serif;background:var(--bg);color:var(--fg)}
    main{max-width:1100px;margin:0 auto;padding:1.5rem}
    header{display:flex;justify-content:space-between;gap:1rem;align-items:baseline;margin-bottom:1rem}
    h1{font-size:1.4rem;margin:0}
    .honesty{color:var(--muted);font-size:.85rem}
    .rail{margin:1rem 0;overflow-x:auto}
    .rail svg{min-width:720px}
    .grid{display:grid;grid-template-columns:1.2fr .8fr;gap:1.25rem}
    @media(max-width:800px){.grid{grid-template-columns:1fr}}
    ol{padding-left:1.2rem}
    li{margin:.35rem 0}
    a{color:var(--accent)}
    .card{background:var(--card);border:1px solid var(--rule);border-radius:10px;padding:1rem;margin-bottom:.75rem}
    .card h3{margin:0 0 .5rem;font-size:1rem}
    button{background:transparent;border:1px solid var(--rule);color:var(--fg);border-radius:8px;padding:.35rem .7rem;cursor:pointer}
  </style>
</head>
<body>
<main>
  <header>
    <h1>${esc(doc.meta.title)}</h1>
    <div>
      <span class="honesty">${esc(doc.meta.honesty || 'Documented')}</span>
      <button type="button" id="theme">Theme</button>
    </div>
  </header>
  <div class="rail">${svg.replace(/^<\?xml[^>]*>\s*/,'')}</div>
  <div class="grid">
    <section>
      <h2>Milestones</h2>
      <ol>${list}</ol>
    </section>
    <aside>${cards}</aside>
  </div>
</main>
<script>
document.getElementById('theme').onclick=()=>{
  const h=document.documentElement;
  h.setAttribute('data-theme', h.getAttribute('data-theme')==='dark'?'light':'dark');
};
</script>
</body>
</html>
`;
}
