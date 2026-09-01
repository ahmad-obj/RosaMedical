(() => {
  const tabs = document.querySelector('[data-rosa-language-tabs]');
  if (tabs) {
    const buttons = [...tabs.querySelectorAll('[data-lang]')];
    const panels = [...document.querySelectorAll('[data-lang-panel]')];
    const activate = (lang) => {
      buttons.forEach((button) => button.classList.toggle('nav-tab-active', button.dataset.lang === lang));
      panels.forEach((panel) => { panel.hidden = panel.dataset.langPanel !== lang; });
    };
    buttons.forEach((button) => button.addEventListener('click', () => activate(button.dataset.lang || 'en')));
  }

  document.querySelectorAll('[data-rosa-media-field]').forEach((field) => {
    const input = field.querySelector('[data-rosa-media-input]');
    const preview = field.querySelector('[data-rosa-media-preview]');
    const select = field.querySelector('[data-rosa-media-select]');
    const remove = field.querySelector('[data-rosa-media-remove]');
    if (!(input instanceof HTMLInputElement) || !preview || !(select instanceof HTMLButtonElement) || !(remove instanceof HTMLButtonElement)) return;

    select.addEventListener('click', () => {
      if (!window.wp || !window.wp.media) return;
      const frame = window.wp.media({ title: 'Select Rosa image', library: { type: 'image' }, multiple: false });
      frame.on('select', () => {
        const attachment = frame.state().get('selection').first()?.toJSON();
        if (!attachment?.id) return;
        input.value = String(attachment.id);
        const url = attachment.sizes?.medium?.url || attachment.sizes?.thumbnail?.url || attachment.url;
        preview.innerHTML = url ? `<img src="${url}" alt="">` : '<span>Image selected</span>';
        select.textContent = 'Replace';
        remove.hidden = false;
      });
      frame.open();
    });

    remove.addEventListener('click', () => {
      input.value = '0';
      preview.innerHTML = '<span>No image selected</span>';
      select.textContent = 'Select image';
      remove.hidden = true;
    });
  });
})();
