// Global Toast Notification System
window.showToast = function(message, type = 'success') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'fixed bottom-5 right-5 z-[99999] flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  // Styling matching SneakerLabs cyber clinical vibe
  toast.className = 'transform translate-y-10 opacity-0 transition-all duration-300 pointer-events-auto flex items-center gap-3 p-4 bg-white border border-outline-variant rounded-lg shadow-xl';
  
  let icon = 'info';
  let iconColor = 'text-primary';
  if (type === 'success') {
    icon = 'check_circle';
    iconColor = 'text-green-500';
  } else if (type === 'error') {
    icon = 'error';
    iconColor = 'text-red-500';
  }

  toast.innerHTML = `
    <span class="material-symbols-outlined ${iconColor} text-[20px]" style="font-variation-settings: 'FILL' 1;">${icon}</span>
    <div class="flex-grow font-display-lg text-xs uppercase tracking-widest text-on-background font-semibold">${message}</div>
    <button class="material-symbols-outlined text-secondary hover:text-primary text-[16px] pointer-events-auto" onclick="this.parentElement.remove()">close</button>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => {
    toast.classList.remove('translate-y-10', 'opacity-0');
  }, 10);

  // Auto-remove
  setTimeout(() => {
    toast.classList.add('translate-y-10', 'opacity-0');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};

// Global Cart Badge Update Logic
window.updateCartBadge = async function() {
  if (typeof getCart !== 'function') return;
  try {
    const { items } = await getCart();
    const badges = document.querySelectorAll('[data-cart-badge]');
    badges.forEach(badge => {
      if (items && items.length > 0) {
        const count = items.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = count;
        badge.classList.remove('hidden');
      } else {
        badge.classList.add('hidden');
      }
    });
  } catch (err) {
    console.warn("Failed to update cart badge:", err);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const menuButtons = document.querySelectorAll('[data-menu-toggle]');
  const mobileNav = document.querySelector('[data-mobile-nav]');

  // Mobile Navigation toggle
  if (menuButtons.length && mobileNav) {
    menuButtons.forEach((button) => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const expanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', String(!expanded));
        mobileNav.classList.toggle('hidden', expanded);
        // Change menu button icon between menu and close
        if (mobileNav.classList.contains('hidden')) {
          button.textContent = 'menu';
          body.classList.remove('overflow-hidden');
        } else {
          button.textContent = 'close';
          body.classList.add('overflow-hidden');
        }
      });
    });
  }

  // Close mobile drawer when clicking anchor links
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', () => {
      if (mobileNav) {
        mobileNav.classList.add('hidden');
        const toggle = document.querySelector('[data-menu-toggle]');
        if (toggle) toggle.textContent = 'menu';
      }
      body.classList.remove('overflow-hidden');
    });
  });

  // Watchlist (Heart Icon) Interactive toggle
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    const isFavBtn = btn && (btn.getAttribute('data-icon') === 'favorite' || btn.hasAttribute('data-action-favorite') || btn.querySelector('span')?.innerText === 'favorite');
    const targetElement = isFavBtn ? btn : (e.target.innerText === 'favorite' && e.target.classList.contains('material-symbols-outlined') ? e.target : null);
    
    if (targetElement) {
      e.preventDefault();
      // Ensure we target the actual icon span
      const iconSpan = targetElement.tagName === 'SPAN' ? targetElement : targetElement.querySelector('.material-symbols-outlined');
      if (!iconSpan) return;

      const isFilled = iconSpan.style.fontVariationSettings && iconSpan.style.fontVariationSettings.includes("'FILL' 1");
      if (isFilled) {
        iconSpan.style.fontVariationSettings = "'FILL' 0";
        iconSpan.classList.remove('text-red-500');
        iconSpan.classList.add('text-secondary');
        showToast('Specimen removed from watchlist.', 'info');
      } else {
        iconSpan.style.fontVariationSettings = "'FILL' 1";
        iconSpan.classList.add('text-red-500');
        iconSpan.classList.remove('text-secondary');
        showToast('Specimen added to watchlist!', 'success');
      }
    }
  });

  // Profile (Person Icon) Click Handler
  document.body.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    const isProfileBtn = btn && (btn.hasAttribute('data-action-profile') || btn.querySelector('span')?.innerText === 'person');
    const targetElement = isProfileBtn ? btn : (e.target.innerText === 'person' && e.target.classList.contains('material-symbols-outlined') ? e.target : null);
    
    if (targetElement) {
      e.preventDefault();
      showToast('LAB AUTH PROTOCOL: ACTIVE (Agent Session Online)', 'success');
    }
  });

  // Newsletter email form submit intercept
  const newsletterForms = document.querySelectorAll('form:has(input[type="email"])');
  newsletterForms.forEach((form) => {
    form.addEventListener('submit', (e) => {
      // Check if it's the contact page form, let contact.js handle it
      if (form.hasAttribute('data-contact-form')) return;
      
      e.preventDefault();
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        showToast(`Access credentials established for ${emailInput.value.toUpperCase()}`, 'success');
        emailInput.value = '';
      }
    });
  });

  // Global search input enter keypress
  const searchInputs = document.querySelectorAll('[data-search-input], [data-search-input-mobile]');
  searchInputs.forEach((input) => {
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const query = input.value.trim();
        if (query) {
          window.location.href = `catalog.html?search=${encodeURIComponent(query)}`;
        }
      }
    });
  });

  // Global direct add-to-cart listener
  document.body.addEventListener('click', async (e) => {
    const addCartBtn = e.target.closest('[data-action-add-cart]');
    if (addCartBtn) {
      e.preventDefault();
      const productId = addCartBtn.getAttribute('data-id');
      try {
        if (typeof getProductById !== 'function' || typeof addCartItem !== 'function') return;
        
        // Disable button briefly during API call
        const originalContent = addCartBtn.innerHTML;
        addCartBtn.disabled = true;
        addCartBtn.innerHTML = 'span' === addCartBtn.firstElementChild?.tagName.toLowerCase() ? '<span class="material-symbols-outlined animate-spin">sync</span>' : '...';

        const product = await getProductById(productId);
        await addCartItem({
          productId: product.id,
          quantity: 1,
          name: product.name,
          price: product.price,
          image: product.image,
          size: '40 US', // default size
          sku: `LAB-${String(product.id).padStart(3, '0')}`
        });

        // Restore button and update badge
        addCartBtn.disabled = false;
        addCartBtn.innerHTML = originalContent;

        showToast(`${product.name} added to cart!`, 'success');
        updateCartBadge();
      } catch (err) {
        addCartBtn.disabled = false;
        showToast(err.message || 'Failed to add item to cart.', 'error');
      }
    }
  });

  // Initialize cart badge count
  setTimeout(() => {
    updateCartBadge();
  }, 100);

  document.documentElement.classList.add('js-ready');
});
