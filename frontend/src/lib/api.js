// API client for Kolli Hills Fresh Cafe

const BASE = process.env.REACT_APP_BACKEND_URL;

const request = async (path, options = {}) => {
  const url = `${BASE}/api${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  if (res.status === 204) return null;
  return res.json();
};

export const api = {
  listCategories: (activeOnly = true) =>
    request(`/categories?active_only=${activeOnly}`),
  getCategory: (slug) => request(`/categories/${slug}`),

  listProducts: ({ category, bestSeller, availableOnly = true, limit = 200 } = {}) => {
    const p = new URLSearchParams();
    if (category) p.set("category", category);
    if (bestSeller !== undefined) p.set("best_seller", String(bestSeller));
    p.set("available_only", String(availableOnly));
    p.set("limit", String(limit));
    return request(`/products?${p.toString()}`);
  },
  getProduct: (slug) => request(`/products/${slug}`),

  createOrder: (body) =>
    request(`/orders`, { method: "POST", body: JSON.stringify(body) }),
  getOrder: (orderId) => request(`/orders/${orderId}`),
};

export default api;
