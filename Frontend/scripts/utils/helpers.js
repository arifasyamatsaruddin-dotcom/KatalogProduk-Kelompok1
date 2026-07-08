function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(value);
}

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function setMessage(target, message, type = 'info') {
  if (!target) return;

  target.dataset.type = type;
  target.className = 'sneaker-state';

  if (type === 'error') {
    target.classList.add('sneaker-state--error');
  } else if (type === 'success') {
    target.classList.add('sneaker-state--success');
  }

  if (type === 'loading') {
    target.innerHTML = `
      <div class="sneaker-loading" role="status" aria-live="polite">
        <span class="sneaker-loading__dot"></span>
        <span class="sneaker-loading__dot"></span>
        <span class="sneaker-loading__dot"></span>
        <span>${message}</span>
      </div>`;
    return;
  }

  target.textContent = message;
}

function setLoadingMessage(target, message = 'Loading...') {
  setMessage(target, message, 'loading');
}
