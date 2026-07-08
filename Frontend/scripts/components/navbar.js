document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname.split('/').pop() || '';
  const navLinks = document.querySelectorAll('[data-nav-link]');

  navLinks.forEach((link) => {
    const href = link.getAttribute('href') || '';
    if (!href) return;

    const targetPath = new URL(href, window.location.href).pathname.split('/').pop() || '';
    const isActive = Boolean(targetPath) && (currentPath === targetPath || currentPath.endsWith(targetPath));

    link.classList.toggle('text-primary', isActive);
    link.classList.toggle('font-semibold', isActive);
    link.classList.toggle('underline', isActive);
    link.classList.toggle('decoration-primary', isActive);
    link.classList.toggle('decoration-2', isActive);
    link.classList.toggle('underline-offset-4', isActive);

    if (isActive) {
      link.setAttribute('aria-current', 'page');
    } else {
      link.removeAttribute('aria-current');
    }
  });
});
