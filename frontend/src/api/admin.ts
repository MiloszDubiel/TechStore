import axios from "axios";

const API = "/api/admin";

export const getUsers = async (
  token: string,
  params?: {
    page: number;
    limit: number;
    search: string;
  }
) => {
  const { data } = await axios.get(`${API}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });

  return data;
};

export const getOrders = async (
  token: string,
  params?: {
    page: number;
    limit: number;
    search: string;
  }
) => {
  const { data } = await axios.get(`${API}/orders`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });

  return data;
};

export const getAdminOrderDetailsApi = async (id: number, token: string) => {
  const { data } = await axios.get(`${API}/orders/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const updateAdminOrderStatus = async (
  { id, status }: any,
  token: string
) => {
  const { data } = await axios.patch(
    `${API}/orders/${id}/status`,

    {
      status,
    },

    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};
export const deleteUser = async (id: number, token: string) => {
  const { data } = await axios.delete(`${API}/users/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};
export const banUser = async (id: number, token: string) => {
  const { data } = await axios.patch(`${API}/users/ban/${id}/`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const active = async (id: number, token: string) => {
  const { data } = await axios.patch(`${API}/users/activate/${id}/`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};
export const updateUserRole = async (
  payload: { id: number; role: string },
  token: string
) => {
  const { data } = await axios.patch(
    `${API}/users/${payload.id}/role`,
    {
      role: payload.role,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const updateUser = async (data: any, token: string) => {
  console.log(data);

  const response = await axios.patch(`${API}/users/${data.id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const unactiveUser = async (id: any, token: string) => {
  const response = await axios.patch(`${API}/users/unactive/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
export const getAdminProducts = async (
  token: string,
  params?: {
    page: number;
    limit: number;
    search: string;
  }
) => {
  const { data } = await axios.get(`${API}/products`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params,
  });

  return data;
};

export const hideAdminProduct = async (id: number, token: string) => {
  const { data } = await axios.patch(
    `${API}/products/${id}/hide`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const showAdminProduct = async (id: number, token: string) => {
  const { data } = await axios.patch(
    `${API}/products/${id}/show`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const deleteAdminProduct = async (id: number, token: string) => {
  const { data } = await axios.patch(
    `${API}/products/${id}/delete`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};

export const updateSellerData = async (
  {
    id,
    data,
  }: {
    id: number;
    data: FormData;
  },
  token: string
) => {
  const response = await axios.patch(`${API}/users/${id}/seller`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const updateAdminProduct = async (
  {
    id,
    formData,
  }: {
    id: number;
    formData: any;
  },
  token: string
) => {
  const { data } = await axios.patch(`${API}/products/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const uploadImage = async (
  productId: string,
  seller_id: string,
  formData: FormData,
  token: string
) => {
  axios.post(`${API}/products/${seller_id}/${productId}/images/`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getSellerById = async (id: number, token: string) => {
  const { data } = await axios.get(`${API}/users/${id}/seller`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};
