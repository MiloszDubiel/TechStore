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
    <div className="flex min-h-screen items-center justify-center bg-(--background) px-4 py-8 sm:px-6 lg:px-8">
      <div className="place fixed top-0 left-0 grid h-full w-full border border-(--border) bg-(--surface) p-8 md:static md:w-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-(--foreground)">Logowanie</h2>

        {error && (
          <div className="mb-4 border border-(--danger) bg-(--surface-secondary) p-3 text-sm text-(--danger)">
            {(error as any)?.response?.data.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-(--foreground)">Email</label>

            <input
              type="email"
              {...register("email")}
              className="w-full border border-(--border) bg-(--surface) px-3 py-2.5 text-(--foreground) transition outline-none placeholder:text-(--foreground-secondary) focus:border-(--primary)"
            />

            {errors.email && <p className="mt-1 text-sm text-(--danger)">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-(--foreground)">Hasło</label>

            <input
              type="password"
              {...register("password")}
              className="w-full border border-(--border) bg-(--surface) px-3 py-2.5 text-(--foreground) transition outline-none placeholder:text-(--foreground-secondary) focus:border-(--primary)"
            />

            {errors.password && <p className="mt-1 text-sm text-(--danger)">{errors.password.message}</p>}
          </div>

          <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
            <label className="flex items-center gap-2 text-(--foreground-secondary)">
              <input type="checkbox" {...register("rememberMe")} className="accent-(--primary)" />
              Zapamiętaj mnie
            </label>

            <Link to="/forgot-password" className="text-(--primary) transition hover:text-(--primary-hover) hover:underline">
              Zapomniałem hasła
            </Link>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full cursor-pointer bg-(--primary) py-2.5 font-semibold text-white transition hover:bg-(--primary-hover) disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-(--foreground-secondary)">
          Nie masz konta?{" "}
          <Link to="/register" className="font-semibold text-(--primary) transition hover:text-(--primary-hover) hover:underline">
            Zarejestruj się
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
