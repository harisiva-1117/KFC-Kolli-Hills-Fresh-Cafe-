// API client for Kolli Hills Fresh Cafe (customer + admin)

const BASE = process.env.REACT_APP_BACKEND_URL;
const TOKEN_KEY = "khfc_admin_token";

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

// Convert an image URL that may be app-relative (e.g. "/api/uploads/xxx.jpg")
// into an absolute URL usable from the browser. External URLs are returned as-is.
export const resolveImageUrl = (url) => {
  if (!url) return url;
  if (/^https?:\/\//i.test(url) || url.startsWith("data:")) return url;
  if (url.startsWith("/")) return `${BASE}${url}`;
  return url;
};

const request = async (path, options = {}) => {
  const url = `${BASE}/api${path}`;
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (options.auth) {
    const token = getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(url, { ...options, headers });
  if (!res.ok) {
    let detail = res.statusText;
    try {
      const data = await res.json();
      detail = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
    } catch {
      /* ignore */
    }
    const err = new Error(detail || `Request failed with ${res.status}`);
    err.status = res.status;
    throw err;
  }
  if (res.status === 204) return null;
  return res.json();
};

export const api = {
  // Public
  listCategories: (activeOnly = true) => request(`/categories?active_only=${activeOnly}`),
  getCategory: (slug) => request(`/categories/${slug}`),
  listProducts: ({ category, bestSeller, availableOnly = true, limit = 500 } = {}) => {
    const p = new URLSearchParams();
    if (category) p.set("category", category);
    if (bestSeller !== undefined) p.set("best_seller", String(bestSeller));
    p.set("available_only", String(availableOnly));
    p.set("limit", String(limit));
    return request(`/products?${p.toString()}`);
  },
  getProduct: (slug) => request(`/products/${slug}`),
  createOrder: (body) => request(`/orders`, { method: "POST", body: JSON.stringify(body) }),
  getOrder: (orderId) => request(`/orders/${orderId}`),

  // Auth
  login: (email, password) =>
    request(`/auth/login`, { method: "POST", body: JSON.stringify({ email, password }) }),
  me: () => request(`/auth/me`, { auth: true }),

  // Admin — Categories
  adminCreateCategory: (body) =>
    request(`/categories`, { method: "POST", body: JSON.stringify(body), auth: true }),
  adminUpdateCategory: (slug, body) =>
    request(`/categories/${slug}`, { method: "PATCH", body: JSON.stringify(body), auth: true }),
  adminDeleteCategory: (slug) =>
    request(`/categories/${slug}`, { method: "DELETE", auth: true }),
  adminListCategories: () => request(`/categories?active_only=false`, { auth: true }),

  // Admin — Products
  adminListProducts: () => request(`/products?available_only=false&limit=1000`, { auth: true }),
  adminCreateProduct: (body) =>
    request(`/products`, { method: "POST", body: JSON.stringify(body), auth: true }),
  adminUpdateProduct: (slug, body) =>
    request(`/products/${slug}`, { method: "PATCH", body: JSON.stringify(body), auth: true }),
  adminDeleteProduct: (slug) =>
    request(`/products/${slug}`, { method: "DELETE", auth: true }),

  // Admin — Orders
  adminListOrders: (statusFilter) => {
    const qs = statusFilter ? `?status=${statusFilter}` : "";
    return request(`/admin/orders${qs}`, { auth: true });
  },
  adminOrderStats: () => request(`/admin/orders/stats`, { auth: true }),
  adminUpdateOrderStatus: (orderId, status) =>
    request(`/admin/orders/${orderId}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
      auth: true,
    }),

  // Admin — Uploads
  adminUploadImage: async (file) => {
    const token = getToken();
    const form = new FormData();
    form.append("file", file);
    const res = await fetch(`${BASE}/api/admin/upload`, {
      method: "POST",
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      body: form,
    });
    if (!res.ok) {
      let detail = res.statusText;
      try {
        const data = await res.json();
        detail = typeof data.detail === "string" ? data.detail : JSON.stringify(data.detail);
      } catch {
        /* ignore */
      }
      throw new Error(detail);
    }
    return res.json();
  },
};

export default api;
