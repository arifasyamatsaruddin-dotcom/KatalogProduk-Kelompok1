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

  // Authentication & Profile Setup for Product Detail
  function setAuthVisibility(element, isVisible) {
    if (!element) return;
    if (isVisible) {
      element.classList.remove('hidden', 'is-hidden', 'invisible', 'opacity-0', 'pointer-events-none');
      element.removeAttribute('aria-hidden');
      element.removeAttribute('hidden');
      element.style.removeProperty('display');
      element.style.visibility = '';
      element.style.opacity = '';
      element.style.pointerEvents = '';
    } else {
      element.classList.add('hidden', 'is-hidden', 'invisible', 'opacity-0', 'pointer-events-none');
      element.setAttribute('aria-hidden', 'true');
      element.setAttribute('hidden', '');
      element.style.setProperty('display', 'none', 'important');
      element.style.visibility = 'hidden';
      element.style.opacity = '0';
      element.style.pointerEvents = 'none';
    }
  }

  function updateLoginUI() {
    const loginBtn = document.getElementById('loginBtn');
    const registerBtn = document.getElementById('registerBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const loginStatus = document.getElementById('loginStatus');
    const profileBtn = document.getElementById('profileBtn');
    const user = localStorage.getItem('loginUser');

    if (loginBtn) setAuthVisibility(loginBtn, !user);
    if (registerBtn) setAuthVisibility(registerBtn, !user);
    if (logoutBtn) setAuthVisibility(logoutBtn, false);
    if (profileBtn) setAuthVisibility(profileBtn, Boolean(user));

    if (loginStatus) {
      setAuthVisibility(loginStatus, false);
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) loginForm.reset();

    // Dynamically render mobile auth elements in hamburger menu
    renderMobileAuthUI();
  }

  function renderMobileAuthUI() {
    const containers = document.querySelectorAll('.mobile-auth-container');
    if (!containers.length) return;

    const user = localStorage.getItem('loginUser');
    const savedName = localStorage.getItem('sneakerlabs_display_name') || (user && user !== '-' ? user.split('@')[0] : '');

    containers.forEach(container => {
      if (!user) {
        container.innerHTML = `
          <div class="d-flex flex-column gap-2 w-100 mt-3">
            <button class="w-100 bg-transparent border border-black text-black py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-black hover:text-white transition-all rounded-lg" id="mobileLoginBtn">Sign In</button>
            <button class="w-100 bg-black text-white py-2.5 text-xs font-bold uppercase tracking-wider hover:bg-black/95 transition-all rounded-lg" id="mobileRegisterBtn">Sign Up</button>
          </div>
        `;
        // Bind events
        const mobileLoginBtn = container.querySelector('#mobileLoginBtn');
        const mobileRegisterBtn = container.querySelector('#mobileRegisterBtn');
        if (mobileLoginBtn) {
          mobileLoginBtn.addEventListener('click', () => {
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) navMenu.classList.remove('active');
            if (window.openLoginModalFromMobile) {
              window.openLoginModalFromMobile('login');
            }
          });
        }
        if (mobileRegisterBtn) {
          mobileRegisterBtn.addEventListener('click', () => {
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) navMenu.classList.remove('active');
            if (window.openLoginModalFromMobile) {
              window.openLoginModalFromMobile('register');
            }
          });
        }
      } else {
        container.innerHTML = `
          <div class="d-flex flex-column gap-3 text-start w-100 border-top border-black/5 pt-3">
            <div class="d-flex flex-column">
              <span class="text-[9px] text-muted uppercase tracking-widest font-bold">User</span>
              <span class="text-sm font-semibold text-black">${savedName}</span>
              <span class="text-xs text-muted text-break">${user}</span>
            </div>
            <button id="mobileLogoutBtn" class="w-100 bg-danger text-white py-2.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all border-0">Logout</button>
          </div>
        `;
        const mobileLogoutBtn = container.querySelector('#mobileLogoutBtn');
        if (mobileLogoutBtn) {
          mobileLogoutBtn.addEventListener('click', () => {
            localStorage.removeItem('loginUser');
            localStorage.removeItem('loginProvider');
            localStorage.removeItem('authToken');
            localStorage.removeItem('sneakerlabs-user');
            localStorage.removeItem('sneakerlabs-token');
            const navMenu = document.querySelector('.nav-menu');
            if (navMenu) navMenu.classList.remove('active');
            if (window.showToast) window.showToast('✓ Successfully logged out.', 'success');
            updateLoginUI();
          });
        }
      }
    });
  }

  function setupProfileDropdown() {
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');

    if (!profileBtn || !profileDropdown) return;

    function renderProfileDropdown() {
      const user = localStorage.getItem('loginUser') || '-';
      const provider = localStorage.getItem('loginProvider') || 'Backend';
      const savedName = localStorage.getItem('sneakerlabs_display_name') || (user !== '-' ? user.split('@')[0] : '');

      profileDropdown.innerHTML = `
        <h4 class="font-display-lg text-xs font-bold uppercase tracking-widest text-primary mb-3">USER INFORMATION</h4>
        <div class="space-y-3 font-body-md text-xs text-left">
          <div class="flex flex-col border-b border-black/5 pb-2">
            <span class="text-[10px] text-secondary uppercase">Display Name</span>
            <div class="flex gap-1.5 mt-1">
              <input type="text" id="profileUsernameInput" class="w-full bg-surface-container-low border border-black/15 text-xs py-1 px-2 focus:ring-0 focus:border-primary outline-none text-on-background font-medium" value="${savedName}" placeholder="Enter name...">
              <button id="saveUsernameBtn" class="bg-primary text-white text-[10px] font-bold px-2.5 py-1 uppercase tracking-wider hover:bg-primary/95 active:scale-95 transition-all">Save</button>
            </div>
          </div>
          <div class="flex flex-col border-b border-black/5 pb-2">
            <span class="text-[10px] text-secondary uppercase">Email</span>
            <span id="profileEmail" class="font-semibold text-on-background">${user}</span>
          </div>
          <div class="flex flex-col border-b border-black/5 pb-2">
            <span class="text-[10px] text-secondary uppercase">Sign In Method</span>
            <span id="profileProvider" class="font-semibold text-on-background uppercase">${provider === 'google' ? 'Google' : 'Backend'}</span>
          </div>
          <div class="flex flex-col border-b border-black/5 pb-2">
            <span class="text-[10px] text-secondary uppercase">Session Status</span>
            <span class="font-semibold text-green-600 flex items-center gap-1">
              <span class="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse"></span>
              ONLINE
            </span>
          </div>
        </div>
        <button id="profileLogoutBtn" class="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg font-display-lg text-xs font-bold uppercase tracking-widest transition-all">Logout</button>
      `;

      // Bind Save Username
      const saveUsernameBtn = document.getElementById('saveUsernameBtn');
      const profileUsernameInput = document.getElementById('profileUsernameInput');
      if (saveUsernameBtn && profileUsernameInput) {
        saveUsernameBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          const newName = profileUsernameInput.value.trim();
          if (newName) {
            localStorage.setItem('sneakerlabs_display_name', newName);
            if (window.showToast) window.showToast(`✓ Username updated to "${newName}"`, 'success');
            const loginStatus = document.getElementById('loginStatus');
            if (loginStatus) {
              loginStatus.textContent = `Hello, ${newName}`;
            }
          } else {
            if (window.showToast) window.showToast('Please enter a valid display name.', 'error');
          }
        });
      }

      // Bind Logout
      const profileLogoutBtn = document.getElementById('profileLogoutBtn');
      if (profileLogoutBtn) {
        profileLogoutBtn.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();
          localStorage.removeItem('loginUser');
          localStorage.removeItem('loginProvider');
          localStorage.removeItem('authToken');
          localStorage.removeItem('sneakerlabs-user');
          localStorage.removeItem('sneakerlabs-token');
          localStorage.removeItem('sneakerlabs_display_name');

          closeDropdown();
          if (window.showToast) window.showToast('✓ Successfully logged out.', 'info');
          updateLoginUI();
        });
      }
    }

    profileBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();

      const isHidden = profileDropdown.classList.contains('hidden');
      if (isHidden) {
        renderProfileDropdown();
        profileDropdown.classList.remove('hidden');
        setTimeout(() => {
          profileDropdown.classList.remove('opacity-0', 'scale-95');
          profileDropdown.classList.add('opacity-100', 'scale-100');
        }, 10);
      } else {
        closeDropdown();
      }
    });

    function closeDropdown() {
      profileDropdown.classList.remove('opacity-100', 'scale-100');
      profileDropdown.classList.add('opacity-0', 'scale-95');
      setTimeout(() => {
        profileDropdown.classList.add('hidden');
      }, 200);
    }

    document.addEventListener('click', (e) => {
      if (!profileDropdown.classList.contains('hidden') && !profileDropdown.contains(e.target) && e.target !== profileBtn) {
        closeDropdown();
      }
    });
  }

  // Logout button on navbar
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('loginUser');
      localStorage.removeItem('loginProvider');
      localStorage.removeItem('authToken');
      localStorage.removeItem('sneakerlabs-user');
      localStorage.removeItem('sneakerlabs-token');
      if (window.showToast) window.showToast('✓ Successfully logged out.', 'info');
      updateLoginUI();
    });
  }

  function setLoginModalVisibility(isVisible) {
    const loginModal = document.getElementById('loginModal');
    if (!loginModal) return;

    if (isVisible) {
      loginModal.hidden = false;
      loginModal.removeAttribute('hidden');
      loginModal.style.display = 'flex';
      loginModal.style.visibility = 'visible';
      loginModal.style.opacity = '1';
      loginModal.style.pointerEvents = 'auto';
      loginModal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
      return;
    }

    loginModal.hidden = true;
    loginModal.setAttribute('hidden', '');
    loginModal.style.display = 'none';
    loginModal.style.visibility = 'hidden';
    loginModal.style.opacity = '0';
    loginModal.style.pointerEvents = 'none';
    loginModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    document.documentElement.style.overflow = '';
  }

  function setupLoginModal() {
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeLoginModal = document.getElementById('closeLoginModal');
    const loginForm = document.getElementById('loginForm');
    const googleLoginBtn = document.getElementById('googleLoginBtn');
    const toggleModeBtn = document.getElementById('toggleModeBtn');

    if (!loginBtn || !loginModal || !closeLoginModal || !loginForm) return;

    function openModal(source = 'login') {
      if (source !== 'login' && source !== 'register' && source !== 'checkout') return;
      setLoginModalVisibility(true);
      updateModalMode(source === 'checkout' ? 'login' : source);
    }

    const registerBtn = document.getElementById('registerBtn');
    const modalTitle = document.getElementById('loginTitle');
    const modalSubtitle = document.querySelector('.login-subtitle');

    window.openLoginModal = () => openModal('checkout');
    window.openLoginModalFromMobile = openModal;
    loginBtn.addEventListener('click', () => openModal('login'));
    if (registerBtn) {
      registerBtn.addEventListener('click', () => openModal('register'));
    }

    closeLoginModal.addEventListener('click', closeModal);

    if (googleLoginBtn) {
      googleLoginBtn.addEventListener('click', () => {
        const googleEmail = 'google-user@gmail.com';
        localStorage.setItem('loginUser', googleEmail);
        localStorage.setItem('loginProvider', 'google');
        if (window.showToast) window.showToast('✓ Successfully signed in with Google.', 'success');
        closeModal();
        loginForm.reset();
        updateLoginUI();
      });
    }

    if (toggleModeBtn) {
      toggleModeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentMode = toggleModeBtn.dataset.mode;
        updateModalMode(currentMode);
      });
    }

    function closeModal(e) {
      if (e) {
        e.preventDefault();
        e.stopPropagation();
      }
      setLoginModalVisibility(false);
      const loginForm = document.getElementById('loginForm');
      if (loginForm) loginForm.reset();
    }

    function updateModalMode(currentMode) {
      if (!modalTitle || !modalSubtitle) return;
      const submitBtn = document.getElementById('modalSubmitBtn');
      const toggleBtn = document.getElementById('toggleModeBtn');
      
      if (currentMode === 'register') {
        modalTitle.textContent = 'Register to Sneaker Labs';
        modalSubtitle.textContent = 'Create a new account to start shopping and save your wishlist.';
        if (submitBtn) {
          submitBtn.textContent = 'Sign Up';
          submitBtn.dataset.mode = 'register';
        }
        if (toggleBtn) {
          toggleBtn.textContent = 'Already have an account? Sign In';
          toggleBtn.dataset.mode = 'login';
        }
      } else {
        modalTitle.textContent = 'Sign In to Sneaker Labs';
        modalSubtitle.textContent = 'Use a demo account to preview the login interface.';
        if (submitBtn) {
          submitBtn.textContent = 'Sign In';
          submitBtn.dataset.mode = 'login';
        }
        if (toggleBtn) {
          toggleBtn.textContent = 'Register Account';
          toggleBtn.dataset.mode = 'register';
        }
      }
    }

    loginModal.addEventListener('click', (e) => {
      if (e.target === loginModal) closeModal(e);
    });

    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('loginEmail').value.trim();
      const password = document.getElementById('loginPassword').value;
      const submitBtn = document.getElementById('modalSubmitBtn');
      const mode = submitBtn ? submitBtn.dataset.mode : 'login';

      if (!email || !password) {
        if (window.showToast) window.showToast('Please enter your email and password first.', 'error');
        return;
      }

      try {
        const apiBaseUrl = window.location.port === '3000' ? '/api' : 'http://localhost:3000/api';
        let data;
        let success = false;

        try {
          const response = await fetch(`${apiBaseUrl}/${mode}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });

          data = await response.json();
          if (response.ok) {
            success = true;
          } else {
            throw new Error(data.message || 'Gagal');
          }
        } catch (fetchError) {
          console.warn('Backend server not available, using client-side mock fallback.');
          if (mode === 'register') {
            const existingUsers = JSON.parse(localStorage.getItem('sneakerlabs_mock_users') || '{}');
            if (existingUsers[email]) {
              throw new Error('Email is already registered. Please sign in.');
            }
            existingUsers[email] = password;
            localStorage.setItem('sneakerlabs_mock_users', JSON.stringify(existingUsers));
            
            data = {
              user: { email: email },
              token: 'mock-jwt-token-xyz'
            };
            success = true;
          } else {
            const existingUsers = JSON.parse(localStorage.getItem('sneakerlabs_mock_users') || '{}');
            if (email === 'demo@sneakerlabs.com' && password === 'demo123') {
              data = {
                user: { email: email },
                token: 'mock-jwt-token-demo'
              };
              success = true;
            } else if (existingUsers[email] && existingUsers[email] === password) {
              data = {
                user: { email: email },
                token: 'mock-jwt-token-xyz'
              };
              success = true;
            } else {
              throw new Error('Incorrect email or password.');
            }
          }
        }

        if (success && data) {
          localStorage.setItem('loginUser', data.user.email);
          localStorage.setItem('loginProvider', 'backend');
          localStorage.setItem('authToken', data.token);
          localStorage.setItem('sneakerlabs-user', JSON.stringify(data.user));
          localStorage.setItem('sneakerlabs-token', data.token);
          if (window.showToast) {
            window.showToast(mode === 'register' ? '✓ Account created successfully! You are logged in.' : `✓ Welcome back, ${data.user.email}!`, 'success');
          }
          closeModal();
          loginForm.reset();
          updateLoginUI();
        }
      } catch (error) {
        if (window.showToast) window.showToast(error.message || 'Failed to connect to server.', 'error');
      }
    });
  }

  // Run updates immediately
  updateLoginUI();
  setupProfileDropdown();
  setLoginModalVisibility(false);
  setupLoginModal();

  document.documentElement.classList.add('js-ready');
});
