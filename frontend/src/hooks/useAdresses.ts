import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

import type { AddressFrom } from "../schemas/addressSchema";

const useAdresses = (userID: string | unknown, token: string | null) => {
  const queryClient = useQueryClient();
  const { data } = useQuery({
    queryKey: ["adressess", userID],
    queryFn: async () =>
      await axios.get(`/api/settings/edit-user/adresses/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
  });

  const { mutate: saveAddress, isSuccess: addressSetSuccess } = useMutation({
    mutationKey: ["save-address"],
    mutationFn: async (data) =>
      await axios.post("/api/settings/edit-user/adresses", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adressess", userID] });
    },
  });

  const { mutate: updateAddress, isSuccess: addressUpdateSuccess } =
    useMutation({
      mutationKey: ["update-address"],
      mutationFn: async (data) =>
        await axios.patch("/api/settings/edit-user/adresses", data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["adressess", userID] });
      },
    });

  const { mutate: deleteAddress, isSuccess: addressDeleteSuccess } =
    useMutation({
      mutationKey: ["delete-address"],
      mutationFn: async (id: string) =>
        await axios.delete(`/api/settings/edit-user/adresses/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["adressess", userID] });
      },
    });

  if (!userID) {
    return {
      userAddresses: [],
      addressIsSuccess: false,
      saveAddress: () => {},
      updateAddress: () => {},
      deleteAddress: () => {},
      addressDeleteSuccess: false,
    };
  }

  return {
    userAddresses: data?.data.addresses,
    addressSetSuccess,
    saveAddress,
    updateAddress,
    addressUpdateSuccess,
    deleteAddress,
    addressDeleteSuccess,
  };
};

export default useAdresses;
