(() => {
  const tabs = document.querySelector('[data-rosa-language-tabs]');
  if (!tabs) return;
  const buttons = [...tabs.querySelectorAll('[data-lang]')];
  const panels = [...document.querySelectorAll('[data-lang-panel]')];
  const activate = (lang) => {
    buttons.forEach((button) => button.classList.toggle('nav-tab-active', button.dataset.lang === lang));
    panels.forEach((panel) => { panel.hidden = panel.dataset.langPanel !== lang; });
  };
  buttons.forEach((button) => button.addEventListener('click', () => activate(button.dataset.lang || 'en')));
})();
