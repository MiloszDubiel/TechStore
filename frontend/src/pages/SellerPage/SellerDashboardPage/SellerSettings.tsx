import { type SellerProfileType } from "../../../schemas/sellerSchemta";
import { useSeller } from "../../../hooks/useSeller";
import { toast } from "react-toastify";
import SellerProfileForm from "../../../components/ui/SellerForm";
import { useQueryClient } from "@tanstack/react-query";

const SellerSettings = () => {
  const {
    editProfile: { mutate, isPending },
    getCompanyInfo: { data },
  } = useSeller();

  const queryClient = useQueryClient();

  const onSubmit = (values: SellerProfileType) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value as string);
      }
    });

    mutate(formData, {
      onSuccess: () => {
        toast.success("Pomyślnie zmieniono dane profilu");
        queryClient.invalidateQueries({ queryKey: ["company-info"] });
      },
    });
  };

  return (
    <>
      <SellerProfileForm
        mode="edit"
        defaultValues={data}
        onSubmit={onSubmit}
        isLoading={isPending}
        storeData={data}
        hideButton={false}
      />
    </>
  );
};
export default SellerSettings;
