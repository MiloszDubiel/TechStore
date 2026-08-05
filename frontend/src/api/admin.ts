import { api } from "../axios";

const API = "/api/admin";

export const getUsers = async (params?: {
  page: number | undefined;
  limit: number | undefined;
  search: string | undefined;
}) => {
  const { data } = await api.get(`${API}/users`, {
    params,
  });

  return data;
};

export const getOrders = async (params?: {
  page: number | undefined;
  limit: number | undefined;
  search: string | undefined;
}) => {
  const { data } = await api.get(`${API}/orders`, {
    params,
  });

  return data;
};

export const getAdminOrderDetailsApi = async (id: number) => {
  const { data } = await api.get(`${API}/orders/${id}`, {});

  return data;
};

export const updateAdminOrderStatus = async ({ id, status }: any) => {
  const { data } = await api.patch(`${API}/orders/${id}/status`, {
    status,
  });

  return data;
};
export const deleteUser = async (id: number) => {
  const { data } = await api.delete(`${API}/users/${id}`, {});

  return data;
};
export const banUser = async (id: number) => {
  const { data } = await api.patch(`${API}/users/ban/${id}/`, null, {});

  return data;
};

export const active = async (id: number) => {
  const { data } = await api.patch(`${API}/users/activate/${id}/`, null, {});

  return data;
};
export const updateUserRole = async (payload: { id: number; role: string }) => {
  const { data } = await api.patch(`${API}/users/${payload.id}/role`, {
    role: payload.role,
  });

  return data;
};

export const updateUser = async (data: any) => {
  const response = await api.patch(`${API}/users/${data.id}`, data, {});

  return response.data;
};

export const unactiveUser = async (id: any) => {
  const response = await api.patch(`${API}/users/unactive/${id}`, {});

  return response.data;
};
export const getAdminProducts = async (params?: {
  page: number | undefined;
  limit: number | undefined;
  search: string | undefined;
}) => {
  const { data } = await api.get(`${API}/products`, {
    params,
  });

  return data;
};

export const hideAdminProduct = async (id: number) => {
  const { data } = await api.patch(`${API}/products/${id}/hide`, {});

  return data;
};

export const showAdminProduct = async (id: number) => {
  const { data } = await api.patch(`${API}/products/${id}/show`, {});

  return data;
};

export const deleteAdminProduct = async (id: number) => {
  const { data } = await api.patch(`${API}/products/${id}/delete`, {}, {});

  return data;
};

export const updateSellerData = async ({
  id,
  data,
}: {
  id: number;
  data: FormData;
}) => {
  const response = await api.patch(`${API}/users/${id}/seller`, data, {});

  return response.data;
};

export const updateAdminProduct = async ({
  id,
  formData,
}: {
  id: number;
  formData: any;
}) => {
  const { data } = await api.patch(`${API}/products/${id}`, formData, {});

  return data;
};

export const uploadImage = async (
  productId: string,
  seller_id: string,
  formData: FormData
) => {
  api.post(`${API}/products/${seller_id}/${productId}/images/`, formData, {});
};

export const getSellerById = async (id: number) => {
  const { data } = await api.get(`${API}/users/${id}/seller`, {});

  return data;
};
