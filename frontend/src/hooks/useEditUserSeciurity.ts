import { useMutation, useQuery } from "@tanstack/react-query";
import { api } from "../axios";
import type { ChangePasswordSchema } from "../schemas/seciuritySchema";

const editUserSecurity = async (data: ChangePasswordSchema) => {
  const response = await api.patch("/api/settings/edit-user/security", data);

  return response.data;
};

const getPasswordUpdatedAt = async () => {
  const response = await api.get(
    "/api/settings/edit-user/security/password-date"
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
