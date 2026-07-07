import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const useAdresses = (userID: string | unknown) => {
  const { data } = useQuery({
    queryKey: ["adresses", userID],
    queryFn: () => axios.get(`/api/settings/edit-user/adresses/${userID}`),
  });

  if (!userID) {
    return { userAddresses: [] };
  }
  return { userAddresses: data?.data };
};

export default useAdresses;
