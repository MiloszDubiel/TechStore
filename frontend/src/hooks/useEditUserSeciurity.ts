import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";
import type { ChangePasswordSchema } from "../schemas/seciuritySchema";

const editUserSecurity = async (data: ChangePasswordSchema) => {
  const token = localStorage.getItem("token");

  const response = await api.patch("/api/settings/edit-user/security", data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};

const getPasswordUpdatedAt = async () => {
  const token = localStorage.getItem("token");

  const response = await api.get(
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
  const queryClient = useQueryClient();

  const passwordUpdatedAtQuery = useQuery({
    queryKey: ["password-updated-at"],
    queryFn: getPasswordUpdatedAt,
  });

  const editPasswordMutation = useMutation({
    mutationFn: (data: ChangePasswordSchema) => editUserSecurity(data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["password-updated-at"],
      });
    },
  });

  return {
    passwordUpdatedAtQuery,
    editPasswordMutation,
  };
};
