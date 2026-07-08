document.addEventListener('DOMContentLoaded', async () => {
  const cartItemsContainer = document.querySelector('[data-cart-items]');
  const summary = document.querySelector('[data-cart-summary]');
  const totalDisplay = document.querySelector('[data-cart-total]');
  const statusMessage = document.querySelector('[data-cart-status]');
  const checkoutBtn = document.querySelector('[data-checkout-btn]');

  let cartItemCount = 0;

  async function renderCart() {
    if (statusMessage) {
      setLoadingMessage(statusMessage, 'Loading your cart...');
    }

    try {
      const { items, total } = await getCart();
      if (!cartItemsContainer) return;
      cartItemsContainer.innerHTML = '';
      cartItemCount = items ? items.length : 0;

      if (statusMessage) {
        statusMessage.innerHTML = '';
      }

      if (!items || !items.length) {
        cartItemsContainer.innerHTML = `
          <div class="py-lg text-center">
            <span class="material-symbols-outlined text-[48px] text-secondary opacity-30 mb-sm">shopping_cart</span>
            <p class="font-display-lg text-sm text-secondary uppercase tracking-widest">Your cart is currently empty.</p>
          </div>`;
        if (summary) summary.textContent = formatCurrency(0);
        if (totalDisplay) totalDisplay.textContent = formatCurrency(0);
        return;
      }

      items.forEach((item) => {
        const row = document.createElement('div');
        row.className = 'flex flex-col md:grid md:grid-cols-[120px_1fr_120px_150px_100px_40px] gap-6 items-center py-8 border-b border-black/5 transition-all duration-300';
        row.innerHTML = `
          <div class="w-full h-32 md:w-full md:h-24 bg-surface-container-low overflow-hidden rounded-lg">
            <img alt="${item.name}" class="w-full h-full object-cover" src="${item.image}">
          </div>
          <div class="flex flex-col w-full">
            <h3 class="font-display-lg text-xl text-on-background uppercase">${item.name}</h3>
            <p class="font-body-md text-xs text-secondary uppercase">SKU: ${item.sku}</p>
          </div>
          <div class="flex flex-col w-full">
            <span class="text-secondary font-display-lg text-[10px] uppercase">Size</span>
            <span class="font-display-lg text-lg">${item.size}</span>
          </div>
          <div class="flex items-center gap-4 bg-white px-4 py-2 w-fit md:w-auto justify-between border border-black/5 rounded-full">
            <button class="text-secondary hover:text-primary transition-colors" data-action="decrease" data-id="${item.id}"><span class="material-symbols-outlined text-[18px]">remove</span></button>
            <span class="font-display-lg text-sm w-8 text-center">${item.quantity}</span>
            <button class="text-secondary hover:text-primary transition-colors" data-action="increase" data-id="${item.id}"><span class="material-symbols-outlined text-[18px]">add</span></button>
          </div>
          <div class="w-full text-right font-display-lg text-lg text-primary">${formatCurrency(item.price * item.quantity)}</div>
          <button class="text-secondary hover:text-error transition-colors p-1" data-action="remove" data-id="${item.id}"><span class="material-symbols-outlined">delete</span></button>`;
        cartItemsContainer.appendChild(row);
      });

      if (summary) summary.textContent = formatCurrency(total);
      if (totalDisplay) totalDisplay.textContent = formatCurrency(total);
    } catch (error) {
      if (statusMessage) {
        setMessage(statusMessage, error.message || 'Failed to retrieve cart items.', 'error');
      }
    }
  }

  // Handle quantity changes and row removals
  cartItemsContainer?.addEventListener('click', async (event) => {
    const actionButton = event.target.closest('button[data-action]');
    if (!actionButton) return;

    const id = actionButton.getAttribute('data-id');
    const action = actionButton.getAttribute('data-action');

    try {
      if (action === 'remove') {
        const row = actionButton.closest('.flex.flex-col.md\\:grid');
        if (row) {
          // Row deletion animation
          row.style.opacity = '0';
          row.style.transform = 'translateX(-20px)';
          setTimeout(async () => {
            try {
              await removeCartItem(id);
              await renderCart();
              if (window.updateCartBadge) window.updateCartBadge();
            } catch (err) {
              if (statusMessage) setMessage(statusMessage, err.message, 'error');
            }
          }, 300);
        }
      } else if (action === 'increase') {
        await updateCartItem(id, { quantity: 1 });
        await renderCart();
        if (window.updateCartBadge) window.updateCartBadge();
      } else if (action === 'decrease') {
        await updateCartItem(id, { quantity: -1 });
        await renderCart();
        if (window.updateCartBadge) window.updateCartBadge();
      }
    } catch (error) {
      if (statusMessage) {
        setMessage(statusMessage, error.message || 'Cart operation failed.', 'error');
      }
    }
  });

  // Handle Checkout button click
  if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async (e) => {
      e.preventDefault();

      if (cartItemCount === 0) {
        if (window.showToast) {
          window.showToast('Your archive cart is empty. Cannot initialize checkout.', 'error');
        } else {
          alert('Your cart is empty.');
        }
        return;
      }

      try {
        const originalText = checkoutBtn.textContent;
        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'SECURE DEPLOYMENT INITIALIZING...';

        await clearCart();
        
        if (window.showToast) {
          window.showToast('SECURE CHECKOUT COMPLETED. ORDER DEPLOYED!', 'success');
        } else {
          alert('Checkout completed successfully!');
        }

        // Reset button state and re-render empty cart
        checkoutBtn.disabled = false;
        checkoutBtn.textContent = originalText;

        await renderCart();
        if (window.updateCartBadge) window.updateCartBadge();
      } catch (err) {
        checkoutBtn.disabled = false;
        if (window.showToast) {
          window.showToast(err.message || 'Checkout failed.', 'error');
        } else {
          alert('Checkout failed.');
        }
      }
    });
  }

  await renderCart();
});
