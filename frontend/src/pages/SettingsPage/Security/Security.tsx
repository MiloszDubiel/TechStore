import type { User } from "../../../context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  type ChangePasswordSchema,
} from "../../../schemas/seciuritySchema";
import { useEditUserSecurity } from "../../../hooks/useEditUserSeciurity";
import NotificationCard from "../../../components/ui/NotificationCard";
import { AxiosError } from "axios";
import { data } from "react-router-dom";

type SecurityProps = {
  user: User;
};

const Security = ({ user }: SecurityProps) => {
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

  const {
    passwordUpdatedAtQuery: {
      isLoading,
      data: { result: passwordUpdatedAt } = { result: null },
    },
    editPasswordMutation: { mutate, isSuccess, isError, error },
  } = useEditUserSecurity();

  const onSubmit = (data: ChangePasswordSchema) => {
    mutate(data);
  };

  console.log("passwordUpdatedAtQuery", passwordUpdatedAt);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {isSuccess && (
        <NotificationCard message="Hasło zostało pomyślnie zmienione" />
      )}
      {isError && (
        <NotificationCard
          message={
            (error as AxiosError<{ message: string }>).response?.data.message ||
            "Wystąpił błąd"
          }
        />
      )}

      <div>
        <h2 className="text-2xl font-bold mb-6">Bezpieczeństwo</h2>

        <div className="space-y-4 max-w-lg">
          <div>
            <label className="block text-sm font-medium mb-1">
              Aktualne hasło
            </label>

            <input
              type="password"
              {...register("currentPassword")}
              className="w-full border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Wprowadź aktualne hasło"
            />

            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Nowe hasło</label>

            <input
              type="password"
              {...register("newPassword")}
              className="w-full border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Wprowadź nowe hasło"
            />

            <p className="mt-1 text-xs text-gray-500">
              Minimum 8 znaków, jedna wielka litera, jedna cyfra i znak
              specjalny.
            </p>

            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Potwierdź nowe hasło
            </label>

            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Powtórz nowe hasło"
            />

            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <div className="bg-gray-50 border border-gray-200 p-4">
            <p className="text-sm text-gray-700">Ostatnia zmiana hasła:</p>

            {isLoading
              ? "Ładowanie..."
              : !passwordUpdatedAt
                ? "Nieznana"
                : new Date(passwordUpdatedAt).toLocaleDateString("pl-PL")}
          </div>

          <button
            type="submit"
            className="bg-orange-500 px-5 py-3 text-white font-medium hover:bg-orange-600 transition"
          >
            Zmień hasło
          </button>
        </div>
      </div>
    </form>
  );
};

export default Security;
