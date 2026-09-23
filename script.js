/* Maria D'Ajuda Paulucio · Advocacia — comportamento do site.
   JavaScript puro, sem dependências. Cada bloco só roda se o elemento existir. */
(function () {
  'use strict';

  const WHATSAPP_NUMBER = '5594988131361';
  const root = document.documentElement;
  root.classList.add('js');

  /* Link de WhatsApp com mensagem pré-preenchida */
  const waLink = (text) =>
    'https://wa.me/' + WHATSAPP_NUMBER + (text ? '?text=' + encodeURIComponent(text) : '');

  /* Links marcados com data-wa="mensagem" ganham o texto sugerido */
  document.querySelectorAll('[data-wa]').forEach((a) => {
    a.href = waLink(a.dataset.wa);
  });

  /* Ano no rodapé */
  document.querySelectorAll('[data-year]').forEach((el) => {
    el.textContent = new Date().getFullYear();
  });

  /* Cabeçalho: fio inferior ao rolar ------------------------------------ */
  const header = document.querySelector('.site-header');
  const floatBtn = document.querySelector('.wa-float');
  const hero = document.querySelector('.hero, .page-head, .article-head');

  const onScroll = () => {
    const y = window.scrollY;
    if (header) header.classList.toggle('is-scrolled', y > 8);
    if (floatBtn) {
      const limit = hero ? hero.offsetTop + hero.offsetHeight * 0.8 : 480;
      floatBtn.classList.toggle('is-visible', y > limit);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Menu mobile ---------------------------------------------------------- */
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.getElementById('site-nav');

  if (toggle && nav) {
    const setOpen = (open) => {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      nav.classList.toggle('is-open', open);
      document.body.classList.toggle('nav-open', open);
      if (open) {
        const first = nav.querySelector('a');
        if (first) first.focus({ preventScroll: true });
      }
    };

    toggle.addEventListener('click', () => setOpen(toggle.getAttribute('aria-expanded') !== 'true'));

    nav.addEventListener('click', (e) => {
      if (e.target.closest('a')) setOpen(false);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setOpen(false);
        toggle.focus();
      }
    });

    window.matchMedia('(min-width: 981px)').addEventListener('change', (mq) => {
      if (mq.matches) setOpen(false);
    });
  }

  /* Revelação sutil ao rolar -------------------------------------------- */
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );
    reveals.forEach((el) => io.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('is-in'));
  }

  /* Filtro do blog ------------------------------------------------------- */
  const filters = document.querySelector('[data-filters]');
  if (filters) {
    const items = document.querySelectorAll('[data-category]');
    const empty = document.querySelector('[data-empty]');

    filters.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-filter]');
      if (!btn) return;
      const value = btn.dataset.filter;

      filters.querySelectorAll('button').forEach((b) =>
        b.setAttribute('aria-pressed', String(b === btn))
      );

      let visible = 0;
      items.forEach((item) => {
        const show = value === 'todos' || item.dataset.category === value;
        item.hidden = !show;
        if (show) visible++;
      });
      if (empty) empty.hidden = visible > 0;
    });
  }

  /* Formulário de contato ------------------------------------------------
     Hospedagem estática não tem servidor para enviar e-mail. O formulário
     valida os dados e abre o WhatsApp do escritório com a mensagem pronta.
     Para receber por e-mail, veja a seção "Formulário" no README.md. */
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    const status = form.querySelector('.form__status');
    const phone = form.querySelector('#telefone');

    /* Máscara simples de telefone brasileiro */
    if (phone) {
      phone.addEventListener('input', () => {
        const d = phone.value.replace(/\D/g, '').slice(0, 11);
        let out = d;
        if (d.length > 2) out = '(' + d.slice(0, 2) + ') ' + d.slice(2);
        if (d.length > 7) out = '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(-4);
        phone.value = out;
      });
    }

    const rules = {
      nome: (v) => (v.trim().length >= 3 ? '' : 'Informe seu nome completo.'),
      telefone: (v) => (v.replace(/\D/g, '').length >= 10 ? '' : 'Informe um telefone com DDD.'),
      assunto: (v) => (v ? '' : 'Selecione o assunto.'),
      mensagem: (v) => (v.trim().length >= 10 ? '' : 'Conte brevemente a sua situação (mínimo de 10 caracteres).'),
      consentimento: (_, el) => (el.checked ? '' : 'É necessário autorizar o contato.'),
    };

    const validateField = (el) => {
      const rule = rules[el.name];
      if (!rule) return true;
      const msg = rule(el.value, el);
      const err = form.querySelector('#erro-' + el.name);
      el.setAttribute('aria-invalid', msg ? 'true' : 'false');
      if (err) err.textContent = msg;
      return !msg;
    };

    /* Valida ao sair do campo (se já preenchido) e revalida ao corrigir */
    form.addEventListener('focusout', (e) => {
      if (e.target.name && (e.target.value || e.target.getAttribute('aria-invalid'))) validateField(e.target);
    });
    form.addEventListener('input', (e) => {
      if (e.target.getAttribute('aria-invalid') === 'true') validateField(e.target);
    });
    form.addEventListener('change', (e) => {
      if (e.target.type === 'checkbox' || e.target.tagName === 'SELECT') validateField(e.target);
    });

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const fields = Array.from(form.elements).filter((el) => rules[el.name]);
      const invalid = fields.filter((el) => !validateField(el));

      if (invalid.length) {
        invalid[0].focus();
        if (status) status.textContent = 'Revise os campos destacados.';
        return;
      }

      const data = new FormData(form);
      const lines = [
        'Olá! Vim pelo site e gostaria de uma orientação.',
        '',
        'Nome: ' + data.get('nome').trim(),
        'Telefone: ' + data.get('telefone').trim(),
      ];
      const cidade = (data.get('cidade') || '').trim();
      if (cidade) lines.push('Cidade: ' + cidade);
      lines.push('Assunto: ' + data.get('assunto'), '', data.get('mensagem').trim());

      const url = waLink(lines.join('\n'));
      if (status) status.textContent = 'Abrindo o WhatsApp com a sua mensagem. Basta confirmar o envio por lá.';
      window.open(url, '_blank', 'noopener');
    });
  }
})();
