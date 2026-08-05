import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

export const useOrders = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await api.get("/api/products/orders");

      return data.orders;
    },
  });
};

export const useOrder = (id: number | null) => {
  return useQuery({
    queryKey: ["order", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await api.get(`/api/products/orders/${id}`);

      return data.order;
    },
  });
};
