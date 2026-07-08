// Main script for Sneaker Labs - Experimental Tech-Wear Platform

// Initialize global variables IMMEDIATELY (before DOMContentLoaded)
let cart = [];
let wishlist = [];

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

function getProductCatalog() {
    if (Array.isArray(window.products) && window.products.length) return window.products;
    if (typeof products !== 'undefined' && Array.isArray(products)) return products;
    return [];
}

// Load from localStorage as soon as script loads
try {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) cart = JSON.parse(savedCart);
    
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) wishlist = JSON.parse(savedWishlist);
} catch(e) {
    console.log('localStorage access failed:', e);
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', async function() {
    setLoginModalVisibility(false);
    await initializeApp();
});

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setLoginModalVisibility(false), { once: true });
} else {
    setLoginModalVisibility(false);
}

async function loadProductsFromBackend() {
    if (typeof fetch !== 'function') return;

    try {
        const response = await fetch('/api/products');
        if (!response.ok) return;

        const data = await response.json();
        const apiProducts = Array.isArray(data.products) ? data.products : Array.isArray(data) ? data : null;

        if (!apiProducts || !apiProducts.length) return;

        const normalizedProducts = apiProducts.map((product) => ({
            ...product,
            category: String(product.category || '').toLowerCase(),
            originalPrice: product.originalPrice ?? product.price,
            reviews: product.reviews ?? 0,
            sizes: Array.isArray(product.sizes) ? product.sizes : [],
            colors: Array.isArray(product.colors) ? product.colors : []
        }));

        const productCatalog = getProductCatalog();
        if (Array.isArray(productCatalog)) {
            productCatalog.splice(0, productCatalog.length, ...normalizedProducts);
        }
        if (typeof window !== 'undefined') {
            window.products = normalizedProducts;
        }
    } catch (error) {
        console.warn('Backend catalog unavailable, using local data.', error);
    }
}

function setupActiveNavLink() {
    const currentPath = window.location.pathname.split('/').pop() || '';
    const navLinks = document.querySelectorAll('.nav-link, [data-nav-link]');

    navLinks.forEach((link) => {
        const href = link.getAttribute('href') || '';
        if (!href) return;

        const targetPath = new URL(href, window.location.href).pathname.split('/').pop() || '';
        const isActive = Boolean(targetPath) && (currentPath === targetPath || currentPath.endsWith(targetPath));

        link.classList.toggle('text-primary', isActive);

        if (isActive) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });
}

async function initializeApp() {
    await loadProductsFromBackend();
    updateCartCount();
    updateWishlistCount();
    setupMobileMenu();
    setupEventListeners();
    setupLoginModal();
    setupLogout();
    setupProfileDropdown();
    updateLoginUI();
    loadFeaturedProducts();
    setupSearch();
    setupActiveNavLink();
}

// Mobile Menu Setup
function setupMobileMenu() {
    const toggleBtn = document.getElementById('mobileMenuToggle');
    const navMenu = document.querySelector('.nav-menu');

    if (toggleBtn) {
        toggleBtn.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });

        // Close menu when link is clicked
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
            });
        });
    }
}

function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });

        searchInput.addEventListener('input', function() {
            const query = searchInput.value.trim().toLowerCase();
            if (!query) {
                localStorage.removeItem('searchQuery');
                hideSearchSuggestions();
                return;
            }
            showSearchSuggestions(query);
        });
    }

    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            performSearch();
        });
    }
}

function showSearchSuggestions(query) {
    const suggestions = getProductCatalog().filter(product => {
        const haystack = `${product.name} ${product.description}`.toLowerCase();
        return haystack.includes(query);
    }).slice(0, 6);

    const searchContainer = document.querySelector('.search-container');
    if (!searchContainer) return;

    let existing = document.getElementById('searchSuggestions');
    if (!existing) {
        existing = document.createElement('div');
        existing.id = 'searchSuggestions';
        existing.className = 'search-suggestions';
        searchContainer.appendChild(existing);
    }

    if (!suggestions.length) {
        existing.innerHTML = '<div class="search-suggestion-item">Tidak ada produk yang cocok</div>';
        return;
    }

    existing.innerHTML = suggestions.map(product => `
        <div class="search-suggestion-item" onclick="window.location.href='catalog.html'">
            <strong>${product.name}</strong>
            <span>${product.description}</span>
        </div>
    `).join('');
}

function hideSearchSuggestions() {
    const existing = document.getElementById('searchSuggestions');
    if (existing) existing.remove();
}

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const mobileSearchInput = document.getElementById('mobileSearchInput');
    let query = '';

    if (searchInput && searchInput.value.trim()) {
        query = searchInput.value.trim().toLowerCase();
    } else if (mobileSearchInput && mobileSearchInput.value.trim()) {
        query = mobileSearchInput.value.trim().toLowerCase();
    }

    if (query) {
        localStorage.setItem('searchQuery', query);
        hideSearchSuggestions();
        window.location.href = 'catalog.html';
    } else {
        hideSearchSuggestions();
        showNotification('Please enter a search query first.');
    }
}

