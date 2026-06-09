// Main script for Sneaker Labs - Experimental Tech-Wear Platform

// Initialize global variables IMMEDIATELY (before DOMContentLoaded)
let cart = [];
let wishlist = [];

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
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    updateCartCount();
    updateWishlistCount();
    setupMobileMenu();
    setupEventListeners();
    loadFeaturedProducts();
    setupSearch();
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

// Search Functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                performSearch();
            }
        });

        searchInput.addEventListener('input', function() {
            if (!searchInput.value.trim()) {
                localStorage.removeItem('searchQuery');
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

function performSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput && searchInput.value.trim()) {
        const query = searchInput.value.trim().toLowerCase();
        localStorage.setItem('searchQuery', query);
        window.location.href = 'catalog.html';
    } else {
        showNotification('Silakan ketik kata kunci pencarian terlebih dahulu.');
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

// Featured Products
function loadFeaturedProducts() {
    const container = document.getElementById('featuredProducts');
    if (!container) return;

    const featured = products.slice(0, 4);
    container.innerHTML = featured.map(product => createProductCard(product)).join('');
}

// Product Card Creation
function createProductCard(product) {
    const discountPercent = product.originalPrice > product.price 
        ? Math.round((1 - product.price / product.originalPrice) * 100)
        : 0;

    const isInWishlist = wishlist.some(item => item.id === product.id);

    return `
        <div class="product-card" onclick="openProductDetail(${product.id})">
            ${product.badge ? `<div class="product-badge ${product.badge === 'SALE' ? 'sale' : ''}">${product.badge}</div>` : ''}
            <div class="product-image-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <button class="wishlist-icon ${isInWishlist ? 'active' : ''}" onclick="toggleWishlist(event, ${product.id})" title="Tambah ke Wishlist">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                </button>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-rating">★★★★★ (${product.reviews})</div>
                <div class="product-price">
                    <span class="product-price-main">$${product.price.toFixed(2)}</span>
                    ${discountPercent > 0 ? `<span class="product-price-original">$${product.originalPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(event, ${product.id})">Tambah ke Keranjang</button>
            </div>
        </div>
    `;
}

// Add to Cart
function addToCart(event, productId) {
    event.stopPropagation();
    
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Check if product already in cart
    let cartItem = cart.find(item => item.id === productId);
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
            selectedSize: product.sizes[0],
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
    
    const product = products.find(p => p.id === productId);
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
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: #000;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 2px;
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        font-weight: 600;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
    `;
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
        ? '<div style="padding: 2rem; text-align: center; color: #999;">Keranjang Anda kosong</div>'
        : cart.map((item, index) => `
        <div style="padding: 1rem; border-bottom: 1px solid #eee; display: flex; gap: 1rem;">
            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; background: #f5f5f5; border-radius: 4px;">
            <div style="flex: 1;">
                <h4 style="font-weight: 700; margin-bottom: 0.25rem; font-size: 0.95rem;">${item.name}</h4>
                <p style="font-size: 0.85rem; color: #666; margin-bottom: 0.5rem;">$${item.price} x ${item.quantity}</p>
                <button onclick="removeFromCart(${index})" style="background: none; border: none; color: #999; cursor: pointer; font-size: 0.8rem; text-decoration: underline;">Hapus</button>
            </div>
            <div style="font-weight: 700; font-size: 0.9rem;">$${(item.price * item.quantity).toFixed(2)}</div>
        </div>
    `).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const html = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 200;" id="cartPanelOverlay" onclick="closeCartPanel()"></div>
        <div style="position: fixed; top: 0; right: 0; width: 400px; height: 100vh; background: white; z-index: 201; display: flex; flex-direction: column; box-shadow: -2px 0 10px rgba(0,0,0,0.1);" id="cartPanel">
            <div style="padding: 1.5rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 1.2rem; font-weight: 800;">KERANJANG</h3>
                <button onclick="closeCartPanel()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">×</button>
            </div>
            <div style="flex: 1; overflow-y: auto;">
                ${cartItemsHTML}
            </div>
            <div style="padding: 1.5rem; border-top: 1px solid #eee;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 1rem; font-size: 1.1rem; font-weight: 800;">
                    <span>TOTAL:</span>
                    <span>$${total.toFixed(2)}</span>
                </div>
                <button onclick="window.location.href='cart.html'" style="width: 100%; padding: 1rem; background: #000; color: white; border: none; cursor: pointer; font-weight: 700; text-transform: uppercase; border-radius: 2px; font-size: 0.9rem;">Lihat Keranjang Lengkap</button>
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
        ? '<div style="padding: 2rem; text-align: center; color: #999;">Wishlist Anda kosong</div>'
        : wishlist.map((item, index) => `
        <div style="padding: 1rem; border-bottom: 1px solid #eee; display: flex; gap: 1rem;">
            <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; background: #f5f5f5; border-radius: 4px;">
            <div style="flex: 1;">
                <h4 style="font-weight: 700; margin-bottom: 0.25rem; font-size: 0.95rem;">${item.name}</h4>
                <p style="font-size: 0.85rem; color: #666; margin-bottom: 0.5rem;">$${item.price}</p>
                <div style="display: flex; gap: 1rem;">
                    <button onclick="removeFromWishlist(${index})" style="background: none; border: none; color: #999; cursor: pointer; font-size: 0.8rem; text-decoration: underline; padding: 0;">Hapus</button>
                    <button onclick="moveToCart(${index})" style="background: none; border: none; color: #000; cursor: pointer; font-size: 0.8rem; text-decoration: underline; font-weight: 700; padding: 0;">Ke Keranjang</button>
                </div>
            </div>
        </div>
    `).join('');

    const html = `
        <div style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 200;" id="wishlistPanelOverlay" onclick="closeWishlistPanel()"></div>
        <div style="position: fixed; top: 0; left: 0; width: 400px; height: 100vh; background: white; z-index: 201; display: flex; flex-direction: column; box-shadow: 2px 0 10px rgba(0,0,0,0.1);" id="wishlistPanel">
            <div style="padding: 1.5rem; border-bottom: 1px solid #eee; display: flex; justify-content: space-between; align-items: center;">
                <h3 style="font-size: 1.2rem; font-weight: 800;">WISHLIST (${wishlist.length})</h3>
                <button onclick="closeWishlistPanel()" style="background: none; border: none; font-size: 1.5rem; cursor: pointer; color: #666;">×</button>
            </div>
            <div style="flex: 1; overflow-y: auto;">
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
    const product = products.find(p => p.id === productId);
    if (product) {
        localStorage.setItem('selectedProduct', JSON.stringify(product));
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
