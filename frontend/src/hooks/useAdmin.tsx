import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getUsers,
  deleteUser,
  updateUserRole,
  updateUser,
  banUser,
  active,
  getAdminProducts,
  hideAdminProduct,
  showAdminProduct,
  deleteAdminProduct,
  updateAdminProduct,
} from "../api/admin";

export const useAdmin = (token: string) => {
  const queryClient = useQueryClient();

  const users = useQuery({
    queryKey: ["admin-users"],

    queryFn: () => getUsers(token),
  });

  const removeUser = useMutation({
    mutationFn: (id: number) => deleteUser(id, token),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },
  });

  const changeRole = useMutation({
    mutationFn: (payload: any) => updateUserRole(payload, token),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },
  });

  const editUser = useMutation({
    mutationFn: (data: any) => updateUser(data, token),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },
  });

  const activeUser = useMutation({
    mutationFn: (id: number) => active(id, token),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },
  });

  const BanUser = useMutation({
    mutationFn: (id: number) => banUser(id, token),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },
  });
  const products = useQuery({
    queryKey: ["admin-products"],

    queryFn: () => getAdminProducts(token),

    enabled: !!token,
  });
  const hideProduct = useMutation({
    mutationFn: (id: number) => hideAdminProduct(id, token),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
    },
  });
  const showProduct = useMutation({
    mutationFn: (id: number) => showAdminProduct(id, token),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
    },
  });
  const deleteProduct = useMutation({
    mutationFn: (id: number) => deleteAdminProduct(id, token),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
    },
  });

  const editProduct = useMutation({
    mutationFn: ({ id, editData }: any) =>
      updateAdminProduct(id, editData, token),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
    },
  });
  return {
    editProduct,
    users,
    BanUser,
    editUser,
    removeUser,
    activeUser,
    changeRole,
    products,
    banUser,
    hideProduct,
    showProduct,
    deleteProduct,
  };
};
