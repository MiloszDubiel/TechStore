import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  getUsers,
  deleteUser,
  updateUserRole,
  updateUser,
  banUser,
} from "../api/admin";

export const useAdmin = (token: string) => {
  const queryClient = useQueryClient();

  const users = useQuery({
    queryKey: ["admin-users"],

    queryFn: () => getUsers(token),
  });

  const removeUser = useMutation({
    mutationFn: (id: number) => deleteUser(id, token),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },
  });

  const changeRole = useMutation({
    mutationFn: (payload: any) => updateUserRole(payload, token),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },
  });

  const editUser = useMutation({
    mutationFn: (data: any) => updateUser(data, token),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },
  });

  const BanUser = useMutation({
    mutationFn: (id: number) => banUser(id, token),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin-users"],
      });
    },
  });
  return {
    users,
    BanUser,
    editUser,
    removeUser,

    changeRole,
  };
};
