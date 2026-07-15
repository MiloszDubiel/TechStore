import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import SellerProfileForm from "../../components/ui/SellerForm";
import { useSeller } from "../../hooks/useSeller";
import { useQueryClient } from "@tanstack/react-query";


const BecomeSellerForm = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const { createProfile, getCompanyInfo } = useSeller();

  const { data: seller, isLoading } = getCompanyInfo;

  useEffect(() => {
    if (seller) {
      navigate("/seller/dashboard");
    }
  }, [seller, navigate]);

  const submit = (data: any) => {
    const formData = new FormData();

    Object.entries(data).forEach(([key, value]) => {
      if (value === undefined || value === null) return;

      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });

    createProfile.mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["seller"],
        });

        navigate("/seller/dashboard");
      },
    });
  };

  if (isLoading) {
    return <div>Ładowanie...</div>;
  }

  return (
    <>
      <Navbar />

      <div className="flex items-center justify-center min-h-screen px-6 py-10">
        <div className="w-full max-w-3xl">
          <SellerProfileForm
            mode="create"
            onSubmit={submit}
            isLoading={createProfile.isPending}
          />
        </div>
      </div>
    </>
  );
};

export default BecomeSellerForm;
