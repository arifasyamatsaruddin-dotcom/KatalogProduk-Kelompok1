const isDevFrontendOnly = window.location.protocol === 'file:' || 
                          ['5500', '5501', '8080', '5173'].includes(window.location.port);

const API_BASE_URL = isDevFrontendOnly ? 'http://localhost:3000/api' : '/api';

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

async function getProducts() {
  return requestJson(`${API_BASE_URL}/products`);
}

async function getProductById(id) {
  return requestJson(`${API_BASE_URL}/products/${id}`);
}

async function addCartItem(item) {
  return requestJson(`${API_BASE_URL}/cart`, {
    method: 'POST',
    body: JSON.stringify(item)
  });
}

async function updateCartItem(id, updates) {
  return requestJson(`${API_BASE_URL}/cart/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  });
}

async function removeCartItem(id) {
  return requestJson(`${API_BASE_URL}/cart/${id}`, {
    method: 'DELETE'
  });
}

async function getCart() {
  return requestJson(`${API_BASE_URL}/cart`);
}

async function clearCart() {
  return requestJson(`${API_BASE_URL}/cart`, {
    method: 'DELETE'
  });
}

async function submitContact(payload) {
  return requestJson(`${API_BASE_URL}/contact`, {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

