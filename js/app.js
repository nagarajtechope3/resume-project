/**
 * app.js – Main application controller
 */

/* ─── State ─── */
let resumeData    = loadData();
let currentTheme  = loadTheme();
let currentTemplate = loadTemplate();

/* ─── DOM refs ─── */
const preview      = document.getElementById('resume-preview');
const themeToggle  = document.getElementById('theme-toggle');
const iconSun      = document.getElementById('icon-sun');
const iconMoon     = document.getElementById('icon-moon');
const toastEl      = document.getElementById('toast');

/* ─── Toast ─── */
let toastTimer;
function showToast(msg, type = '') {
  toastEl.textContent = msg;
  toastEl.className = 'toast show' + (type ? ' ' + type : '');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => { toastEl.className = 'toast'; }, 3000);
}
// expose globally for pdf.js
window.showToast = showToast;

/* ─── Theme ─── */
function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  iconSun.style.display  = theme === 'dark' ? 'none' : 'block';
  iconMoon.style.display = theme === 'dark' ? 'block' : 'none';
  saveTheme(theme);
}

themeToggle.addEventListener('click', () => {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(currentTheme);
});

/* ─── Template Switcher ─── */
document.querySelectorAll('.tpl-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    currentTemplate = btn.dataset.template;
    document.querySelectorAll('.tpl-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    saveTemplate(currentTemplate);
    updatePreview();
  });
});

/* ─── Preview Update ─── */
function updatePreview() {
  preview.innerHTML = renderResume(resumeData, currentTemplate);
}

/* ─── Personal Details Binding ─── */
const PERSONAL_FIELDS = ['fullName', 'jobTitle', 'email', 'phone', 'location', 'website'];
PERSONAL_FIELDS.forEach(field => {
  const el = document.getElementById(field);
  if (!el) return;
  el.value = resumeData.personal[field] || '';
  el.addEventListener('input', () => {
    resumeData.personal[field] = el.value;
    saveData(resumeData);
    updatePreview();
  });
});

/* ─── Summary Binding ─── */
const summaryEl = document.getElementById('summary');
summaryEl.value = resumeData.summary || '';
summaryEl.addEventListener('input', () => {
  resumeData.summary = summaryEl.value;
  saveData(resumeData);
  updatePreview();
});

/* ─── Profile Photo Upload ─── */
const photoInput      = document.getElementById('photo-input');
const photoZone       = document.getElementById('photo-upload-zone');
const photoPreviewImg = document.getElementById('photo-preview-img');
const photoPlaceholder= document.getElementById('photo-placeholder');
const photoActions    = document.getElementById('photo-actions');
const photoChangeBtn  = document.getElementById('photo-change-btn');
const photoRemoveBtn  = document.getElementById('photo-remove-btn');

function applyPhotoToUI(dataUrl) {
  if (dataUrl) {
    photoPreviewImg.src = dataUrl;
    photoPreviewImg.style.display = 'block';
    photoPlaceholder.style.display = 'none';
    photoActions.style.display = 'flex';
    photoZone.classList.add('has-photo');
  } else {
    photoPreviewImg.src = '';
    photoPreviewImg.style.display = 'none';
    photoPlaceholder.style.display = 'flex';
    photoActions.style.display = 'none';
    photoZone.classList.remove('has-photo');
  }
}

function loadPhotoFile(file) {
  if (!file || !file.type.startsWith('image/')) {
    showToast('Please select a valid image file.', 'error');
    return;
  }
  if (file.size > 5 * 1024 * 1024) {
    showToast('Image must be smaller than 5 MB.', 'error');
    return;
  }
  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    resumeData.personal.photo = dataUrl;
    saveData(resumeData);
    applyPhotoToUI(dataUrl);
    updatePreview();
    showToast('✓ Photo added!', 'success');
  };
  reader.readAsDataURL(file);
}

// Click zone or change button → open file picker
photoZone.addEventListener('click', (e) => {
  if (e.target.closest('.photo-actions')) return; // handled separately
  photoInput.click();
});
photoChangeBtn.addEventListener('click', () => photoInput.click());

photoInput.addEventListener('change', () => {
  if (photoInput.files && photoInput.files[0]) {
    loadPhotoFile(photoInput.files[0]);
    photoInput.value = ''; // reset so same file can be re-selected
  }
});

// Remove button
photoRemoveBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  resumeData.personal.photo = '';
  saveData(resumeData);
  applyPhotoToUI('');
  updatePreview();
  showToast('Photo removed.', '');
});

// Drag and drop support
photoZone.addEventListener('dragover', (e) => {
  e.preventDefault();
  photoZone.classList.add('drag-over');
});
photoZone.addEventListener('dragleave', () => photoZone.classList.remove('drag-over'));
photoZone.addEventListener('drop', (e) => {
  e.preventDefault();
  photoZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  loadPhotoFile(file);
});

/* ─── Skills Tag Input ─── */
const skillsWrapper = document.getElementById('skills-tag-wrapper');
const skillsInput   = document.getElementById('skills-input');
const skillsTags    = document.getElementById('skills-tags');

