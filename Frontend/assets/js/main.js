document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const menuButtons = document.querySelectorAll('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  if (menuButtons.length && mobileNav) {
    menuButtons.forEach((button) => {
      button.addEventListener('click', () => {
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
        mobileNav.classList.toggle('hidden', expanded);
        body.classList.toggle('overflow-hidden', !expanded);
      });
    });
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileNav) {
        mobileNav.classList.add('hidden');
      }
      body.classList.remove('overflow-hidden');
    });
  });

  document.documentElement.classList.add('js-ready');
});
