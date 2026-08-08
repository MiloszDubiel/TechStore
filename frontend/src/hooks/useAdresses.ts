import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../axios";

const useAdresses = (userID: string | unknown) => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["adressess", userID],
    queryFn: async () => await api.get(`/api/settings/edit-user/adresses/`),
  });

  const { mutate: saveAddress, isSuccess: addressSetSuccess } = useMutation({
    mutationKey: ["save-address"],
    mutationFn: async (data) => await api.post("/api/settings/edit-user/adresses", data),

    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: ["adressess", userID],
      });

      return response.data.address;
    },
  });

  const { mutate: updateAddress, isSuccess: addressUpdateSuccess } = useMutation({
    mutationKey: ["update-address"],
    mutationFn: async (data) => await api.patch("/api/settings/edit-user/adresses", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adressess", userID] });
    },
  });

  const { mutate: deleteAddress, isSuccess: addressDeleteSuccess } = useMutation({
    mutationKey: ["delete-address"],
    mutationFn: async (id: string) => await api.delete(`/api/settings/edit-user/adresses/${id}`),
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
    userAddresses: data?.data.addresses.map((address: any) => ({
      ...address,
      is_default: Boolean(address.is_default),
    })),
    addressSetSuccess,
    saveAddress,
    updateAddress,
    addressUpdateSuccess,
    deleteAddress,
    addressDeleteSuccess,
  };
};

export default useAdresses;
