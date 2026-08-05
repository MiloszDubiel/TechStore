import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as sellerApi from "../api/seller";
import { useUser } from "./useUser";
import { useAuth } from "../context/AuthContext";

export const useSeller = (params?: {
  page: number;
  limit: number;
  search: string;
}) => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const products = useQuery({
    queryKey: ["seller-products", params?.page, params?.limit, params?.search],
    queryFn: () =>
      sellerApi.getProducts({
        page: params?.page,
        limit: params?.limit,
        search: params?.search,
      }),
    enabled: !!user,
  });

  const productsById = (id: number) =>
    useQuery({
      queryKey: ["seller-products-by-id"],
      queryFn: () => sellerApi.getProductsByID(id),
      enabled: !!user,
    });

  const getOverview = useQuery({
    queryKey: ["seller-overview"],
    queryFn: sellerApi.getSellerOverview,
    enabled: !!user,
  });

  const orders = useQuery({
    queryKey: ["seller-orders"],
    queryFn: sellerApi.getOrders,
    enabled: !!user,
  });

  const addProduct = useMutation({
    mutationFn: sellerApi.addProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seller-products"],
      });
    },
  });

  const createProfile = useMutation({
    mutationFn: sellerApi.createStore,
  });

  const updateProduct = useMutation({
    mutationFn: sellerApi.updateProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seller-products"],
      });
    },
  });

  const deleteProduct = useMutation({
    mutationFn: sellerApi.deleteProduct,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seller-products"],
      });
    },
  });

  const editProfile = useMutation({
    mutationFn: sellerApi.editProfile,
  });

  const updateOrderStatus = useMutation({
    mutationFn: sellerApi.updateOrderStatus,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["seller-orders"],
      });
    },
  });

  const getCategories = useQuery({
    queryFn: sellerApi.getCategories,
    queryKey: ["categories"],
    enabled: !!user,
  });

  const uploadImage = useMutation({
    mutationFn: ({
      productId,
      formData,
    }: {
      productId: string;
      formData: FormData;
    }) => sellerApi.uploadImage(productId, formData),
  });

  const getCompanyInfo = useQuery({
    queryFn: sellerApi.getCompanyInfo,
    queryKey: ["company-info"],
    enabled: !!user,
  });
  const getSubcategories = useQuery({
    queryFn: sellerApi.getSubcategories,
    queryKey: ["subcategories"],
    enabled: !!user,
  });

  const getOrderDetails = (id: number) =>
    useQuery({
      queryKey: ["seller-order-details", id],
      queryFn: () => sellerApi.getOrderDetails(id),
    });

  return {
    products,
    orders,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    createProfile,
    getCategories,
    getSubcategories,
    editProfile,
    getCompanyInfo,
    uploadImage,
    getOverview,
    productsById,
    getOrderDetails,
  };
};
