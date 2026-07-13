import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { ChangePasswordSchema } from "../schemas/seciuritySchema";


const editUserSecurity = async (data: ChangePasswordSchema) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const response = await axios.patch("/api/settings/edit-user/security", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const getPasswordUpdatedAt = async () => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");

  const response = await axios.get(
    "/api/settings/edit-user/security/password-date",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  return response.data;
};

export const useEditUserSecurity = () => {
  const passwordUpdatedAtQuery = useQuery({
    queryKey: ["password-updated-at"],
    queryFn: getPasswordUpdatedAt,
  });

  const editPasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordSchema) => editUserSecurity(data),
  });

  return {
    passwordUpdatedAtQuery,
    editPasswordMutation,
  };
};
