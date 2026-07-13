import { useQuery } from "@tanstack/react-query";
import axios from "axios"; 

const getUser = async () => {
  const token =
    localStorage.getItem("token") ?? sessionStorage.getItem("token");

  const response = await axios.get("/api/auth/user", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

export const useUser = (token: string | null) => {
  return useQuery({
    queryKey: ["user"],
    queryFn: getUser,
    enabled: !!token,
  });
};
