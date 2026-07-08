// Catalog page specific script
let currentPage = 1;
const itemsPerPage = 12;
let filteredProducts = [...products];

document.addEventListener('DOMContentLoaded', function() {
    initializeCatalog();
    setupSearchCatalog();
    setupCatalogSearchBox();
});

// Product Card Creation (duplicated from script.js for catalog functionality)
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

function setupSearchCatalog() {
    const searchQuery = localStorage.getItem('searchQuery');
    if (searchQuery) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = searchQuery;
            applyFilters();
            localStorage.removeItem('searchQuery');
        }
    }
}

function setupCatalogSearchBox() {
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');

    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                applyFilters();
            }
        });
    }

    if (searchBtn) {
        searchBtn.addEventListener('click', function(e) {
            e.preventDefault();
            applyFilters();
        });
    }
}

function setupSearch() {
    const searchQuery = localStorage.getItem('searchQuery');
    if (searchQuery) {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = searchQuery;
            applyFilters();
            localStorage.removeItem('searchQuery');
        }
    }
}

function initializeCatalog() {
    setupFilters();
    displayProducts();
}

function setupFilters() {
    // Sort filter
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            applySort(this.value);
        });
    }

    // Category filters
    const categoryFilters = document.querySelectorAll('.category-filter');
    categoryFilters.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Size buttons
    const sizeButtons = document.querySelectorAll('.size-btn');
    sizeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            applyFilters();
        });
    });

    // Color buttons
    const colorButtons = document.querySelectorAll('.color-btn');
    colorButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            this.classList.toggle('active');
            applyFilters();
        });
    });

    // Price range
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    if (minPrice && maxPrice) {
        minPrice.addEventListener('change', applyFilters);
        maxPrice.addEventListener('change', applyFilters);
    }

    // Reset filters
    const resetBtn = document.querySelector('.reset-filters');
    if (resetBtn) {
        resetBtn.addEventListener('click', function(e) {
            e.preventDefault();
            resetAllFilters();
        });
    }
}

function applyFilters() {
    // Get search query
    const searchInput = document.getElementById('searchInput');
    const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';

    // Get selected categories
    const selectedCategories = Array.from(document.querySelectorAll('.category-filter:checked'))
        .map(cb => cb.value);

    // Get selected sizes
    const selectedSizes = Array.from(document.querySelectorAll('.size-btn.active'))
        .map(btn => btn.dataset.size.toString().toLowerCase());

    // Get selected colors
    const selectedColors = Array.from(document.querySelectorAll('.color-btn.active'))
        .map(btn => btn.dataset.color);

    // Get price range
    const minPrice = parseFloat(document.getElementById('minPrice').value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice').value) || Infinity;

    // Filter products
    filteredProducts = products.filter(product => {
        // Search filter
        if (searchQuery && !product.name.toLowerCase().includes(searchQuery) && 
            !product.description.toLowerCase().includes(searchQuery)) {
            return false;
        }

        // Category filter
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) {
            return false;
        }

        // Price filter
        if (product.price < minPrice || product.price > maxPrice) {
            return false;
        }

        // Size filter
        if (selectedSizes.length > 0) {
            const productSizes = product.sizes.map(size => size.toString().toLowerCase());
            const hasSize = selectedSizes.some(size => productSizes.includes(size));
            if (!hasSize) return false;
        }

        // Color filter
        if (selectedColors.length > 0) {
            const hasColor = selectedColors.some(color => product.colors.includes(color));
            if (!hasColor) return false;
        }

        return true;
    });

    currentPage = 1;
    displayProducts();
}

function applySort(sortType) {
    switch(sortType) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'popular':
            filteredProducts.sort((a, b) => b.reviews - a.reviews);
            break;
        case 'newest':
        default:
            filteredProducts.sort((a, b) => b.id - a.id);
    }

    currentPage = 1;
    displayProducts();
}

function resetAllFilters() {
    // Reset checkboxes
    document.querySelectorAll('.category-filter').forEach(cb => cb.checked = false);
    document.querySelectorAll('.size-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.color-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById('minPrice').value = '';
    document.getElementById('maxPrice').value = '';
    document.getElementById('sortSelect').value = 'newest';

    filteredProducts = [...products];
    currentPage = 1;
    displayProducts();
}

function displayProducts() {
    const container = document.getElementById('productsGrid');
    const totalCount = document.getElementById('totalCount');
    const productCount = document.getElementById('productCount');

    // Update counts
    totalCount.textContent = filteredProducts.length;
    const startIdx = (currentPage - 1) * itemsPerPage;
    const endIdx = Math.min(startIdx + itemsPerPage, filteredProducts.length);
    productCount.textContent = endIdx;

    // Display products for current page
    const pageProducts = filteredProducts.slice(startIdx, endIdx);
    container.innerHTML = pageProducts.map(product => createProductCard(product)).join('');

    // Setup pagination
    generatePagination();
}

function generatePagination() {
    const paginationContainer = document.getElementById('pagination');
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }

    let html = '';

    // Previous button
    if (currentPage > 1) {
        html += `<button onclick="goToPage(${currentPage - 1})">←</button>`;
    }

    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 1 && i <= currentPage + 1)) {
            html += `<button onclick="goToPage(${i})" class="${i === currentPage ? 'active' : ''}">${i}</button>`;
        } else if (i === currentPage - 2 || i === currentPage + 2) {
            html += '<span>...</span>';
        }
    }

    // Next button
    if (currentPage < totalPages) {
        html += `<button onclick="goToPage(${currentPage + 1})">→</button>`;
    }

    paginationContainer.innerHTML = html;
}

function goToPage(page) {
    currentPage = page;
    displayProducts();
    window.scrollTo({ top: 0, behavior: 'smooth' });
}