// Event Listeners Setup
function setupEventListeners() {
    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            showNotification('✓ Terima kasih telah berlangganan Lab Updates kami!');
            newsletterForm.reset();
        });
    }

    // Cart panel button
    const cartPanelBtn = document.getElementById('cartPanelBtn');
    if (cartPanelBtn) {
        cartPanelBtn.addEventListener('click', showCartPanel);
    }

    // Wishlist button
    const wishlistBtn = document.getElementById('wishlistBtn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('click', showWishlistPanel);
    }
}

// Login Modal
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

    // Close button event listener (X button click)
    closeLoginModal.addEventListener('click', closeModal);

    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => {
            const googleEmail = 'google-user@gmail.com';
            localStorage.setItem('loginUser', googleEmail);
            localStorage.setItem('loginProvider', 'google');
            showNotification('✓ Successfully signed in with Google.');
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
            showNotification('Please enter your email and password first.');
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
                // Mock registration/login fallback using localStorage
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
                showNotification(mode === 'register' ? '✓ Account created successfully! You are logged in.' : `✓ Welcome back, ${data.user.email}!`);
                closeModal();
                loginForm.reset();
                updateLoginUI();
            }
        } catch (error) {
            showNotification(error.message || 'Failed to connect to server.');
        }
    });
}

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
    const loginModal = document.getElementById('loginModal');
    const profileBtn = document.getElementById('profileBtn');
    const user = localStorage.getItem('loginUser');

    if (loginBtn) {
        loginBtn.textContent = 'Sign In';
        loginBtn.title = 'Login';
        setAuthVisibility(loginBtn, !user);
    }

    if (registerBtn) {
        setAuthVisibility(registerBtn, !user);
    }

    if (logoutBtn) {
        setAuthVisibility(logoutBtn, false);
    }

    if (profileBtn) {
        setAuthVisibility(profileBtn, Boolean(user));
    }

    if (loginStatus) {
        setAuthVisibility(loginStatus, false);
    }

    if (loginModal) {
        setLoginModalVisibility(false);
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
                    showNotification('✓ Successfully logged out.');
                    updateLoginUI();
                });
            }
        }
    });
}

function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (!logoutBtn) return;

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loginUser');
        localStorage.removeItem('loginProvider');
        localStorage.removeItem('authToken');
        localStorage.removeItem('sneakerlabs-user');
        localStorage.removeItem('sneakerlabs-token');
        showNotification('✓ Successfully logged out.');
        updateLoginUI();
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
                    showNotification(`✓ Username updated to "${newName}"`);
                    const loginStatus = document.getElementById('loginStatus');
                    if (loginStatus) {
                        loginStatus.textContent = `Hello, ${newName}`;
                    }
                } else {
                    showNotification('Please enter a valid display name.');
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
                showNotification('✓ Successfully logged out.');
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

function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    const featured = getProductCatalog().slice(0, 4);
    container.innerHTML = featured.map(product => createProductCard(product)).join('');
}

