import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema, type RegisterSchema } from "../../schemas/registerSchema";

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
      },
    );
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md border border-gray-300 bg-white p-8 shadow-md">
        <h2 className="mb-6 text-center text-2xl font-bold text-orange-600">Rejestracja</h2>

        {error && (
          <div className="mb-4 border border-red-400 bg-red-100 p-2 text-red-700">
            {(error as any).response?.data?.message ?? "Błąd rejestracji"}
          </div>
        )}

        {isSuccess && <div className="mb-4 border border-green-400 bg-green-100 p-2 text-green-700">Rejestracja zakończona sukcesem!</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-semibold">Imię</label>

            <input {...register("name")} className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-orange-500" />

            <p className="text-sm text-red-500">{errors.name?.message}</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">Email</label>

            <input {...register("email")} className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-orange-500" />

            <p className="text-sm text-red-500">{errors.email?.message}</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">Hasło</label>

            <input
              type="password"
              {...register("password")}
              className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
            />

            <p className="text-sm text-red-500">{errors.password?.message}</p>
          </div>

          <div>
            <label className="mb-1 block text-sm font-semibold">Powtórz hasło</label>

            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full border border-gray-300 px-3 py-2 outline-none focus:border-orange-500"
            />

            <p className="text-sm text-red-500">{errors.confirmPassword?.message}</p>
          </div>

          <button disabled={isPending} className="w-full bg-orange-500 py-2 text-white transition hover:bg-orange-600 disabled:opacity-50">
            {isPending ? "Rejestracja..." : "Zarejestruj się"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Masz już konto?{" "}
          <Link to="/login" className="font-semibold text-orange-600 hover:underline">
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
