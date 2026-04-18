/**
 * templates.js – Resume HTML render functions (3 templates) with profile photo
 */

/* ── Icon helpers ── */
const ICONS = {
  email:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
  phone:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l.84-1.84a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
  location: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
  link:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>`,
};

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildContact(data) {
  const items = [];
  if (data.personal.email)    items.push({ icon: ICONS.email,    text: data.personal.email });
  if (data.personal.phone)    items.push({ icon: ICONS.phone,    text: data.personal.phone });
  if (data.personal.location) items.push({ icon: ICONS.location, text: data.personal.location });
  if (data.personal.website)  items.push({ icon: ICONS.link,     text: data.personal.website });
  return items.map(i => `<div class="contact-item">${i.icon}<span>${escHtml(i.text)}</span></div>`).join('');
}

/* ── Photo HTML helper
   Returns an <img> element with the stored base64 or an empty string.
   `cls`  – extra CSS class(es) on the <img>
   `size` – px value used for width & height attributes (for PDF canvas) */
function buildPhotoHtml(photo, cls = '', size = 80) {
  if (!photo) return '';
  return `<img
    src="${photo}"
    alt="Profile photo"
    class="resume-photo ${cls}"
    width="${size}"
    height="${size}"
    style="width:${size}px;height:${size}px;border-radius:50%;object-fit:cover;flex-shrink:0;"
  />`;
}

/* ─── Shared section builders ─── */
function buildExpHtml(data) {
  return data.experience.map(e => `
    <div class="exp-item">
      <div class="item-top">
        <div>
          <div class="item-title">${escHtml(e.role || 'Role')}</div>
          <div class="item-subtitle">${escHtml(e.company || '')}</div>
        </div>
        <div class="item-date">${escHtml(e.start || '')}${e.start && (e.end || e.current) ? ' – ' : ''}${e.current ? 'Present' : escHtml(e.end || '')}</div>
      </div>
      ${e.description ? `<div class="item-desc">${escHtml(e.description).replace(/\n/g, '<br>')}</div>` : ''}
    </div>`).join('');
}

function buildEduHtml(data) {
  return data.education.map(e => `
    <div class="edu-item">
      <div class="item-top">
        <div>
          <div class="item-title">${escHtml(e.degree || 'Degree')}</div>
          <div class="item-subtitle">${escHtml(e.school || '')}</div>
        </div>
        <div class="item-date">${escHtml(e.start || '')}${e.start && (e.end || e.current) ? ' – ' : ''}${e.current ? 'Present' : escHtml(e.end || '')}</div>
      </div>
      ${e.description ? `<div class="item-desc">${escHtml(e.description)}</div>` : ''}
    </div>`).join('');
}

function buildProjHtml(data) {
  return data.projects.map(p => `
    <div class="proj-item">
      <div class="item-top">
        <div class="item-title">${escHtml(p.name || 'Project')}</div>
        ${p.date ? `<div class="item-date">${escHtml(p.date)}</div>` : ''}
      </div>
      ${p.link ? `<div class="item-link">${escHtml(p.link)}</div>` : ''}
      ${p.description ? `<div class="item-desc">${escHtml(p.description).replace(/\n/g, '<br>')}</div>` : ''}
    </div>`).join('');
}

/* ═══════════════════════════════════════════════
   TEMPLATE: MINIMAL
   ─ Photo: right-aligned circle in header
   ═══════════════════════════════════════════════ */
function renderMinimal(data) {
  const hasContent = data.personal.fullName || data.summary || data.skills.length;
  if (!hasContent) return renderEmptyState();

  const contact    = buildContact(data);
  const skills     = data.skills.map(s => `<span class="skill-tag">${escHtml(s)}</span>`).join('');
  const experience = buildExpHtml(data);
  const education  = buildEduHtml(data);
  const projects   = buildProjHtml(data);
  const photo      = data.personal.photo;

  return `
    <div class="tpl-minimal">
      <div class="resume-header">
        <div class="resume-header-inner">
          <div class="resume-header-text">
            <div class="resume-name">${escHtml(data.personal.fullName) || '<span style="color:#d1d5db">Your Name</span>'}</div>
            ${data.personal.jobTitle ? `<div class="resume-title">${escHtml(data.personal.jobTitle)}</div>` : ''}
            ${contact ? `<div class="resume-contact">${contact}</div>` : ''}
          </div>
          ${photo ? `
          <div class="resume-photo-wrap resume-photo-wrap--minimal">
            ${buildPhotoHtml(photo, 'photo-minimal', 78)}
          </div>` : ''}
        </div>
      </div>
      <div class="resume-body">
        ${data.summary ? `
          <div class="resume-section">
            <div class="section-heading">Summary</div>
            <div class="summary-text">${escHtml(data.summary).replace(/\n/g, '<br>')}</div>
          </div>` : ''}
        ${skills ? `
          <div class="resume-section">
            <div class="section-heading">Skills</div>
            <div class="skills-grid">${skills}</div>
          </div>` : ''}
        ${data.experience.length ? `
          <div class="resume-section">
            <div class="section-heading">Experience</div>
            ${experience}
          </div>` : ''}
        ${data.education.length ? `
          <div class="resume-section">
            <div class="section-heading">Education</div>
            ${education}
          </div>` : ''}
        ${data.projects.length ? `
          <div class="resume-section">
            <div class="section-heading">Projects</div>
            ${projects}
          </div>` : ''}
      </div>
    </div>`;
}

/* ═══════════════════════════════════════════════
   TEMPLATE: CLASSIC
   ─ Photo: top-left of sidebar, circular with border
   ═══════════════════════════════════════════════ */
function renderClassic(data) {
  const hasContent = data.personal.fullName || data.summary || data.skills.length;
  if (!hasContent) return renderEmptyState();

  const contact    = buildContact(data);
  const skills     = data.skills.map(s => `<div class="skill-tag">${escHtml(s)}</div>`).join('');
  const experience = buildExpHtml(data);
  const education  = buildEduHtml(data);
  const projects   = buildProjHtml(data);
  const photo      = data.personal.photo;

  return `
    <div class="tpl-classic">
      <div class="resume-header">
        <div class="resume-header-inner">
          ${photo ? `
          <div class="resume-photo-wrap resume-photo-wrap--classic">
            ${buildPhotoHtml(photo, 'photo-classic', 80)}
          </div>` : ''}
          <div class="resume-header-text">
            <div class="resume-name">${escHtml(data.personal.fullName) || '<span style="opacity:0.4">Your Name</span>'}</div>
            ${data.personal.jobTitle ? `<div class="resume-title">${escHtml(data.personal.jobTitle)}</div>` : ''}
            ${contact ? `<div class="resume-contact">${contact}</div>` : ''}
          </div>
        </div>
      </div>
      <div class="resume-body">
        <div class="resume-sidebar">
          ${skills ? `
            <div class="section-heading">Skills</div>
            <div class="skills-grid">${skills}</div>` : ''}
          ${data.education.length ? `
            <div class="section-heading" style="margin-top:20px">Education</div>
            ${education}` : ''}
        </div>
        <div class="resume-main">
          ${data.summary ? `
            <div class="section-heading">Profile</div>
            <div class="summary-text">${escHtml(data.summary).replace(/\n/g, '<br>')}</div>` : ''}
          ${data.experience.length ? `
            <div class="section-heading" ${data.summary ? 'style="margin-top:18px"' : ''}>Experience</div>
            ${experience}` : ''}
          ${data.projects.length ? `
            <div class="section-heading" style="margin-top:18px">Projects</div>
            ${projects}` : ''}
        </div>
      </div>
    </div>`;
}

/* ═══════════════════════════════════════════════
   TEMPLATE: MODERN
   ─ Photo: circular with white ring, right side of gradient header
   ═══════════════════════════════════════════════ */
function renderModern(data) {
  const hasContent = data.personal.fullName || data.summary || data.skills.length;
  if (!hasContent) return renderEmptyState();

  const contact    = buildContact(data);
  const skills     = data.skills.map(s => `<span class="skill-tag">${escHtml(s)}</span>`).join('');
  const experience = buildExpHtml(data);
  const education  = buildEduHtml(data);
  const projects   = buildProjHtml(data);
  const photo      = data.personal.photo;

  return `
    <div class="tpl-modern">
      <div class="resume-header">
        <div class="resume-header-inner">
          <div class="resume-header-text">
            <div class="resume-name">${escHtml(data.personal.fullName) || '<span style="opacity:0.5">Your Name</span>'}</div>
            ${data.personal.jobTitle ? `<div class="resume-title">${escHtml(data.personal.jobTitle)}</div>` : ''}
            ${contact ? `<div class="resume-contact">${contact}</div>` : ''}
          </div>
          ${photo ? `
          <div class="resume-photo-wrap resume-photo-wrap--modern">
            ${buildPhotoHtml(photo, 'photo-modern', 86)}
          </div>` : ''}
        </div>
      </div>
      <div class="resume-body">
        ${data.summary ? `
          <div class="resume-section">
            <div class="section-heading">About Me</div>
            <div class="summary-text">${escHtml(data.summary).replace(/\n/g, '<br>')}</div>
          </div>` : ''}
        ${skills ? `
          <div class="resume-section">
            <div class="section-heading">Skills</div>
            <div class="skills-grid">${skills}</div>
          </div>` : ''}
        ${data.experience.length ? `
          <div class="resume-section">
            <div class="section-heading">Experience</div>
            ${experience}
          </div>` : ''}
        ${data.education.length ? `
          <div class="resume-section">
            <div class="section-heading">Education</div>
            ${education}
          </div>` : ''}
        ${data.projects.length ? `
          <div class="resume-section">
            <div class="section-heading">Projects</div>
            ${projects}
          </div>` : ''}
      </div>
    </div>`;
}

/* ─── Empty state ─── */
function renderEmptyState() {
  return `
    <div class="resume-empty-state">
      <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
      <h3>Start typing to see your resume</h3>
      <p>Fill in your details on the left and your resume will appear here in real-time.</p>
    </div>`;
}

/* ═══════════════════════════════════════════════
   TEMPLATE: EXECUTIVE
   ─ Wide charcoal sidebar (photo + contact + skills)
   ─ White main area with gold accent rule
   ─ Serif name, uppercase section labels
   ═══════════════════════════════════════════════ */
function renderExecutive(data) {
  const hasContent = data.personal.fullName || data.summary || data.skills.length;
  if (!hasContent) return renderEmptyState();

  const photo      = data.personal.photo;
  const experience = buildExpHtml(data);
  const education  = buildEduHtml(data);
  const projects   = buildProjHtml(data);

  // Contact items for sidebar (vertical list)
  const contactItems = [];
  if (data.personal.email)    contactItems.push({ icon: ICONS.email,    text: data.personal.email });
  if (data.personal.phone)    contactItems.push({ icon: ICONS.phone,    text: data.personal.phone });
  if (data.personal.location) contactItems.push({ icon: ICONS.location, text: data.personal.location });
  if (data.personal.website)  contactItems.push({ icon: ICONS.link,     text: data.personal.website });
  const contactHtml = contactItems.map(i =>
    `<div class="exec-contact-item">${i.icon}<span>${escHtml(i.text)}</span></div>`
  ).join('');

  const skillsHtml = data.skills.map(s =>
    `<div class="exec-skill-item"><span class="exec-skill-dot"></span>${escHtml(s)}</div>`
  ).join('');

  return `
    <div class="tpl-executive">
      <div class="exec-sidebar">
        ${photo ? `
        <div class="exec-photo-wrap">
          ${buildPhotoHtml(photo, 'photo-executive', 96)}
        </div>` : ''}
        <div class="exec-name">${escHtml(data.personal.fullName) || '<span style="opacity:0.4">Your Name</span>'}</div>
        ${data.personal.jobTitle ? `<div class="exec-title">${escHtml(data.personal.jobTitle)}</div>` : ''}
        <div class="exec-divider"></div>
        ${contactHtml ? `
          <div class="exec-section-label">Contact</div>
          <div class="exec-contact">${contactHtml}</div>` : ''}
        ${skillsHtml ? `
          <div class="exec-section-label" style="margin-top:18px">Skills</div>
          <div class="exec-skills">${skillsHtml}</div>` : ''}
      </div>

      <div class="exec-main">
        ${data.summary ? `
          <div class="exec-heading">Profile</div>
          <div class="exec-summary">${escHtml(data.summary).replace(/\n/g, '<br>')}</div>` : ''}
        ${data.experience.length ? `
          <div class="exec-heading" ${data.summary ? 'style="margin-top:22px"' : ''}>Experience</div>
          ${experience}` : ''}
        ${data.education.length ? `
          <div class="exec-heading" style="margin-top:22px">Education</div>
          ${education}` : ''}
        ${data.projects.length ? `
          <div class="exec-heading" style="margin-top:22px">Projects</div>
          ${projects}` : ''}
      </div>
    </div>`;
}

/* ═══════════════════════════════════════════════
   TEMPLATE: CREATIVE
   ─ Bold emerald green split header
   ─ Left: photo circle + name block
   ─ Right: contact pills
   ─ Teal section badges, card-style experience
   ═══════════════════════════════════════════════ */
function renderCreative(data) {
  const hasContent = data.personal.fullName || data.summary || data.skills.length;
  if (!hasContent) return renderEmptyState();

  const photo      = data.personal.photo;
  const experience = data.experience.map(e => `
    <div class="cre-exp-card">
      <div class="cre-card-left">
        <div class="cre-card-dot"></div>
        ${e.start || e.end || e.current ? `<div class="cre-card-date">${escHtml(e.start || '')}${e.start && (e.end || e.current) ? '<br>' : ''}${e.current ? 'Present' : escHtml(e.end || '')}</div>` : ''}
      </div>
      <div class="cre-card-body">
        <div class="cre-item-title">${escHtml(e.role || 'Role')}</div>
        <div class="cre-item-sub">${escHtml(e.company || '')}</div>
        ${e.description ? `<div class="cre-item-desc">${escHtml(e.description).replace(/\n/g, '<br>')}</div>` : ''}
      </div>
    </div>`).join('');

  const education = data.education.map(e => `
    <div class="cre-exp-card">
      <div class="cre-card-left">
        <div class="cre-card-dot"></div>
        ${e.start || e.end || e.current ? `<div class="cre-card-date">${escHtml(e.start || '')}${e.start && (e.end || e.current) ? '<br>' : ''}${e.current ? 'Present' : escHtml(e.end || '')}</div>` : ''}
      </div>
      <div class="cre-card-body">
        <div class="cre-item-title">${escHtml(e.degree || 'Degree')}</div>
        <div class="cre-item-sub">${escHtml(e.school || '')}</div>
        ${e.description ? `<div class="cre-item-desc">${escHtml(e.description)}</div>` : ''}
      </div>
    </div>`).join('');

  const projects = data.projects.map(p => `
    <div class="cre-proj-card">
      <div class="cre-proj-header">
        <div class="cre-item-title">${escHtml(p.name || 'Project')}</div>
        ${p.date ? `<div class="cre-proj-date">${escHtml(p.date)}</div>` : ''}
      </div>
      ${p.link ? `<div class="cre-proj-link">${escHtml(p.link)}</div>` : ''}
      ${p.description ? `<div class="cre-item-desc">${escHtml(p.description).replace(/\n/g, '<br>')}</div>` : ''}
    </div>`).join('');

  const contactPills = [];
  if (data.personal.email)    contactPills.push(`<div class="cre-pill">${ICONS.email}<span>${escHtml(data.personal.email)}</span></div>`);
  if (data.personal.phone)    contactPills.push(`<div class="cre-pill">${ICONS.phone}<span>${escHtml(data.personal.phone)}</span></div>`);
  if (data.personal.location) contactPills.push(`<div class="cre-pill">${ICONS.location}<span>${escHtml(data.personal.location)}</span></div>`);
  if (data.personal.website)  contactPills.push(`<div class="cre-pill">${ICONS.link}<span>${escHtml(data.personal.website)}</span></div>`);

  const skillsHtml = data.skills.map(s =>
    `<span class="cre-skill-tag">${escHtml(s)}</span>`
  ).join('');

  return `
    <div class="tpl-creative">
      <div class="cre-header">
        <div class="cre-header-left">
          ${photo ? `<div class="cre-photo-wrap">${buildPhotoHtml(photo, 'photo-creative', 90)}</div>` : ''}
          <div class="cre-name-block">
            <div class="cre-name">${escHtml(data.personal.fullName) || '<span style="opacity:0.5">Your Name</span>'}</div>
            ${data.personal.jobTitle ? `<div class="cre-role">${escHtml(data.personal.jobTitle)}</div>` : ''}
          </div>
        </div>
        ${contactPills.length ? `<div class="cre-contact-pills">${contactPills.join('')}</div>` : ''}
      </div>

      <div class="cre-body">
        ${data.summary ? `
          <div class="cre-section">
            <div class="cre-section-badge">About Me</div>
            <div class="cre-summary">${escHtml(data.summary).replace(/\n/g, '<br>')}</div>
          </div>` : ''}

        ${skillsHtml ? `
          <div class="cre-section">
            <div class="cre-section-badge">Skills</div>
            <div class="cre-skills-grid">${skillsHtml}</div>
          </div>` : ''}

        ${data.experience.length ? `
        <div class="cre-two-col">
          <div class="cre-col">
            <div class="cre-section-badge">Experience</div>
            <div class="cre-timeline">${experience}</div>
          </div>` : '<div class="cre-two-col"><div class="cre-col">'}

          ${data.education.length || data.projects.length ? `
          <div class="cre-col">
            ${data.education.length ? `
              <div class="cre-section-badge">Education</div>
              <div class="cre-timeline">${education}</div>` : ''}
            ${data.projects.length ? `
              <div class="cre-section-badge" style="margin-top:${data.education.length ? '18px' : '0'}">Projects</div>
              <div class="cre-projects">${projects}</div>` : ''}
          </div>` : ''}
        </div>
      </div>
    </div>`;
}

/* ─── Main render dispatcher ─── */
function renderResume(data, template) {
  switch (template) {
    case 'classic':   return renderClassic(data);
    case 'modern':    return renderModern(data);
    case 'executive': return renderExecutive(data);
    case 'creative':  return renderCreative(data);
    default:          return renderMinimal(data);
  }
}

