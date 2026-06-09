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
    cartItemsContainer.innerHTML = cart.map((item, index) => `
        <div class="cart-item">
            <div class="cart-col-item">
                <div class="cart-item-info">
                    <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                    <div class="cart-item-details">
                        <h3>${item.name}</h3>
                        <p>SKU: PROD-${String(item.id).padStart(4, '0')}</p>
                    </div>
                </div>
            </div>
            <div class="cart-col-variant">
                <select class="variant-select" onchange="updateItemVariant(${index}, 'size', this.value)">
                    ${products.find(p => p.id === item.id).sizes.map(size => `
                        <option value="${size}" ${item.selectedSize === size ? 'selected' : ''}>${size}</option>
                    `).join('')}
                </select>
            </div>
            <div class="cart-col-qty">
                <div class="qty-control">
                    <button onclick="updateQuantity(${index}, -1)">−</button>
                    <input type="number" value="${item.quantity}" min="1" readonly>
                    <button onclick="updateQuantity(${index}, 1)">+</button>
                </div>
            </div>
            <div class="cart-col-price">$${(item.price * item.quantity).toFixed(2)}</div>
            <div class="cart-col-action">
                <button class="remove-btn" onclick="removeFromCart(${index})" title="Remove">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="3 6 5 6 21 6"></polyline>
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
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
        
        alert(`Kode promo "${code}" berhasil! Diskon ${(discount * 100).toFixed(0)}% = $${discountAmount.toFixed(2)}`);
        promoInput.value = '';
        
        // You could implement actual discount functionality here
        updateCartSummary();
    } else {
        alert('Kode promo tidak valid');
    }
}

function proceedToCheckout() {
    if (cart.length === 0) {
        alert('Keranjang Anda kosong');
        return;
    }

    const total = document.getElementById('total').textContent;
    let paymentMethod = '1';

    try {
        if (typeof window !== 'undefined' && typeof window.prompt === 'function') {
            paymentMethod = window.prompt('Pilih metode pembayaran:\n1. Transfer Bank\n2. QRIS\n3. COD\n\nMasukkan angka 1/2/3', '1');
        }
    } catch (error) {
        paymentMethod = '1';
    }

    const paymentLabel = {
        '1': 'Transfer Bank',
        '2': 'QRIS',
        '3': 'COD'
    }[paymentMethod?.trim()] || 'Transfer Bank';

    alert(`Pembayaran berhasil dipilih!\nMetode: ${paymentLabel}\nTotal: ${total}\n\nPesanan Anda akan segera diproses.`);
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
