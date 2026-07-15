import { type SellerProfileType } from "../../schemas/sellerSchemta";
import { useSeller } from "../../hooks/useSeller";

import SellerProfileForm from "../../components/ui/SellerForm";

const SellerSettings = () => {
  const {
    editProfile,
    getCompanyInfo: { data },
  } = useSeller();

  const onSubmit = (values: SellerProfileType) => {
    const formData = new FormData();

    Object.entries(values).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value as string);
      }
    });

    editProfile.mutate(formData);
  };

  return (
    <SellerProfileForm
      mode="edit"
      defaultValues={data}
      onSubmit={onSubmit}
      isLoading={editProfile.isPending}
    />
  );
};
export default SellerSettings;
