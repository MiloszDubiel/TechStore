import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "../../../schemas/profileSchema";
import type { ProfileFormData } from "../../../schemas/profileSchema";
import { useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const PersonalData = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  console;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name,
      last_name: user?.last_name,
      email: user?.email,
      id: user?.id,
      phone: user?.phone,
    },
  });

  useEffect(() => {
    if (user) {
      reset({
        name: user.name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        id: user.id,
      });
    }
  }, [user, reset]);

  const { mutate, isError } = useMutation({
    mutationFn: (data: ProfileFormData) =>
      api.patch("/api/settings/edit-user/personal-data", data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });

  const onError = (er: any) => {
    console.log(er);
  };
  const onSubmit = (data: ProfileFormData) => {
    mutate(data, { onSuccess: () => toast.success("Zmieniono dane") });
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold text-(--foreground)">
        Dane osobowe
      </h2>
      <div className="space-y-3">
        <div>
          <p className="mb-2 text-(--foreground-secondary)">
            Zarządzaj swoimi danymi konta
          </p>

          {isError && (
            <div className="bg-orange-50 p-4 text-sm text-red-700 border-l-4 border-(--primary)">
              Wystąpił błąd podczas zapisu
            </div>
          )}

          <form
            className="max-w-xl space-y-4"
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <fieldset>
              <div>
                <label className="text-sm text-(--foreground-secondary)">
                  Imię
                </label>

                <input
                  {...register("name")}
                  placeholder="Imię"
                  className="
            focus:outline-none
            focus:border-(--primary)
            w-full
            p-3
            border
            border-(--border)
            bg-(--surface)
            text-(--foreground)
            placeholder:text-(--foreground-secondary)
          "
                />
              </div>

              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}

              <div>
                <label className="text-sm text-(--foreground-secondary)">
                  Nazwisko
                </label>

                <input
                  placeholder="Nazwisko"
                  {...register("last_name")}
                  className="
            focus:outline-none
            focus:border-(--primary)
            w-full
            p-3
            border
            border-(--border)
            bg-(--surface)
            text-(--foreground)
            placeholder:text-(--foreground-secondary)
          "
                />
              </div>

              {errors.last_name && (
                <p className="text-sm text-red-500">
                  {errors.last_name.message}
                </p>
              )}

              <div>
                <label className="text-sm text-(--foreground-secondary)">
                  Email
                </label>

                <input
                  {...register("email")}
                  placeholder="Email"
                  className="
            focus:outline-none
            focus:border-(--primary)
            w-full
            p-3
            border
            border-(--border)
            bg-(--surface)
            text-(--foreground)
            placeholder:text-(--foreground-secondary)
          "
                />

                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-(--foreground-secondary)">
                  Telefon
                </label>

                <input
                  {...register("phone")}
                  placeholder="Telefon"
                  maxLength={9}
                  className="
            focus:outline-none
            focus:border-(--primary)
            w-full
            p-3
            border
            border-(--border)
            bg-(--surface)
            text-(--foreground)
            placeholder:text-(--foreground-secondary)
          "
                />

                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  className="
            hover:bg-(--primary-hover)
            flex-1
            py-3
            text-white
            transition
            bg-(--primary)
          "
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
                </button>

                <button
                  className="
            hover:bg-(--surface-secondary)
            flex-1
            py-3
            transition
            border
            border-(--border)
            text-(--foreground)
          "
                  type="reset"
                >
                  Anuluj
                </button>
              </div>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  );
};
