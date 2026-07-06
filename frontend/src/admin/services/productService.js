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

export default API;