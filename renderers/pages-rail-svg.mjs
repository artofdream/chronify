function esc(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

const TAG_FILL = {
  kla: '#7dd3a7',
  finops: '#a78bfa',
  archify: '#a78bfa',
  honesty: '#c4b08a',
  origin: '#c4b08a',
  ops: '#c4b08a',
};

export function renderPagesRailSvg(doc) {
  const milestones = [...doc.milestones].sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const n = milestones.length;
  const W = Math.max(900, 80 + n * 110);
  const H = 220;
  const left = 56;
  const right = W - 40;
  const y = 130;
  const span = right - left;
  const xs = milestones.map((_, i) => (n === 1 ? (left + right) / 2 : left + (span * i) / (n - 1)));

  const nodes = milestones
    .map((m, i) => {
      const href = esc(m.href || `#${m.slug}`);
      const fill = TAG_FILL[m.tag] || '#c4b08a';
      const x = xs[i];
      return `  <a href="${href}">
    <circle cx="${x.toFixed(1)}" cy="${y}" r="7" fill="${fill}"/>
    <text x="${x.toFixed(1)}" y="${y + 28}" fill="#e7e4dc" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10" text-anchor="middle">${esc(m.title)}</text>
    <text x="${x.toFixed(1)}" y="${y + 42}" fill="#78716c" font-family="ui-sans-serif, system-ui, sans-serif" font-size="9" text-anchor="middle">${esc(m.summary || m.date)}</text>
  </a>`;
    })
    .join('\n');

  const honesty = esc(doc.meta.honesty || 'Documented aid');
  const title = esc(doc.meta.title);

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${title}">
  <title>${title}</title>
  <desc>${honesty}. SVG-as-img may not click; pair with markdown jump links.</desc>
  <rect width="${W}" height="${H}" rx="10" fill="#121417"/>
  <rect x="1" y="1" width="${W - 2}" height="${H - 2}" rx="9" fill="none" stroke="#2a2e33" stroke-width="1.5"/>
  <text x="28" y="36" fill="#c4b08a" font-family="ui-sans-serif, system-ui, sans-serif" font-size="12" font-weight="600" letter-spacing="1.2">EVOLUTION</text>
  <text x="28" y="58" fill="#e7e4dc" font-family="Palatino, Times New Roman, serif" font-size="20" font-weight="bold">${title}</text>
  <text x="${W - 28}" y="40" fill="#78716c" font-family="ui-sans-serif, system-ui, sans-serif" font-size="11" text-anchor="end">${honesty}</text>
  <line x1="${left}" y1="${y}" x2="${right}" y2="${y}" stroke="#383e47" stroke-width="2"/>
${nodes}
  <text x="28" y="${H - 16}" fill="#78716c" font-family="ui-sans-serif, system-ui, sans-serif" font-size="10">Chronify pages-rail · pair markdown jumps when embedded as img</text>
</svg>
`;
}
