(() => {
  // Multilingual Tab Switching
  const tabs = document.querySelector('[data-rosa-language-tabs]');
  if (tabs) {
    const buttons = [...tabs.querySelectorAll('[data-lang]')];
    const panels = [...document.querySelectorAll('[data-lang-panel]')];
    const activate = (lang) => {
      buttons.forEach((button) => button.classList.toggle('nav-tab-active', button.dataset.lang === lang));
      panels.forEach((panel) => { panel.hidden = panel.dataset.langPanel !== lang; });
    };
    buttons.forEach((button) => button.addEventListener('click', () => activate(button.dataset.lang || 'en')));
    activate('en');
  }

  // Legacy Content Media Fields
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

  // Family Editor Media Pickers (Image & PDF)
  document.querySelectorAll('[data-rosa-media-picker]').forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      if (!window.wp || !window.wp.media) return;

      const type = button.dataset.rosaMediaPicker || 'image';
      const targetInputSelector = button.dataset.targetInput;
      const targetPreviewSelector = button.dataset.targetPreview;
      const input = targetInputSelector ? document.querySelector(targetInputSelector) : null;
      const preview = targetPreviewSelector ? document.querySelector(targetPreviewSelector) : null;
      const container = button.closest('.rosa-media-picker-group');
      const clearBtn = container ? container.querySelector('.rosa-media-clear') : null;

      const isPdf = type === 'pdf';
      const frame = window.wp.media({
        title: isPdf ? 'Select Catalogue PDF' : 'Select Family Cover Image',
        library: { type: isPdf ? 'application/pdf' : 'image' },
        multiple: false,
        button: { text: isPdf ? 'Use this PDF' : 'Use this image' }
      });

      frame.on('select', () => {
        const attachment = frame.state().get('selection').first()?.toJSON();
        if (!attachment?.id) return;
        if (input) input.value = String(attachment.id);

        if (preview) {
          if (isPdf) {
            const filename = attachment.filename || attachment.title || 'PDF Document';
            preview.innerHTML = `<a href="${attachment.url}" target="_blank" rel="noopener" class="button button-small"><span class="dashicons dashicons-pdf" style="vertical-align: middle;"></span> ${filename}</a>`;
          } else {
            const url = attachment.sizes?.medium?.url || attachment.sizes?.thumbnail?.url || attachment.url;
            preview.innerHTML = url ? `<img src="${url}" alt="" style="max-height: 120px; max-width: 100%;">` : '<span>Image selected</span>';
          }
        }

        if (clearBtn) {
          clearBtn.style.display = 'inline-block';
        }
      });

      frame.open();
    });
  });

  // Family Editor Media Clear Buttons
  document.querySelectorAll('.rosa-media-clear').forEach((button) => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const targetInputSelector = button.dataset.targetInput;
      const targetPreviewSelector = button.dataset.targetPreview;
      const input = targetInputSelector ? document.querySelector(targetInputSelector) : null;
      const preview = targetPreviewSelector ? document.querySelector(targetPreviewSelector) : null;

      if (input) input.value = '0';
      if (preview) {
        const pickerBtn = button.previousElementSibling;
        const isPdf = pickerBtn && pickerBtn.dataset.rosaMediaPicker === 'pdf';
        preview.innerHTML = isPdf
          ? '<span class="description">No catalogue PDF attached.</span>'
          : '<span class="description">No cover image selected.</span>';
      }
      button.style.display = 'none';
    });
  });

  // Safe Deletion Modal Handlers
  const deleteModal = document.getElementById('rosa-delete-modal');
  if (deleteModal) {
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && deleteModal.style.display === 'block') {
        deleteModal.style.display = 'none';
      }
    });
    deleteModal.addEventListener('click', (e) => {
      if (e.target === deleteModal) {
        deleteModal.style.display = 'none';
      }
    });
  }
})();
