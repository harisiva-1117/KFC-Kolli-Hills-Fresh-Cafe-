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
export const getGallery = async () => {
  const response = await API.get("/gallery");
  return response.data;
};

export const createGallery = async (image) => {
  const response = await API.post("/gallery", image);
  return response.data;
};

export const deleteGallery = async (title) => {
  await API.delete(`/gallery/${title}`);
};
export const getMessages = async () => {
  const response = await API.get("/messages");
  return response.data;
};

export const createMessage = async (message) => {
  const response = await API.post("/messages", message);
  return response.data;
};

export const deleteMessage = async (email) => {
  await API.delete(`/messages/${email}`);
};
export const getSettings = async () => {
  const response = await API.get("/settings");
  return response.data;
};

export const updateSettings = async (settings) => {
  const response = await API.put("/settings", settings);
  return response.data;
};
export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await axios.post(
    "http://localhost:8001/api/upload",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
export default API;