function renderSkillTags() {
  skillsTags.innerHTML = '';
  resumeData.skills.forEach((skill, idx) => {
    const tag = document.createElement('span');
    tag.className = 'tag';
    tag.innerHTML = `${escapeHtml(skill)}<span class="tag-remove" data-idx="${idx}" role="button" aria-label="Remove ${skill}">×</span>`;
    skillsTags.appendChild(tag);
  });
}

function addSkill(value) {
  const trimmed = value.trim().replace(/,$/, '').trim();
  if (trimmed && !resumeData.skills.includes(trimmed)) {
    resumeData.skills.push(trimmed);
    saveData(resumeData);
    renderSkillTags();
    updatePreview();
  }
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

skillsInput.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ',') {
    e.preventDefault();
    addSkill(skillsInput.value);
    skillsInput.value = '';
  } else if (e.key === 'Backspace' && !skillsInput.value && resumeData.skills.length) {
    resumeData.skills.pop();
    saveData(resumeData);
    renderSkillTags();
    updatePreview();
  }
});

skillsInput.addEventListener('blur', () => {
  if (skillsInput.value.trim()) {
    addSkill(skillsInput.value);
    skillsInput.value = '';
  }
});

skillsTags.addEventListener('click', e => {
  if (e.target.classList.contains('tag-remove')) {
    const idx = parseInt(e.target.dataset.idx);
    resumeData.skills.splice(idx, 1);
    saveData(resumeData);
    renderSkillTags();
    updatePreview();
  }
});

skillsWrapper.addEventListener('click', () => skillsInput.focus());

/* ─── Dynamic List Builder ─── */
function createDynamicItem({ listId, arrayKey, fields, getTitle }) {
  const container = document.getElementById(listId);
  const arr       = resumeData[arrayKey];

  function renderAll() {
    container.innerHTML = '';
    arr.forEach((item, idx) => addItemToDOM(item, idx));
  }

  function addItemToDOM(item, idx) {
    const div = document.createElement('div');
    div.className = 'dynamic-item';
    div.dataset.idx = idx;

    // Header
    const header = document.createElement('div');
    header.className = 'item-header';
    header.innerHTML = `
      <div class="item-toggle">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
      </div>
      <div class="item-header-title">${escapeHtml(getTitle(item) || 'Untitled')}</div>
      <button class="item-remove" type="button" title="Remove" aria-label="Remove item">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>`;

    // Body
    const body = document.createElement('div');
    body.className = 'item-body';

    const grid = document.createElement('div');
    grid.className = 'form-grid';

    fields.forEach(f => {
      const grp = document.createElement('div');
      grp.className = 'form-group' + (f.wide ? ' full-width' : '');

      if (f.type === 'checkbox') {
        grp.className = 'form-group full-width';
        const label = document.createElement('label');
        label.style.cssText = 'flex-direction:row;align-items:center;gap:8px;cursor:pointer;text-transform:none;letter-spacing:0;font-size:12px;font-weight:500;color:var(--text-secondary)';
        const cb = document.createElement('input');
        cb.type = 'checkbox';
        cb.id   = `${arrayKey}-${idx}-${f.key}`;
        cb.checked = !!item[f.key];
        cb.style.cssText = 'width:16px;height:16px;accent-color:var(--brand-primary);cursor:pointer';
        label.appendChild(cb);
        label.appendChild(document.createTextNode(f.label));
        grp.appendChild(label);

        cb.addEventListener('change', () => {
          item[f.key] = cb.checked;
          // Toggle end date field
          const endField = grid.querySelector(`[data-key="end"]`);
          if (endField) endField.closest('.form-group').style.opacity = cb.checked ? '0.4' : '1';
          saveData(resumeData);
          updatePreview();
        });

        grid.appendChild(grp);
        return;
      }

      const label = document.createElement('label');
      label.htmlFor = `${arrayKey}-${idx}-${f.key}`;
      label.textContent = f.label;

      let input;
      if (f.type === 'textarea') {
        input = document.createElement('textarea');
        input.rows = 3;
        input.placeholder = f.placeholder || '';
        input.value = item[f.key] || '';
      } else {
        input = document.createElement('input');
        input.type = f.type || 'text';
        input.placeholder = f.placeholder || '';
        input.value = item[f.key] || '';
      }
      input.id = `${arrayKey}-${idx}-${f.key}`;
      input.setAttribute('data-key', f.key);

      input.addEventListener('input', () => {
        item[f.key] = input.value;
        // Update header title live
        const titleEl = div.querySelector('.item-header-title');
        if (titleEl) titleEl.textContent = getTitle(item) || 'Untitled';
        saveData(resumeData);
        updatePreview();
      });

      grp.appendChild(label);
      grp.appendChild(input);
      grid.appendChild(grp);
    });

    body.appendChild(grid);
    div.appendChild(header);
    div.appendChild(body);
    container.appendChild(div);

    // Toggle collapse
    header.addEventListener('click', (e) => {
      if (e.target.closest('.item-remove')) return;
      div.classList.toggle('collapsed');
      body.style.display = div.classList.contains('collapsed') ? 'none' : 'block';
    });

    // Remove item
    header.querySelector('.item-remove').addEventListener('click', (e) => {
      e.stopPropagation();
      arr.splice(idx, 1);
      saveData(resumeData);
      renderAll();
      updatePreview();
    });
  }

  return { renderAll };
}

