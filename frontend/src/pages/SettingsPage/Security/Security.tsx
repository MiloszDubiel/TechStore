import { useAuth, type User } from "../../../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  type ChangePasswordSchema,
} from "../../../schemas/seciuritySchema";
import { useEditUserSecurity } from "../../../hooks/useEditUserSeciurity";
import { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";

import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const Security = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const { logout } = useAuth();
  const queryClient = useQueryClient();
  const {
    passwordUpdatedAtQuery: {
      isLoading,
      data: { result: passwordUpdatedAt } = { result: null },
    },
    editPasswordMutation: { mutate, error },
  } = useEditUserSecurity();

  const navigate = useNavigate();

  const onSubmit = (data: ChangePasswordSchema) => {
    mutate(data, {
      onSuccess: () => {
        toast.success(
          "Hasło zostało pomyślnie zmienione. Za chwilę nastąpi wylogowanie..."
        );
  
        queryClient.clear();
        setTimeout(() => {
          logout();
          navigate("/login");
        }, 3000);
      },
      onError: () =>
        toast.error(
          (error as AxiosError<{ message: string }>).response?.data.message ||
            "Wystąpił błąd"
        ),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <h2 className="mb-6 text-2xl font-bold">Bezpieczeństwo</h2>

        <div className="max-w-lg space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">
              Aktualne hasło
            </label>

            <input
              type="password"
              {...register("currentPassword")}
              className="focus:outline-none focus:ring-2 focus:ring-orange-500 w-full p-3 border border-gray-300"
              placeholder="Wprowadź aktualne hasło"
            />

            {errors.currentPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Nowe hasło</label>

            <input
              type="password"
              {...register("newPassword")}
              className="focus:outline-none focus:ring-2 focus:ring-orange-500 w-full p-3 border border-gray-300"
              placeholder="Wprowadź nowe hasło"
            />

            <p className="mt-1 text-xs text-gray-500">
              Minimum 8 znaków, jedna wielka litera, jedna cyfra i znak
              specjalny.
            </p>

            {errors.newPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">
              Potwierdź nowe hasło
            </label>

            <input
              type="password"
              {...register("confirmPassword")}
              className="focus:outline-none focus:ring-2 focus:ring-orange-500 w-full p-3 border border-gray-300"
              placeholder="Powtórz nowe hasło"
            />

            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="bg-gray-50 p-4 border border-gray-200">
            <p className="text-sm text-gray-700">Ostatnia zmiana hasła:</p>

            {isLoading
              ? "Ładowanie..."
              : !passwordUpdatedAt
              ? "Nieznana"
              : new Date(passwordUpdatedAt).toLocaleDateString("pl-PL")}
          </div>

          <button
            type="submit"
            className="hover:bg-orange-600 px-5 py-3 font-medium text-white transition bg-orange-500"
          >
            Zmień hasło
          </button>
        </div>
      </div>
    </form>
  );
};

export default Security;
