document.addEventListener('DOMContentLoaded', async () => {
  const productId = getQueryParam('id') || '1';
  const title = document.querySelector('[data-product-title]');
  const price = document.querySelector('[data-product-price]');
  const description = document.querySelector('[data-product-description]');
  const image = document.querySelector('[data-product-image]');
  const statusMessage = document.querySelector('[data-product-status]');
  const addToCartButtons = document.querySelectorAll('[data-add-to-cart]');

  const sizeButtons = document.querySelectorAll('.grid.grid-cols-4 button, .grid.grid-cols-5 button');
  sizeButtons.forEach((btn) => {
    if (btn.classList.contains('cursor-not-allowed') || btn.classList.contains('opacity-30')) return;
    btn.addEventListener('click', () => {
      sizeButtons.forEach((b) => {
        if (b.classList.contains('cursor-not-allowed') || b.classList.contains('opacity-30')) return;
        b.className = 'border border-outline-variant py-md text-label-md hover:border-primary hover:text-primary transition-all';
      });
      btn.className = 'border-2 border-primary bg-primary text-on-primary py-md text-label-md font-bold';
    });
  });

  // Local database search first (instant, zero-delay rendering)
  const fallbackProducts = typeof products !== 'undefined' ? products : (Array.isArray(window.products) ? window.products : []);
  let product = fallbackProducts.find((item) => String(item.id) === String(productId)) || null;

  if (product) {
    renderProductDetails(product);
  } else {
    setLoadingMessage(statusMessage, 'Loading product details...');
  }

  // Fetch from API in background or fallback if not loaded yet
  try {
    const apiProduct = await getProductById(productId);
    if (apiProduct) {
      product = apiProduct;
      renderProductDetails(product);
    }
  } catch (error) {
    console.warn('API lookup failed, relying on local product data:', error);
    if (!product) {
      if (window.showToast) {
        window.showToast('Product not found.', 'error');
      } else {
        setMessage(statusMessage, 'Product not found.', 'error');
      }
    }
  }

  function renderProductDetails(p) {
    if (title) title.textContent = p.name;
    if (price) price.textContent = formatCurrency(p.price);
    if (description) description.textContent = p.description;
    if (image) {
      image.src = p.image;
      image.alt = p.name;
    }

    // Update thumbnail images dynamically
    const thumbnails = document.querySelectorAll('.hidden.md\\:grid.grid-cols-4.gap-sm.mt-sm img');
    thumbnails.forEach(thumb => {
      thumb.src = p.image;
      thumb.alt = p.name;
    });

    // Populate custom Lab Technology specs
    const techEl = document.querySelector('[data-product-tech]');
    if (techEl) {
      if (p.category === 'lifestyle') {
        techEl.textContent = `The ${p.name} features an advanced lifestyle frame with dual-density foam midsoles, premium mesh ventilation, and custom shock absorption units tailored for maximum daily endurance.`;
      } else if (p.category === 'basketball') {
        techEl.textContent = `The ${p.name} is engineered for high-impact performance. Built with structured leather framing, reinforced ankle collar support, and specialized lab air capsules for maximum court response.`;
      } else if (p.category === 'running') {
        techEl.textContent = `The ${p.name} incorporates ultra-lightweight Lab-Mesh fabric with a carbon fiber spring chassis and energy-returning rubber treads, maximizing running velocity and stride efficiency.`;
      } else {
        techEl.textContent = `The ${p.name} features custom techwear design guidelines including treated weather-resistant upper finishes, reinforced rubber outsoles, and advanced supportive internal lining.`;
      }
    }

    const mobileCtaText = document.querySelector('.fixed.bottom-0 button.bg-primary');
    if (mobileCtaText) {
      mobileCtaText.textContent = `ADD TO CART • ${formatCurrency(p.price)}`;
    }

    // Reset status message once loaded successfully
    if (statusMessage) {
      statusMessage.textContent = '';
      statusMessage.style.display = 'none';
    }
  }

  // Size Chart triggers
  const viewChartBtn = document.querySelector('button.underline');
  const sizeChartModal = document.getElementById('sizeChartModal');
  const closeSizeChartModal = document.getElementById('closeSizeChartModal');

  if (viewChartBtn && sizeChartModal) {
    viewChartBtn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      sizeChartModal.classList.remove('hidden');
    });
  }

  if (closeSizeChartModal && sizeChartModal) {
    closeSizeChartModal.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      sizeChartModal.classList.add('hidden');
    });
  }

  if (sizeChartModal) {
    sizeChartModal.addEventListener('click', (e) => {
      if (e.target === sizeChartModal) {
        sizeChartModal.classList.add('hidden');
      }
    });
  }

  // Accordions Toggle Logic
  const accordionTriggers = document.querySelectorAll('.accordion-trigger');
  accordionTriggers.forEach(trigger => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = trigger.getAttribute('data-target');
      const body = document.getElementById(targetId);
      const icon = trigger.querySelector('.material-symbols-outlined');
      
      if (body) {
        const isHidden = body.classList.contains('hidden');
        if (isHidden) {
          body.classList.remove('hidden');
          icon.style.transform = 'rotate(180deg)';
        } else {
          body.classList.add('hidden');
          icon.style.transform = '';
        }
      }
    });
  });

  const handleAddToCart = async (event) => {
    if (event) event.preventDefault();
    if (!product) return;
    try {
      const selectedSizeBtn = document.querySelector('.grid.grid-cols-4 button.bg-primary, .grid.grid-cols-5 button.bg-primary') || document.querySelector('.grid.grid-cols-4 button, .grid.grid-cols-5 button');
      const sizeText = selectedSizeBtn ? selectedSizeBtn.textContent.trim() : '09';
      const sizeFormatted = `${sizeText} US`;

      try {
        await addCartItem({
          productId: product.id,
          quantity: 1,
          name: product.name,
          price: product.price,
          image: product.image,
          size: sizeFormatted,
          sku: `LAB-${String(product.id).padStart(3, '0')}`
        });
      } catch (apiError) {
        console.warn('API addCartItem failed, falling back to local storage:', apiError);
        // Fallback: update cart in localStorage directly
        let localCart = [];
        try {
          const savedCart = localStorage.getItem('cart');
          if (savedCart) localCart = JSON.parse(savedCart);
        } catch (e) {
          localCart = [];
        }

        let cartItem = localCart.find(item => String(item.id) === String(product.id) && item.selectedSize === sizeFormatted);
        if (cartItem) {
          cartItem.quantity += 1;
        } else {
          localCart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            description: product.description || '',
            quantity: 1,
            selectedSize: sizeFormatted,
            selectedColor: Array.isArray(product.colors) ? product.colors[0] : 'Default'
          });
        }
        localStorage.setItem('cart', JSON.stringify(localCart));
      }

      if (window.showToast) {
        window.showToast(`${product.name} added to cart! Redirecting to checkout...`, 'success');
      } else {
        setMessage(statusMessage, 'Item added to cart.', 'success');
      }
      if (window.updateCartBadge) window.updateCartBadge();

      // Redirect directly to checkout (cart page)
      setTimeout(() => {
        window.location.href = 'cart.html';
      }, 800);

    } catch (error) {
      if (window.showToast) {
        window.showToast(error.message || 'Operation failed.', 'error');
      } else {
        setMessage(statusMessage, error.message, 'error');
      }
    }
  };

  addToCartButtons.forEach((btn) => {
    btn.addEventListener('click', handleAddToCart);
  });

  const mobileBottomButton = document.querySelector('.fixed.bottom-0 button.bg-primary');
  if (mobileBottomButton && !mobileBottomButton.hasAttribute('data-bound')) {
    mobileBottomButton.addEventListener('click', handleAddToCart);
    mobileBottomButton.setAttribute('data-bound', 'true');
  }
});