/* ─── Experience ─── */
const expCtrl = createDynamicItem({
  listId:   'experience-list',
  arrayKey: 'experience',
  getTitle: (item) => item.role || item.company || '',
  fields: [
    { key: 'role',        label: 'Job Title',   placeholder: 'e.g. Software Engineer' },
    { key: 'company',     label: 'Company',      placeholder: 'e.g. Google' },
    { key: 'start',       label: 'Start Date',   placeholder: 'e.g. Jan 2022' },
    { key: 'end',         label: 'End Date',     placeholder: 'e.g. Dec 2023' },
    { key: 'current',     label: 'Currently working here', type: 'checkbox' },
    { key: 'description', label: 'Description',  placeholder: 'Key responsibilities and achievements…', type: 'textarea', wide: true },
  ]
});

document.getElementById('add-experience').addEventListener('click', () => {
  resumeData.experience.push({ role:'', company:'', start:'', end:'', current:false, description:'' });
  saveData(resumeData);
  expCtrl.renderAll();
  updatePreview();
});

/* ─── Education ─── */
const eduCtrl = createDynamicItem({
  listId:   'education-list',
  arrayKey: 'education',
  getTitle: (item) => item.degree || item.school || '',
  fields: [
    { key: 'degree',      label: 'Degree / Field',  placeholder: 'e.g. B.S. Computer Science' },
    { key: 'school',      label: 'School',           placeholder: 'e.g. MIT' },
    { key: 'start',       label: 'Start Year',       placeholder: 'e.g. 2018' },
    { key: 'end',         label: 'End Year',         placeholder: 'e.g. 2022' },
    { key: 'current',     label: 'Currently attending', type: 'checkbox' },
    { key: 'description', label: 'Notes',             placeholder: 'GPA, honors, relevant coursework…', wide: true },
  ]
});

document.getElementById('add-education').addEventListener('click', () => {
  resumeData.education.push({ degree:'', school:'', start:'', end:'', current:false, description:'' });
  saveData(resumeData);
  eduCtrl.renderAll();
  updatePreview();
});

/* ─── Projects ─── */
const projCtrl = createDynamicItem({
  listId:   'project-list',
  arrayKey: 'projects',
  getTitle: (item) => item.name || '',
  fields: [
    { key: 'name',        label: 'Project Name',    placeholder: 'e.g. Portfolio Website' },
    { key: 'date',        label: 'Date / Period',   placeholder: 'e.g. 2023' },
    { key: 'link',        label: 'Link / GitHub',   placeholder: 'github.com/user/project', wide: false },
    { key: 'tech',        label: 'Tech Stack',      placeholder: 'React, Node.js, MongoDB' },
    { key: 'description', label: 'Description',     placeholder: 'What did you build and why?', type: 'textarea', wide: true },
  ]
});

document.getElementById('add-project').addEventListener('click', () => {
  resumeData.projects.push({ name:'', date:'', link:'', tech:'', description:'' });
  saveData(resumeData);
  projCtrl.renderAll();
  updatePreview();
});

/* ─── Clear All ─── */
document.getElementById('clear-data').addEventListener('click', () => {
  if (!confirm('Clear all resume data? This cannot be undone.')) return;
  resumeData = clearData();
  // Reset form fields
  PERSONAL_FIELDS.forEach(f => {
    const el = document.getElementById(f);
    if (el) el.value = '';
  });
  summaryEl.value = '';
  resumeData.skills = [];
  renderSkillTags();
  applyPhotoToUI('');
  expCtrl.renderAll();
  eduCtrl.renderAll();
  projCtrl.renderAll();
  updatePreview();
  showToast('All data cleared.', '');
});

/* ─── Download PDF ─── */
document.getElementById('download-pdf').addEventListener('click', () => {
  downloadResumeAsPDF(resumeData, currentTemplate);
});

/* ─── Init ─── */
(function init() {
  applyTheme(currentTheme);

  // Activate saved template button
  const savedBtn = document.querySelector(`.tpl-btn[data-template="${currentTemplate}"]`);
  if (savedBtn) {
    document.querySelectorAll('.tpl-btn').forEach(b => b.classList.remove('active'));
    savedBtn.classList.add('active');
  }

  // Restore saved photo if any
  if (resumeData.personal && resumeData.personal.photo) {
    applyPhotoToUI(resumeData.personal.photo);
  }

  // Render saved dynamic lists
  expCtrl.renderAll();
  eduCtrl.renderAll();
  projCtrl.renderAll();
  renderSkillTags();

  updatePreview();
})();
