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
    <div className="flex min-h-screen items-center justify-center bg-(--background) px-4 py-8 sm:px-6 lg:px-8">
      <div className="place fixed top-0 left-0 grid h-full w-full border border-(--border) bg-(--surface) p-8 md:static md:w-md">
        <h2 className="mb-6 text-center text-xl font-bold text-(--foreground) sm:text-2xl">Rejestracja</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
          {error && (
            <div className="mb-4 border border-(--danger) bg-(--surface-secondary) p-3 text-sm text-(--danger)">
              {(error as any).response?.data?.message ?? "Błąd rejestracji"}
            </div>
          )}

          {isSuccess && (
            <div className="mb-4 border border-(--success) bg-(--surface-secondary) p-3 text-sm text-(--success)">
              Rejestracja zakończona sukcesem!
            </div>
          )}
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-(--foreground)" htmlFor="name">
              Imię
            </label>

            <input
              {...register("name")}
              className="w-full border border-(--border) bg-(--surface) px-3 py-2.5 text-sm text-(--foreground) transition outline-none focus:border-(--primary) sm:text-base"
              id="name"
            />

            {errors.name?.message && <p className="mt-1 text-sm text-(--danger)">{errors.name.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-(--foreground)" htmlFor="email">
              Email
            </label>

            <input
              type="email"
              id="email"
              {...register("email")}
              className="w-full border border-(--border) bg-(--surface) px-3 py-2.5 text-sm text-(--foreground) transition outline-none focus:border-(--primary) sm:text-base"
            />

            {errors.email?.message && <p className="mt-1 text-sm text-(--danger)">{errors.email.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-(--foreground)" htmlFor="password">
              Hasło
            </label>

            <input
              type="password"
              id="password"
              {...register("password")}
              className="w-full border border-(--border) bg-(--surface) px-3 py-2.5 text-sm text-(--foreground) transition outline-none focus:border-(--primary) sm:text-base"
            />

            {errors.password?.message && <p className="mt-1 text-sm text-(--danger)">{errors.password.message}</p>}
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-semibold text-(--foreground)" htmlFor="repeat-password">
              Powtórz hasło
            </label>

            <input
              type="password"
              id="repeat-password"
              {...register("confirmPassword")}
              className="w-full border border-(--border) bg-(--surface) px-3 py-2.5 text-sm text-(--foreground) transition outline-none focus:border-(--primary) sm:text-base"
            />

            {errors.confirmPassword?.message && <p className="mt-1 text-sm text-(--danger)">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full cursor-pointer bg-(--primary) py-2.5 text-sm font-semibold text-white transition hover:bg-(--primary-hover) disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
          >
            {isPending ? "Rejestracja..." : "Zarejestruj się"}
          </button>
        </form>

        <p className="mt-5 text-center text-sm text-(--foreground-secondary) sm:mt-6">
          Masz już konto?{" "}
          <Link to="/login" className="font-semibold text-(--primary) transition hover:text-(--primary-hover) hover:underline">
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
