/**
 * data.js – Default resume data & localStorage helpers
 */

const DEFAULT_DATA = {
  personal: {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    photo: '',   // base64 data URI
  },
  summary: '',
  skills: [],
  experience: [],
  education: [],
  projects: [],
};

function loadData() {
  try {
    const stored = localStorage.getItem('resumeforge_data');
    if (stored) return JSON.parse(stored);
  } catch (e) { /* ignore */ }
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function saveData(data) {
  try {
    localStorage.setItem('resumeforge_data', JSON.stringify(data));
  } catch (e) { /* ignore */ }
}

function clearData() {
  localStorage.removeItem('resumeforge_data');
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}

function loadTheme() {
  return localStorage.getItem('resumeforge_theme') || 'light';
}

function saveTheme(theme) {
  localStorage.setItem('resumeforge_theme', theme);
}

function loadTemplate() {
  return localStorage.getItem('resumeforge_template') || 'minimal';
}

function saveTemplate(tpl) {
  localStorage.setItem('resumeforge_template', tpl);
}
