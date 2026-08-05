import { useQuery } from "@tanstack/react-query";
import { api } from "../axios";

const getUser = async () => {
  const response = await api.get("/api/auth/user");

  return response.data;
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
  });
};
