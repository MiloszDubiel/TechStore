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
  updateSellerData,
  getSellerById,
  getOrders,
  updateAdminOrderStatus,
  getAdminOrderDetailsApi,
} from "../api/admin";

export const useAdmin = (
  token: string,
  params?: {
    page: number;
    limit: number;
    search: string;
  }
) => {
  const queryClient = useQueryClient();

  const users = useQuery({
    queryKey: ["admin-users", params?.page, params?.limit, params?.search],

    queryFn: () => {
      return getUsers(token, {
        page: params?.page,
        limit: params?.limit,
        search: params?.search,
      });
    },
  });

  const orders = useQuery({
    queryKey: ["admin-orders", params?.page, params?.limit, params?.search],

    queryFn: () =>
      getOrders(token, {
        page: params?.page,
        limit: params?.limit,
        search: params?.search,
      }),
  });

  const getAdminOrderDetails = (id?: number) => {
    return useQuery({
      queryKey: ["admin-order-details", id],

      queryFn: () => getAdminOrderDetailsApi(id!, token),

      enabled: !!id && !!token,
    });
  };

  const updateOrderStatus = useMutation({
    mutationFn: (data: any) => updateAdminOrderStatus(data, token),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
      });
    },
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
    queryKey: ["admin-products", params?.page, params?.limit, params?.search],

    queryFn: () =>
      getAdminProducts(token, {
        page: params?.page,
        limit: params?.limit,
        search: params?.search,
      }),

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

  const updateProduct = useMutation({
    mutationFn: (data: any) => updateAdminProduct(data, token),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
    },
  });

  const updateSeller = useMutation({
    mutationFn: ({ id, data }: any) => updateSellerData({ id, data }, token),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-stores"],
      });
    },
  });

  const getAdminSeller = (token: string, sellerId?: number) => {
    const getSeller = useQuery({
      queryKey: ["seller", sellerId],

      queryFn: () => getSellerById(sellerId!, token),

      enabled: !!sellerId && !!token,
    });

    return {
      getSeller,
    };
  };

  return {
    updateSeller,
    updateProduct,
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
    getAdminSeller,
    updateOrderStatus,
    getAdminOrderDetails,
    orders,
  };
};
