// Cart page specific script

document.addEventListener('DOMContentLoaded', function() {
    initializeCart();
    setupSearch();
    updateCartCount();
    updateWishlistCount();
});

function initializeCart() {
    displayCartItems();
    setupCartEventListeners();
    updateCartSummary();
}

function displayCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const emptyMessage = document.getElementById('emptyCartMessage');

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '';
        emptyMessage.style.display = 'block';
        return;
    }

    emptyMessage.style.display = 'none';
    cartItemsContainer.innerHTML = cart.map((item, index) => {
        const product = getProductCatalog().find(p => p.id === item.id);
        const sku = `PROD-${String(item.id).padStart(4, '0')}`;
        return `
            <div class="cart-item flex flex-col md:grid md:grid-cols-[120px_1fr_120px_150px_100px_40px] gap-6 items-center py-8 group border-b border-black/5 transition-all">
                <div class="w-full h-32 md:w-full md:h-24 bg-surface-container-low overflow-hidden rounded-lg">
                    <img src="${item.image}" alt="${item.name}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                </div>
                <div class="flex flex-col w-full">
                    <h3 class="font-display-lg text-xl text-on-background uppercase font-bold">${item.name}</h3>
                    <p class="font-body-md text-xs text-secondary uppercase">SKU: ${sku}</p>
                </div>
                <div class="flex flex-col w-full">
                    <span class="text-secondary font-display-lg text-[10px] uppercase block mb-1">Size</span>
                    <select class="variant-select bg-transparent border-b border-black/10 text-xs font-bold text-primary py-0.5 focus:ring-0 focus:border-primary transition-colors cursor-pointer outline-none w-20" onchange="updateItemVariant(${index}, 'size', this.value)">
                        ${product ? product.sizes.map(size => `
                            <option value="${size}" ${item.selectedSize === size ? 'selected' : ''}>${size}</option>
                        `).join('') : `<option value="${item.selectedSize}">${item.selectedSize}</option>`}
                    </select>
                </div>
                <div class="flex items-center gap-4 bg-white px-4 py-2 w-fit md:w-auto justify-between border border-black/5 rounded-full qty-control">
                    <button class="text-secondary hover:text-primary transition-colors font-bold text-lg" onclick="updateQuantity(${index}, -1)">−</button>
                    <input type="number" class="font-display-lg text-sm w-8 text-center bg-transparent border-none p-0 focus:ring-0" value="${item.quantity}" min="1" readonly>
                    <button class="text-secondary hover:text-primary transition-colors font-bold text-lg" onclick="updateQuantity(${index}, 1)">+</button>
                </div>
                <div class="w-full text-right font-display-lg text-lg text-primary font-bold cart-col-price">$${(item.price * item.quantity).toFixed(2)}</div>
                <button class="text-secondary hover:text-error transition-colors p-1" onclick="removeFromCart(${index})" title="Remove">
                    <span class="material-symbols-outlined">delete</span>
                </button>
            </div>
        `;
    }).join('');
}

function setupCartEventListeners() {
    const shippingSelect = document.getElementById('shippingSelect');
    if (shippingSelect) {
        shippingSelect.addEventListener('change', updateCartSummary);
    }

    const applyPromoBtn = document.getElementById('applyPromo');
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromoCode);
    }

    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', proceedToCheckout);
    }
}

function updateQuantity(index, change) {
    if (index >= 0 && index < cart.length) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            removeFromCart(index);
        } else {
            localStorage.setItem('cart', JSON.stringify(cart));
            updateCartCount();
            displayCartItems();
            updateCartSummary();
        }
    }
}

function updateItemVariant(index, type, value) {
    if (index >= 0 && index < cart.length) {
        if (type === 'size') {
            cart[index].selectedSize = value;
        } else if (type === 'color') {
            cart[index].selectedColor = value;
        }
        localStorage.setItem('cart', JSON.stringify(cart));
    }
}

function removeFromCart(index) {
    if (index >= 0 && index < cart.length) {
        const removedItem = cart[index];
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems();
        updateCartSummary();
        showNotification(`${removedItem.name} dihapus dari keranjang`);
    }
}

function updateCartSummary() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = parseFloat(document.getElementById('shippingSelect').value) || 0;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + shipping + tax;

    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${total.toFixed(2)}`;
}

function applyPromoCode() {
    const promoInput = document.getElementById('promoCode');
    const code = promoInput.value.toUpperCase().trim();

    if (!code) {
        alert('Masukkan kode promo');
        return;
    }

    if (promoCodes[code]) {
        const discount = promoCodes[code];
        const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discountAmount = subtotal * discount;
        
        alert(`Promo code "${code}" applied! Discount ${(discount * 100).toFixed(0)}% = $${discountAmount.toFixed(2)}`);
        promoInput.value = '';
        
        // You could implement actual discount functionality here
        updateCartSummary();
    } else {
        alert('Kode promo tidak valid');
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty. Please add items to continue.');
        return;
    }

    if (!localStorage.getItem('loginUser')) {
        if (typeof window !== 'undefined' && typeof window.openLoginModal === 'function') {
            window.openLoginModal();
        } else {
            showNotification('Please sign in first to continue checkout.');
        }
        return;
    }

    // Save shipping choice and promo code to localStorage for payment.html
    const shippingSelect = document.getElementById('shippingSelect');
    const selectedShipping = shippingSelect ? shippingSelect.value : '0';
    localStorage.setItem('checkout_shipping', selectedShipping);

    const promoCodeInput = document.getElementById('promoCode');
    const promoApplied = promoCodeInput ? promoCodeInput.value.trim() : '';
    localStorage.setItem('checkout_promo', promoApplied);

    // Redirect to the new payment page
    window.location.href = 'payment.html';
}

// Search functionality for cart page
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    const searchQuery = localStorage.getItem('searchQuery');
    if (searchQuery && searchInput) {
        searchInput.value = searchQuery;
        localStorage.removeItem('searchQuery');
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
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
