/** Structural timeline IR checks (v0; AJV can replace later). */
export function validateTimeline(doc) {
  const errors = [];
  if (!doc || typeof doc !== 'object') return [{ path: '', message: 'IR must be an object' }];
  if (doc.schema_version !== 1) errors.push({ path: '/schema_version', message: 'must be 1' });
  if (doc.diagram_type !== 'timeline') errors.push({ path: '/diagram_type', message: 'must be "timeline"' });
  if (!doc.meta?.title) errors.push({ path: '/meta/title', message: 'required' });
  if (!Array.isArray(doc.milestones) || doc.milestones.length < 1) {
    errors.push({ path: '/milestones', message: 'need at least one milestone' });
  }
  const ids = new Set();
  const eraIds = new Set((doc.eras || []).map((e) => e.id));
  for (const [i, m] of (doc.milestones || []).entries()) {
    const p = `/milestones/${i}`;
    if (!m.id) errors.push({ path: `${p}/id`, message: 'required' });
    if (ids.has(m.id)) errors.push({ path: `${p}/id`, message: `duplicate id ${m.id}` });
    ids.add(m.id);
    if (!m.date) errors.push({ path: `${p}/date`, message: 'required' });
    if (!m.title) errors.push({ path: `${p}/title`, message: 'required' });
    if (!m.href && !m.slug) errors.push({ path: `${p}/href`, message: 'href or slug required' });
    if (m.era && eraIds.size && !eraIds.has(m.era)) {
      errors.push({ path: `${p}/era`, message: `unknown era ${m.era}` });
    }
  }
  if ((doc.milestones || []).length > 24) {
    errors.push({ path: '/milestones', message: 'max 24 milestones (group into eras)' });
  }
  return errors;
}
