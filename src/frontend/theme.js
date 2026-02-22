const STORAGE_KEY = 'theme';
const THEMES = ['dark', 'light'];

export function getTheme() {
  return document.documentElement.dataset.theme || 'dark';
}

export function setTheme(name) {
  if (!THEMES.includes(name)) return;
  document.documentElement.dataset.theme = name;
  localStorage.setItem(STORAGE_KEY, name);
}

export function toggleTheme() {
  const current = getTheme();
  const next = current === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

export function initTheme() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved && THEMES.includes(saved)) {
    setTheme(saved);
  }
}
