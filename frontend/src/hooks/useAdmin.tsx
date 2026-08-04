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
      return getUsers( {
        page: params?.page,
        limit: params?.limit,
        search: params?.search,
      });
    },
  });

  const orders = useQuery({
    queryKey: ["admin-orders", params?.page, params?.limit, params?.search],

    queryFn: () =>
      getOrders({
        page: params?.page,
        limit: params?.limit,
        search: params?.search,
      }),
  });

  const getAdminOrderDetails = (id?: number) => {
    return useQuery({
      queryKey: ["admin-order-details", id],

      queryFn: () => getAdminOrderDetailsApi(id!),

      enabled: !!id ,
    });
  };

  const updateOrderStatus = useMutation({
    mutationFn: (data: any) => updateAdminOrderStatus(data, ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-orders"],
      });
    },
  });

  const removeUser = useMutation({
    mutationFn: (id: number) => deleteUser(id, ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },
  });

  const changeRole = useMutation({
    mutationFn: (payload: any) => updateUserRole(payload, ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },
  });

  const editUser = useMutation({
    mutationFn: (data: any) => updateUser(data, ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },
  });

  const activeUser = useMutation({
    mutationFn: (id: number) => active(id, ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },
  });

  const BanUser = useMutation({
    mutationFn: (id: number) => banUser(id, ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },
  });
  const products = useQuery({
    queryKey: ["admin-products", params?.page, params?.limit, params?.search],

    queryFn: () =>
      getAdminProducts( {
        page: params?.page,
        limit: params?.limit,
        search: params?.search,
      }),

  
  });
  const hideProduct = useMutation({
    mutationFn: (id: number) => hideAdminProduct(id, ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
    },
  });
  const showProduct = useMutation({
    mutationFn: (id: number) => showAdminProduct(id, ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
    },
  });
  const deleteProduct = useMutation({
    mutationFn: (id: number) => deleteAdminProduct(id, ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
    },
  });

  const updateProduct = useMutation({
    mutationFn: (data: any) => updateAdminProduct(data, ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-products"],
      });
    },
  });

  const updateSeller = useMutation({
    mutationFn: ({ id, data }: any) => updateSellerData({ id, data }, ),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-stores"],
      });
    },
  });

  const getAdminSeller = ( sellerId?: number) => {
    const getSeller = useQuery({
      queryKey: ["seller", sellerId],

      queryFn: () => getSellerById(sellerId!),

      enabled: !!sellerId 
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
