import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useOrders = (token: string | null) => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data } = await axios.get("/api/products/orders", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data.orders;
    },
  });
};

export const useOrder = (id: number | null, token: string | null) => {
  return useQuery({
    queryKey: ["order", id],
    enabled: !!id,
    queryFn: async () => {
      const { data } = await axios.get(`/api/products/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data.order;
    },
  });
};
