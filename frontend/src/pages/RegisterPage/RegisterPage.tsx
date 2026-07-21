import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  registerSchema,
  type RegisterSchema,
} from "../../schemas/registerSchema";

import { useRegister } from "../../hooks/useRegister";

const RegisterPage = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { mutate, isPending, isSuccess, error } = useRegister();

  const onSubmit = (data: RegisterSchema) => {
    mutate(
      { ...data },
      {
        onSuccess: () => {
          reset();
        },
      }
    );
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md p-8 bg-white border border-gray-300 shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center text-orange-600">
          Rejestracja
        </h2>

        {error && (
          <div className="p-2 mb-4 text-red-700 bg-red-100 border border-red-400">
            {(error as any).response?.data?.message ?? "Błąd rejestracji"}
          </div>
        )}

        {isSuccess && (
          <div className="p-2 mb-4 text-green-700 bg-green-100 border border-green-400">
            Rejestracja zakończona sukcesem!
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block mb-1 text-sm font-semibold">Imię</label>

            <input
              {...register("name")}
              className="focus:border-orange-500 w-full px-3 py-2 border border-gray-300 outline-none"
            />

            <p className="text-sm text-red-500">{errors.name?.message}</p>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Email</label>

            <input
              {...register("email")}
              className="focus:border-orange-500 w-full px-3 py-2 border border-gray-300 outline-none"
            />

            <p className="text-sm text-red-500">{errors.email?.message}</p>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">Hasło</label>

            <input
              type="password"
              {...register("password")}
              className="focus:border-orange-500 w-full px-3 py-2 border border-gray-300 outline-none"
            />

            <p className="text-sm text-red-500">{errors.password?.message}</p>
          </div>

          <div>
            <label className="block mb-1 text-sm font-semibold">
              Powtórz hasło
            </label>

            <input
              type="password"
              {...register("confirmPassword")}
              className="focus:border-orange-500 w-full px-3 py-2 border border-gray-300 outline-none"
            />

            <p className="text-sm text-red-500">
              {errors.confirmPassword?.message}
            </p>
          </div>

          <button
            disabled={isPending}
            className="hover:bg-orange-600 disabled:opacity-50 w-full py-2 text-white transition bg-orange-500"
          >
            {isPending ? "Rejestracja..." : "Zarejestruj się"}
          </button>
        </form>

        <p className="mt-4 text-sm text-center">
          Masz już konto?{" "}
          <Link
            to="/login"
            className="hover:underline font-semibold text-orange-600"
          >
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