// Product Card Creation
function createProductCard(product) {
    const discountPercent = product.originalPrice > product.price 
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    const isInWishlist = wishlist.some(item => item.id === product.id);

    return `
        <div class="product-card group relative bg-white border border-black/5 overflow-hidden transition-all duration-500 hover:shadow-xl hover:translate-y-[-8px] cursor-pointer flex flex-col h-full" onclick="openProductDetail(${product.id})">
            ${product.badge ? `
            <div class="absolute top-4 left-4 z-10">
                <span class="${product.badge === 'SALE' ? 'bg-red-600' : 'bg-primary'} text-white text-[10px] font-bold px-3 py-1 uppercase tracking-widest">${product.badge}</span>
            </div>
            ` : ''}
            <div class="absolute top-4 right-4 z-20">
                <button class="wishlist-icon w-8 h-8 rounded-full bg-white/80 backdrop-blur-md flex items-center justify-center text-secondary hover:text-primary transition-colors ${isInWishlist ? 'active text-primary' : ''}" onclick="toggleWishlist(event, ${product.id})" title="Tambah ke Wishlist">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="${isInWishlist ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
            <div class="aspect-square bg-surface-container-low flex items-center justify-center overflow-hidden">
                <img src="${product.image}" alt="${product.name}" class="product-image w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
            </div>
            <div class="p-4 flex flex-col flex-grow gap-2">
                <div class="flex justify-between items-start">
                    <h3 class="product-name font-display-lg text-[14px] font-bold text-on-background tracking-tight uppercase">${product.name}</h3>
                    <div class="flex items-center gap-1 text-primary">
                        <span class="material-symbols-outlined text-[16px]" style="font-variation-settings: 'FILL' 1;">star</span>
                        <span class="text-xs font-bold font-body-md">${product.rating.toFixed(1)}</span>
                    </div>
                </div>
                <p class="product-description font-body-md text-secondary text-xs line-clamp-2">${product.description}</p>
                
                <div class="flex items-center gap-2 mt-1">
                    <span class="text-[10px] tracking-widest text-secondary font-display-lg uppercase">SIZE:</span>
                    <select class="product-size-select bg-transparent border-b border-black/10 text-xs font-bold text-primary py-0.5 focus:ring-0 focus:border-primary transition-colors cursor-pointer outline-none" onclick="event.stopPropagation()">
                        ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                    </select>
                </div>

                <div class="mt-auto pt-4 flex justify-between items-center">
                    <div class="product-price flex items-baseline gap-2">
                        <span class="product-price-main font-display-lg text-headline-sm text-primary font-bold">$${product.price.toFixed(2)}</span>
                        ${discountPercent > 0 ? `<span class="product-price-original line-through text-xs text-secondary/60 font-body-md">$${product.originalPrice.toFixed(2)}</span>` : ''}
                    </div>
                    <button class="add-to-cart-btn bg-primary text-white w-10 h-10 flex items-center justify-center hover:bg-primary-container transition-all active:scale-95" onclick="addToCart(event, ${product.id})">
                        <span class="material-symbols-outlined">add_shopping_cart</span>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Add to Cart
function addToCart(event, productId) {
    if (event && typeof event.stopPropagation === 'function') {
        event.stopPropagation();
    }
    
    const product = getProductCatalog().find(p => p.id === productId);
    if (!product) return;

    const card = event?.currentTarget?.closest('.product-card');
    const sizeSelect = card ? card.querySelector('.product-size-select') : null;
    const selectedSize = sizeSelect ? sizeSelect.value : product.sizes[0];

    // Check if product already in cart
    let cartItem = cart.find(item => item.id === productId && item.selectedSize === selectedSize);
    if (cartItem) {
        cartItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description,
            quantity: 1,
            selectedSize,
            selectedColor: product.colors[0]
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`✓ ${product.name} ditambahkan ke keranjang!`);
}

// Toggle Wishlist
function toggleWishlist(event, productId) {
    event.stopPropagation();
    
    const product = getProductCatalog().find(p => p.id === productId);
    if (!product) return;

    const index = wishlist.findIndex(item => item.id === productId);
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification(`✓ ${product.name} dihapus dari wishlist`);
    } else {
        wishlist.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description,
            selectedSize: product.sizes[0],
            selectedColor: product.colors[0]
        });
        showNotification(`✓ ${product.name} ditambahkan ke wishlist!`);
    }

    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    
    // Update wishlist icons on page
    const hearts = document.querySelectorAll('.wishlist-icon');
    hearts.forEach(heart => {
        const btn = heart.closest('.product-card');
        if (btn) {
            const isActive = wishlist.some(item => {
                const cardProductId = btn.querySelector('.add-to-cart-btn')?.onclick?.toString().match(/\d+/)?.[0];
                return item.id == cardProductId;
            });
            heart.classList.toggle('active', isActive);
        }
    });
}

// Update Cart Count
function updateCartCount() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountElements.forEach(el => {
        el.textContent = totalItems;
    });
}

// Update Wishlist Count
function updateWishlistCount() {
    const wishlistCountElements = document.querySelectorAll('.wishlist-count');
    wishlistCountElements.forEach(el => {
        el.textContent = wishlist.length;
    });
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.className = "fixed bottom-5 right-5 bg-primary text-white px-6 py-4 rounded-lg z-[1000] font-display-lg text-xs uppercase tracking-widest font-bold shadow-xl border border-white/10";
    notification.style.animation = 'slideIn 0.3s ease-out';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Show Cart Panel
function showCartPanel() {
    // Remove existing panel if any
    closeCartPanel();
    
    const cartItemsHTML = cart.length === 0 
        ? '<div class="p-8 text-center text-secondary font-body-md text-sm">Keranjang Anda kosong</div>'
        : cart.map((item, index) => `
        <div class="p-4 border-b border-black/5 flex gap-4 items-center">
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover bg-surface-container-low rounded-lg">
            <div class="flex-grow">
                <h4 class="font-display-lg text-sm font-bold text-on-background uppercase">${item.name}</h4>
                <p class="font-body-md text-xs text-secondary">$${item.price} x ${item.quantity}</p>
                <button onclick="removeFromCart(${index})" class="text-secondary hover:text-error transition-colors text-[10px] uppercase font-display-lg tracking-wider font-bold mt-1 underline">Hapus</button>
            </div>
            <div class="font-display-lg text-sm font-bold text-primary">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const html = `
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]" id="cartPanelOverlay" onclick="closeCartPanel()"></div>
        <div class="fixed top-0 right-0 w-[400px] h-screen bg-white z-[201] flex flex-col shadow-2xl border-l border-black/5" id="cartPanel">
            <div class="p-6 border-b border-black/5 flex justify-between items-center bg-surface">
                <h3 class="font-display-lg text-lg font-bold text-primary tracking-widest">KERANJANG</h3>
                <button onclick="closeCartPanel()" class="material-symbols-outlined text-secondary hover:text-primary transition-all">close</button>
            </div>
            <div class="flex-grow overflow-y-auto">
                ${cartItemsHTML}
            </div>
            <div class="p-6 border-t border-black/5 bg-surface-container-low">
                <div class="flex justify-between items-center mb-6">
                    <span class="font-display-lg text-xs uppercase tracking-widest text-secondary font-bold">TOTAL:</span>
                    <span class="font-display-lg text-2xl font-bold text-primary">$${total.toFixed(2)}</span>
                </div>
                <button onclick="window.location.href='cart.html'" class="w-full py-4 bg-primary text-white font-display-lg text-xs uppercase tracking-widest hover:bg-primary/95 transition-all active:scale-[0.98] rounded-lg font-bold shadow-lg shadow-primary/10">Lihat Keranjang Lengkap</button>
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
}

// Close Cart Panel
function closeCartPanel() {
    const overlay = document.getElementById('cartPanelOverlay');
    const panel = document.getElementById('cartPanel');
    if (overlay) overlay.remove();
    if (panel) panel.remove();
}

// Show Wishlist Panel
function showWishlistPanel() {
    // Remove existing panel if any
    closeWishlistPanel();
    
    const wishlistItemsHTML = wishlist.length === 0
        ? '<div class="p-8 text-center text-secondary font-body-md text-sm">Wishlist Anda kosong</div>'
        : wishlist.map((item, index) => `
        <div class="p-4 border-b border-black/5 flex gap-4 items-center">
            <img src="${item.image}" alt="${item.name}" class="w-16 h-16 object-cover bg-surface-container-low rounded-lg">
            <div class="flex-grow">
                <h4 class="font-display-lg text-sm font-bold text-on-background uppercase">${item.name}</h4>
                <p class="font-body-md text-xs text-primary font-bold">$${item.price.toFixed(2)}</p>
                <div class="flex gap-3 mt-1.5">
                    <button onclick="removeFromWishlist(${index})" class="text-secondary hover:text-error transition-colors text-[10px] uppercase font-display-lg tracking-wider font-bold underline">Hapus</button>
                    <button onclick="moveToCart(${index})" class="text-primary hover:text-primary-fixed-variant transition-colors text-[10px] uppercase font-display-lg tracking-wider font-bold underline">Ke Keranjang</button>
                </div>
            </div>
        </div>
    `).join('');

    const html = `
        <div class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200]" id="wishlistPanelOverlay" onclick="closeWishlistPanel()"></div>
        <div class="fixed top-0 left-0 w-[400px] h-screen bg-white z-[201] flex flex-col shadow-2xl border-r border-black/5" id="wishlistPanel">
            <div class="p-6 border-b border-black/5 flex justify-between items-center bg-surface">
                <h3 class="font-display-lg text-lg font-bold text-primary tracking-widest">WISHLIST (${wishlist.length})</h3>
                <button onclick="closeWishlistPanel()" class="material-symbols-outlined text-secondary hover:text-primary transition-all">close</button>
            </div>
            <div class="flex-grow overflow-y-auto">
                ${wishlistItemsHTML}
            </div>
        </div>
    `;

    document.body.insertAdjacentHTML('beforeend', html);
}

// Close Wishlist Panel
function closeWishlistPanel() {
    const overlay = document.getElementById('wishlistPanelOverlay');
    const panel = document.getElementById('wishlistPanel');
    if (overlay) overlay.remove();
    if (panel) panel.remove();
}

// Remove from Wishlist
function removeFromWishlist(index) {
    wishlist.splice(index, 1);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    updateWishlistCount();
    showWishlistPanel();
}

// Move to Cart from Wishlist
function moveToCart(index) {
    const item = wishlist[index];
    addToCart({ stopPropagation: () => {} }, item.id);
    removeFromWishlist(index);
}

// Remove from Cart
function removeFromCart(index) {
    const itemName = cart[index].name;
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showCartPanel();
    showNotification(`✓ ${itemName} dihapus dari keranjang`);
}

// Open Product Detail
function openProductDetail(productId) {
    const product = getProductCatalog().find(p => p.id === productId);
    if (product) {
        localStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.href = `product-detail.html?id=${productId}`;
    }
}

// Animation styles
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);


