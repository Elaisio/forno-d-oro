(() => {
  'use strict';

  const whatsappNumber = '244923000123';

  const openWhatsApp = (message) => {
    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  document.addEventListener('DOMContentLoaded', () => {
    const header = document.querySelector('.site-header');
    const navToggle = document.querySelector('.nav-toggle');
    const siteNav = document.querySelector('.site-nav');

    const setHeaderState = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
    setHeaderState();
    window.addEventListener('scroll', setHeaderState, { passive: true });

    navToggle?.addEventListener('click', () => {
      const isOpen = navToggle.getAttribute('aria-expanded') === 'true';
      navToggle.setAttribute('aria-expanded', String(!isOpen));
      navToggle.classList.toggle('is-open', !isOpen);
      siteNav?.classList.toggle('is-open', !isOpen);
    });

    siteNav?.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navToggle?.setAttribute('aria-expanded', 'false');
        navToggle?.classList.remove('is-open');
        siteNav.classList.remove('is-open');
      });
    });

    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (event) => {
        const target = document.querySelector(link.getAttribute('href'));
        if (target) {
          event.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

    document.querySelectorAll('.js-order').forEach((button) => {
      button.addEventListener('click', (event) => {
        event.preventDefault();
        const product = button.dataset.product || 'uma deliciosa especialidade';
        const price = button.dataset.price ? ` (${button.dataset.price} Kz)` : '';
        openWhatsApp(`Olá, Forno D’Oro! Gostaria de pedir ${product}${price}.`);
      });
    });

    const filterButtons = document.querySelectorAll('[data-filter]');
    const products = document.querySelectorAll('[data-category]');
    if (filterButtons.length && products.length) {
      filterButtons.forEach((button) => {
        button.addEventListener('click', () => {
          const filter = button.dataset.filter;
          filterButtons.forEach((item) => {
            const active = item === button;
            item.classList.toggle('is-active', active);
            item.setAttribute('aria-pressed', String(active));
          });
          products.forEach((product) => {
            product.classList.toggle('is-hidden', filter !== 'todos' && product.dataset.category !== filter);
          });
        });
      });
    }

    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length) {
      const lightbox = document.createElement('div');
      lightbox.className = 'lightbox';
      lightbox.setAttribute('role', 'dialog');
      lightbox.setAttribute('aria-modal', 'true');
      lightbox.setAttribute('aria-label', 'Visualização de imagem');
      lightbox.innerHTML = '<button class="lightbox-close" type="button" aria-label="Fechar visualização">×</button><figure><div class="lightbox-visual" aria-hidden="true"></div><img src="" alt=""><figcaption></figcaption></figure>';
      document.body.appendChild(lightbox);

      const image = lightbox.querySelector('img');
      const visual = lightbox.querySelector('.lightbox-visual');
      const caption = lightbox.querySelector('figcaption');
      const closeButton = lightbox.querySelector('.lightbox-close');
      let lastTrigger = null;

      const closeLightbox = () => {
        lightbox.classList.remove('is-open');
        document.body.style.overflow = '';
        lastTrigger?.focus();
      };

      galleryItems.forEach((item) => {
        item.addEventListener('click', () => {
          const source = item.querySelector('img');
          lastTrigger = item;
          if (source) {
            image.style.display = '';
            visual.style.display = 'none';
            image.src = source.currentSrc || source.src;
            image.alt = source.alt;
          } else {
            image.style.display = 'none';
            image.removeAttribute('src');
            image.alt = '';
            visual.style.display = '';
            visual.className = `lightbox-visual lightbox-visual--${item.dataset.theme || 'pizza'}`;
          }
          caption.textContent = item.dataset.caption || source?.alt || 'Forno D’Oro';
          lightbox.classList.add('is-open');
          document.body.style.overflow = 'hidden';
          closeButton.focus();
        });
      });

      closeButton.addEventListener('click', closeLightbox);
      lightbox.addEventListener('click', (event) => {
        if (event.target === lightbox) closeLightbox();
      });
      document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
      });
    }

    const reservationForm = document.querySelector('#reservation-form');
    if (reservationForm) {
      const dateInput = reservationForm.querySelector('#date');
      const status = reservationForm.querySelector('.form-status');
      const today = new Date();
      const localToday = new Date(today.getTime() - today.getTimezoneOffset() * 60000).toISOString().split('T')[0];
      dateInput.min = localToday;

      reservationForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (!reservationForm.checkValidity()) {
          status.textContent = 'Por favor, preencha todos os campos obrigatórios corretamente.';
          reservationForm.reportValidity();
          return;
        }

        const data = new FormData(reservationForm);
        const message = [
          'Olá, Forno D’Oro! Gostaria de reservar uma mesa.',
          '',
          `Nome: ${data.get('nome')}`,
          `Telefone: ${data.get('telefone')}`,
          `Data: ${data.get('data')}`,
          `Hora: ${data.get('hora')}`,
          `Pessoas: ${data.get('pessoas')}`,
          `Observação: ${data.get('observacao') || 'Sem observações.'}`
        ].join('\n');
        status.textContent = 'A abrir o WhatsApp com os seus dados…';
        openWhatsApp(message);
      });
    }

    const revealItems = document.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealItems.forEach((item) => observer.observe(item));
    } else {
      revealItems.forEach((item) => item.classList.add('is-visible'));
    }
  });
})();
