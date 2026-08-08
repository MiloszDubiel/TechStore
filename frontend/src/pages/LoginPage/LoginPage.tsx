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

  const removeSellerProducts = useCartStore((state: any) => state.removeSellerProducts);

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
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md border border-gray-300 bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-orange-600">Logowanie</h2>

        {error && <div className="mb-4 border border-red-400 bg-red-100 p-2 text-red-700">{(error as any)?.response?.data.message}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">Email</label>

            <input {...register("email")} className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-orange-500" />

            {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">Hasło</label>

            <input
              type="password"
              {...register("password")}
              className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
            />

            {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2">
              <input type="checkbox" {...register("rememberMe")} className="accent-orange-500" />
              Zapamiętaj mnie
            </label>

            <Link to="/forgot-password" className="text-orange-600 hover:underline">
              Zapomniałem hasła
            </Link>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-orange-500 py-2 text-white transition hover:bg-orange-600 disabled:opacity-50"
          >
            {isPending ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Nie masz konta?{" "}
          <Link to="/register" className="font-semibold text-orange-600 hover:underline">
            Zarejestruj się
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
