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

  setLoadingMessage(statusMessage, 'Loading product details...');

  try {
    let product = null;
    try {
      product = await getProductById(productId);
    } catch (error) {
      const fallbackProducts = Array.isArray(window.products) ? window.products : [];
      product = fallbackProducts.find((item) => String(item.id) === String(productId)) || null;
      if (!product) {
        throw error;
      }
    }

    if (!product) {
      throw new Error('Product not found');
    }

    if (title) title.textContent = product.name;
    if (price) price.textContent = formatCurrency(product.price);
    if (description) description.textContent = product.description;
    if (image) {
      image.src = product.image;
      image.alt = product.name;
    }

    const mobileCtaText = document.querySelector('.fixed.bottom-0 button.bg-primary');
    if (mobileCtaText) {
      mobileCtaText.textContent = `ADD TO CART • ${formatCurrency(product.price)}`;
    }

    const handleAddToCart = async (event) => {
      if (event) event.preventDefault();
      try {
        const selectedSizeBtn = document.querySelector('.grid.grid-cols-4 button.bg-primary, .grid.grid-cols-5 button.bg-primary') || document.querySelector('.grid.grid-cols-4 button, .grid.grid-cols-5 button');
        const sizeText = selectedSizeBtn ? selectedSizeBtn.textContent.trim() : '09';

        await addCartItem({
          productId: product.id,
          quantity: 1,
          name: product.name,
          price: product.price,
          image: product.image,
          size: `${sizeText} US`,
          sku: `LAB-${String(product.id).padStart(3, '0')}`
        });

        if (window.showToast) {
          window.showToast(`${product.name} added to cart!`, 'success');
        } else {
          setMessage(statusMessage, 'Item added to cart.', 'success');
        }
        if (window.updateCartBadge) window.updateCartBadge();
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
  } catch (error) {
    if (window.showToast) {
      window.showToast(error.message || 'Details retrieval failed.', 'error');
    } else {
      setMessage(statusMessage, error.message, 'error');
    }
  }
});
