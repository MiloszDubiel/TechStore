import axios from "axios";

const API = "http://localhost:5000/api/seller";

const token = () => localStorage.getItem("token");

export const getProducts = async () => {
  const { data } = await axios.get(`${API}/products`, {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });

  return data;
};

export const addProduct = async (product: any) => {
  const { data } = await axios.post(`${API}/products`, product, {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });

  return data;
};

export const createStore = async (storeData: any) => {
  const { data } = await axios.post(`${API}/products`, storeData, {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });

  return data;
};

export const updateProduct = async ({
  id,
  product,
}: {
  id: number;
  product: any;
}) => {
  const { data } = await axios.patch(`${API}/products/${id}`, product, {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });

  return data;
};

export const deleteProduct = async (id: number) => {
  const { data } = await axios.delete(`${API}/products/${id}`, {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });

  return data;
};

export const getOrders = async () => {
  const { data } = await axios.get(`${API}/orders`, {
    headers: {
      Authorization: `Bearer ${token()}`,
    },
  });

  return data;
};

export const updateOrderStatus = async ({
  id,
  status,
}: {
  id: number;
  status: string;
}) => {
  const { data } = await axios.patch(
    `${API}/orders/${id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token()}`,
      },
    }
  );

  return data;
};
