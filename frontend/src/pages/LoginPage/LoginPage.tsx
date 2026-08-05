import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../schemas/loginSchema";
import type { LoginFormData } from "../../schemas/loginSchema";
import { useLogin } from "../../hooks/useLogin";
import { useAuth } from "../../context/AuthContext";
import { useSearchParams } from "react-router-dom";
import { useCartStore } from "../../zustand/states/cartState";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";

const LoginPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });
  const { login } = useAuth();
  const { mutate, error, isPending } = useLogin();

  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const fromCart = searchParams.get("cart");

  const removeSellerProducts = useCartStore(
    (state: any) => state.removeSellerProducts
  );

  const queryClient = useQueryClient();

  const onSubmit = (data: LoginFormData) => {
    mutate(data, {
      onSuccess: (response: any) => {
        login(response.accessToken, response.refreshToken);

        removeSellerProducts(response.id);

        toast.success("Zalogowano pomyślnie!");

        if (fromCart === "1") {
          navigate("/cart/checkout");
          return;
        }

        queryClient.refetchQueries({
          queryKey: ["user"],
        });
        navigate("/");
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white border border-gray-300 shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-orange-600">
          Logowanie
        </h2>

        {error && (
          <div className="p-2 mb-4 text-red-700 bg-red-100 border border-red-400">
            {(error as any)?.response?.data.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-semibold">Email</label>

            <input
              {...register("email")}
              className="focus:border-orange-500 w-full px-3 py-2 border border-gray-300 outline-none"
            />

            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Hasło</label>

            <input
              type="password"
              {...register("password")}
              className="focus:border-orange-500 w-full px-3 py-2 border border-gray-300 outline-none"
            />

            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register("rememberMe")}
                className="accent-orange-500"
              />
              Zapamiętaj mnie
            </label>

            <Link
              to="/forgot-password"
              className="hover:underline text-orange-600"
            >
              Zapomniałem hasła
            </Link>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="hover:bg-orange-600 disabled:opacity-50 w-full py-2 text-white transition bg-orange-500"
          >
            {isPending ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Nie masz konta?{" "}
          <Link
            to="/register"
            className="hover:underline font-semibold text-orange-600"
          >
            Zarejestruj się
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
