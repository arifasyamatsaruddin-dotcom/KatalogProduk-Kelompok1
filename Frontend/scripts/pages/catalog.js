document.addEventListener('DOMContentLoaded', async () => {
  const productGrid = document.querySelector('[data-product-grid]');
  const statusMessage = document.querySelector('[data-status-message]');
  const priceSlider = document.querySelector('[data-price-slider]');
  const priceLabel = document.querySelector('[data-price-label]');
  const sortSelect = document.querySelector('select');
  const searchInput = document.querySelector('[data-search-input]');
  const searchInputMobile = document.querySelector('[data-search-input-mobile]');

  if (!productGrid) return;

  let allProducts = [];
  let selectedCategories = [];
  let selectedSizes = [];
  let selectedColors = [];
  let maxPrice = 500;
  let searchQuery = '';

  setLoadingMessage(statusMessage, 'Loading catalog archives...');

  try {
    const { products } = await getProducts();
    allProducts = products || [];
    statusMessage.innerHTML = '';
    
    // Parse URL params for pre-applied filters on load
    parseUrlParams();
    
    // Set up event listeners
    initEventListeners();

    // Initial render
    filterAndRender();
  } catch (error) {
    setMessage(statusMessage, error.message || 'Failed to fetch catalog.', 'error');
  }

  function parseUrlParams() {
    const searchParam = getQueryParam('search');
    if (searchParam) {
      searchQuery = searchParam.toLowerCase();
      if (searchInput) searchInput.value = searchParam;
      if (searchInputMobile) searchInputMobile.value = searchParam;
    }

    const categoryParam = getQueryParam('category');
    if (categoryParam) {
      // Find checkbox matching category and check it
      const cb = document.querySelector(`[data-filter-category="${categoryParam}"]`);
      if (cb) {
        cb.checked = true;
        selectedCategories.push(categoryParam.toLowerCase());
      }
    }
  }

  function initEventListeners() {
    // 1. Category Checkboxes
    const categoryCheckboxes = document.querySelectorAll('[data-filter-category]');
    categoryCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        selectedCategories = Array.from(document.querySelectorAll('[data-filter-category]:checked'))
          .map(el => el.getAttribute('data-filter-category').toLowerCase());
        filterAndRender();
      });
    });

    // 2. Spec Size Buttons (EU)
    const sizeButtons = document.querySelectorAll('[data-filter-size]');
    sizeButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const sizeVal = btn.getAttribute('data-filter-size');
        
        if (selectedSizes.includes(sizeVal)) {
          selectedSizes = selectedSizes.filter(s => s !== sizeVal);
          // Revert style
          btn.className = 'border border-black/10 bg-white py-xs text-label-sm hover:border-primary hover:text-primary transition-all';
        } else {
          selectedSizes.push(sizeVal);
          // Active style
          btn.className = 'border border-primary bg-primary text-white py-xs text-label-sm';
        }
        filterAndRender();
      });
    });

    // 3. Color Swatch Buttons
    const colorSwatches = document.querySelectorAll('[data-filter-color]');
    colorSwatches.forEach(swatch => {
      swatch.addEventListener('click', (e) => {
        e.preventDefault();
        const colorVal = swatch.getAttribute('data-filter-color');

        if (selectedColors.includes(colorVal)) {
          selectedColors = selectedColors.filter(c => c !== colorVal);
          swatch.style.ringColor = 'transparent';
          swatch.classList.remove('ring-2', 'ring-primary');
        } else {
          selectedColors.push(colorVal);
          swatch.classList.add('ring-2', 'ring-primary');
        }
        filterAndRender();
      });
    });

    // 4. Price Slider
    if (priceSlider) {
      priceSlider.addEventListener('input', (e) => {
        maxPrice = Number(e.target.value);
        if (priceLabel) {
          priceLabel.textContent = `$0 — $${maxPrice}`;
        }
        filterAndRender();
      });
    }

    // 5. Sort Select
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        filterAndRender();
      });
    }

    // 6. Real-time Search Input typing (if search is typed directly on catalog page)
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        filterAndRender();
      });
    }
    if (searchInputMobile) {
      searchInputMobile.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        filterAndRender();
      });
    }
  }

  function filterAndRender() {
    // Perform Filtering
    let filtered = allProducts.filter(product => {
      // Search Match
      const matchesSearch = searchQuery === '' || 
        product.name.toLowerCase().includes(searchQuery) ||
        product.category.toLowerCase().includes(searchQuery) ||
        product.description.toLowerCase().includes(searchQuery);

      // Category Match
      const matchesCategory = selectedCategories.length === 0 || 
        selectedCategories.includes(product.category.toLowerCase());

      // Size Match
      const matchesSize = selectedSizes.length === 0 || 
        product.sizes.some(size => selectedSizes.includes(String(size)));

      // Color Match
      const matchesColor = selectedColors.length === 0 || 
        product.colors.some(color => selectedColors.includes(color.toLowerCase()));

      // Price Match
      const matchesPrice = product.price <= maxPrice;

      return matchesSearch && matchesCategory && matchesSize && matchesColor && matchesPrice;
    });

    // Perform Sorting
    const sortBy = sortSelect ? sortSelect.value : 'newest';
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'trending' || sortBy === 'newest') {
      // Simulating sorts based on rating/id
      filtered.sort((a, b) => b.rating - a.rating || b.id - a.id);
    }

    // Render results
    renderProducts(filtered);
  }

  function renderProducts(products) {
    productGrid.innerHTML = '';
    
    // Update count indicator
    const countLabel = document.querySelector('section.flex-1 p.font-body-md.text-secondary');
    if (countLabel) {
      countLabel.textContent = `Showing ${products.length} specimen${products.length !== 1 ? 's' : ''}`;
    }

    if (products.length === 0) {
      productGrid.innerHTML = `
        <div class="col-span-full py-xl text-center">
          <span class="material-symbols-outlined text-[48px] text-secondary opacity-40 mb-md">sentiment_dissatisfied</span>
          <p class="font-display-lg text-lg uppercase tracking-widest text-secondary">No matching laboratory specimens found.</p>
        </div>
      `;
      return;
    }

    products.forEach((product) => {
      const card = document.createElement('article');
      card.className = 'group relative bg-white border border-black/5 overflow-hidden transition-all duration-500 hover:shadow-xl hover:translate-y-[-8px] product-card';
      card.innerHTML = `
        <div class="absolute top-md left-md z-10">
          <span class="bg-primary text-white text-[10px] px-sm py-1 font-bold uppercase tracking-widest">${product.badge || 'NEW'}</span>
        </div>
        <div class="absolute top-md right-md z-10">
          <button class="material-symbols-outlined text-secondary hover:text-primary transition-colors" data-icon="favorite">favorite</button>
        </div>
        <a href="product-detail.html?id=${product.id}" class="aspect-[4/5] bg-surface-container-low flex items-center justify-center overflow-hidden">
          <img alt="${product.name}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 product-card__image" src="${product.image}">
        </a>
        <div class="p-md flex flex-col gap-xs">
          <div class="flex justify-between items-start">
            <h3 class="font-display-lg text-label-md uppercase text-on-background tracking-tight">
              <a href="product-detail.html?id=${product.id}" class="hover:text-primary transition-colors">${product.name}</a>
            </h3>
            <div class="flex items-center gap-1 text-primary">
              <span class="material-symbols-outlined text-[14px]" style="font-variation-settings: 'FILL' 1;">star</span>
              <span class="text-label-sm">${product.rating}</span>
            </div>
          </div>
          <p class="font-body-md text-secondary uppercase text-[10px] tracking-widest">${product.category}</p>
          <div class="mt-md flex justify-between items-center">
            <span class="font-display-lg text-headline-md text-primary">$${product.price}</span>
            <button class="bg-primary text-white w-10 h-10 flex items-center justify-center hover:bg-primary-container transition-all active:scale-95 rounded-full" data-action-add-cart data-id="${product.id}">
              <span class="material-symbols-outlined text-[20px]">add_shopping_cart</span>
            </button>
          </div>
        </div>`;
      productGrid.appendChild(card);
    });
  }
});
