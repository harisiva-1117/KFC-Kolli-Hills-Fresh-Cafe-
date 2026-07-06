import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8001/api",
  headers: {
    "Content-Type": "application/json",
  },
});
export const getCategories = async () => {
  const response = await API.get("/categories");
  return response.data;
};

export const getProducts = async () => {
  const response = await API.get("/products");
  return response.data;
};

export const createProduct = async (product) => {
  const response = await API.post("/products", product);
  return response.data;
};

export const updateProduct = async (slug, product) => {
  const response = await API.patch(`/products/${slug}`, product);
  return response.data;
};

export const deleteProduct = async (slug) => {
  await API.delete(`/products/${slug}`);
};
export const getProduct = async (slug) => {
  const response = await API.get(`/products/${slug}`);
  return response.data;
};
export const createCategory = async (category) => {
  const response = await API.post("/categories", category);
  return response.data;
};

export const updateCategory = async (slug, category) => {
  const response = await API.patch(`/categories/${slug}`, category);
  return response.data;
};

export const deleteCategory = async (slug) => {
  await API.delete(`/categories/${slug}`);
};
export const getCategory = async (slug) => {
  const response = await API.get(`/categories/${slug}`);
  return response.data;
};
export const getOrders = async () => {
  const response = await API.get("/orders");
  return response.data;
};
export const updateOrderStatus = async (id, status) => {
  const response = await API.patch(`/orders/${id}/status`, {
    status,
  });

  return response.data;
};
export default API;