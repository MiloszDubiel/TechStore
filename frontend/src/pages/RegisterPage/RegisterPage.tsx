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
      role: "USER",
    },
  });

  const { mutate, isPending, isSuccess, error } = useRegister();
  // console.log(error.response.data.message);

  const onSubmit = (data: RegisterSchema) => {
    mutate(data, {
      onSuccess: () => {
        reset();
      },
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white shadow-md p-8 border border-gray-300">
        <h2 className="text-2xl font-bold text-center text-orange-600 mb-6">
          Rejestracja
        </h2>

        {error && (
          <div className="mb-4 p-2 bg-red-100 text-red-700 border border-red-400">
            {(error as any).response?.data?.message ?? "Błąd rejestracji"}
          </div>
        )}

        {isSuccess && (
          <div className="mb-4 p-2 bg-green-100 text-green-700 border border-green-400">
            Rejestracja zakończona sukcesem!
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold mb-1">Imię</label>

            <input
              {...register("name")}
              className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
            />

            <p className="text-red-500 text-sm">{errors.name?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Email</label>

            <input
              {...register("email")}
              className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
            />

            <p className="text-red-500 text-sm">{errors.email?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Hasło</label>

            <input
              type="password"
              {...register("password")}
              className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
            />

            <p className="text-red-500 text-sm">{errors.password?.message}</p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Powtórz hasło
            </label>

            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
            />

            <p className="text-red-500 text-sm">
              {errors.confirmPassword?.message}
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Rola</label>

            <select
              {...register("role")}
              className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
            >
              <option value="USER">Użytkownik</option>

              <option value="SELLER">Sprzedawca</option>
            </select>
          </div>

          <button
            disabled={isPending}
            className="w-full bg-orange-500 text-white py-2 hover:bg-orange-600 transition disabled:opacity-50"
          >
            {isPending ? "Rejestracja..." : "Zarejestruj się"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Masz już konto?{" "}
          <Link
            to="/login"
            className="text-orange-600 font-semibold hover:underline"
          >
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
