import { api } from "../axios";

const API = "/api/seller";

export const getProducts = async (params: any) => {
  const { data } = await api.get(`${API}/products`, {
    params,
  });

  return data;
};

export const getProductsByID = async (id: number) => {
  const { data } = await api.get(`${API}/products/${id}`, {});

  return data;
};

export const getSellerOverview = async () => {
  const { data } = await api.get(`${API}/dashboard/overview`, {});

  return data;
};

export const addProduct = async (product: any) => {
  const { data } = await api.post(`${API}/products`, product, {});

  return data;
};

export const getCategories = async () => {
  const { data } = await api.get(`/api/products/categories`);

  return data;
};

export const uploadImage = async (productId: string, formData: FormData) => {
  api.post(`${API}/products/${productId}/images`, formData, {});
};

export const getCompanyInfo = async () => {
  const { data } = await api.get(`${API}/get-my-profile`);

  return data.profile;
};

export const getSubcategories = async () => {
  const { data } = await api.get(`http://localhost:5000/api/products/subcategories`);

  return data;
};

export const createStore = async (storeData: FormData) => {
  const { data } = await api.post(`${API}/create`, storeData);

  return data;
};

export const updateProduct = async ({ id, product }: { id: number; product: any }) => {
  const { data } = await api.patch(`${API}/products/${id}`, product);

  return data;
};

export const deleteProduct = async (id: number) => {
  const { data } = await api.delete(`${API}/products/${id}`);

  return data;
};

export const editProfile = async (data: FormData) => {
  const response = await api.patch(`${API}/edit-profile`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
};

export const getOrders = async () => {
  const { data } = await api.get(`${API}/orders`);

  return data;
};

export const updateOrderStatus = async ({ id, status }: { id: number; status: string }) => {
  const { data } = await api.patch(`${API}/orders/${id}/status`, { status });

  return data;
};
export const getOrderDetails = async (id: number) => {
  const { data } = await api.get(`${API}/orders/${id}`);

  return data;
};
