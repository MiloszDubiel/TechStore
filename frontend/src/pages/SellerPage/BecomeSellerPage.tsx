import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/layout/Navbar/Navbar";
import SellerProfileForm from "../../components/ui/SellerForm";
import { useSeller } from "../../hooks/useSeller";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "../../context/AuthContext";

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

  const { user } = useAuth();

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

    formData.append("user_id", String(user!.id));

    createProfile.mutate(formData, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["company-info"],
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

      <div className="flex min-h-screen items-center justify-center px-6 py-10">
        <div className="w-full max-w-3xl">
          <SellerProfileForm mode="create" onSubmit={submit} isLoading={createProfile.isPending} />
        </div>
      </div>
    </>
  );
};

export default BecomeSellerForm;
