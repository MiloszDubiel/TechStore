import axios from "axios";

const API = "/api/admin";

export const getUsers = async (token: string) => {
  const { data } = await axios.get(`${API}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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
export const banUser = (id: number, token: string) =>
  axios.patch(`/api/admin/users/ban/${id}/`, null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

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

  const response = await axios.patch(`/api/admin/users/${data.id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const unactiveUser = async (id: any, token: string) => {
  const response = await axios.patch(`/api/admin/users/unactive/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
