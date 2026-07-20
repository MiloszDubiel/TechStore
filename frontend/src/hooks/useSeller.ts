import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import * as sellerApi from "../api/seller";

export const useSeller = () => {
  const queryClient = useQueryClient();

  const products = useQuery({
    queryKey: ["seller-products"],
    queryFn: sellerApi.getProducts,
  });

  const getOverview = useQuery({
    queryKey: ["seller-overview"],
    queryFn: sellerApi.getSellerOverview,
  });

  const orders = useQuery({
    queryKey: ["seller-orders"],
    queryFn: sellerApi.getOrders,
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
  });
  const getSubcategories = useQuery({
    queryFn: sellerApi.getSubcategories,
    queryKey: ["subcategories"],
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
    getOrderDetails,
  };
};
