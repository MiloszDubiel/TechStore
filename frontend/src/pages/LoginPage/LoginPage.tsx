import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../schemas/loginSchema";
import type { LoginFormData } from "../../schemas/loginSchema";
import { useLogin } from "../../hooks/useLogin";
import { useAuth } from "../../context/AuthContext";


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

  const onSubmit = (data: LoginFormData) => {
    mutate(data, {
      onSuccess: (data) => {
        login(data.accessToken, data.refreshToken, data.rememberMe ?? false);
        navigate("/");
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white shadow-md p-8 border border-gray-300">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
          Logowanie
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-400">
            {error?.response?.data.message}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>

            <input
              {...register("email")}
              className="w-full border border-gray-300 px-3 py-2 focus:border-orange-500 outline-none"
            />

            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Hasło</label>

            <input
              type="password"
              {...register("password")}
              className="w-full border border-gray-300 px-3 py-2 focus:border-orange-500 outline-none"
            />

            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
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
              className="text-orange-600 hover:underline"
            >
              Zapomniałem hasła
            </Link>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-orange-500 text-white py-2 hover:bg-orange-600 transition disabled:opacity-50"
          >
            {isPending ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Nie masz konta?{" "}
          <Link
            to="/register"
            className="text-orange-600 font-semibold hover:underline"
          >
            Zarejestruj się
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
