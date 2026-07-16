import { type SellerProfileType } from "../../schemas/sellerSchemta";
import { useSeller } from "../../hooks/useSeller";

import SellerProfileForm from "../../components/ui/SellerForm";
import { useState } from "react";
import NotificationCard from "../../components/ui/NotificationCard";
import { useQueryClient } from "@tanstack/react-query";

const SellerSettings = () => {
  const {
    editProfile: { isSuccess, mutate, isPending },
    getCompanyInfo: { data },
  } = useSeller();

  const queryClient = useQueryClient();
  const [message, setMessage] = useState("");

  const onSubmit = (values: SellerProfileType) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value as string);
      }
    });

    mutate(formData, {
      onSuccess: () => {
        setMessage("Zaaktualizowano dane");
        queryClient.invalidateQueries({ queryKey: ["company-info"] });
      },
    });
  };

  return (
    <>
      {isSuccess && <NotificationCard message={message} />}
      <SellerProfileForm
        mode="edit"
        defaultValues={data}
        onSubmit={onSubmit}
        isLoading={isPending}
      />
    </>
  );
};
export default SellerSettings;
