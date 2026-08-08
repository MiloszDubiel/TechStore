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
    mutationFn: (data: ProfileFormData) => api.patch("/api/settings/edit-user/personal-data", data),

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
      <h2 className="mb-4 text-2xl font-bold text-(--foreground)">Dane osobowe</h2>
      <div className="space-y-3">
        <div>
          <p className="mb-2 text-(--foreground-secondary)">Zarządzaj swoimi danymi konta</p>

          {isError && (
            <div className="border-l-4 border-(--primary) bg-orange-50 p-4 text-sm text-red-700">Wystąpił błąd podczas zapisu</div>
          )}

          <form className="max-w-xl space-y-4" onSubmit={handleSubmit(onSubmit, onError)}>
            <fieldset>
              <div>
                <label className="text-sm text-(--foreground-secondary)">Imię</label>

                <input
                  {...register("name")}
                  placeholder="Imię"
                  className="w-full border border-(--border) bg-(--surface) p-3 text-(--foreground) placeholder:text-(--foreground-secondary) focus:border-(--primary) focus:outline-none"
                />
              </div>

              {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}

              <div>
                <label className="text-sm text-(--foreground-secondary)">Nazwisko</label>

                <input
                  placeholder="Nazwisko"
                  {...register("last_name")}
                  className="w-full border border-(--border) bg-(--surface) p-3 text-(--foreground) placeholder:text-(--foreground-secondary) focus:border-(--primary) focus:outline-none"
                />
              </div>

              {errors.last_name && <p className="text-sm text-red-500">{errors.last_name.message}</p>}

              <div>
                <label className="text-sm text-(--foreground-secondary)">Email</label>

                <input
                  {...register("email")}
                  placeholder="Email"
                  className="w-full border border-(--border) bg-(--surface) p-3 text-(--foreground) placeholder:text-(--foreground-secondary) focus:border-(--primary) focus:outline-none"
                />

                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </div>

              <div>
                <label className="text-sm text-(--foreground-secondary)">Telefon</label>

                <input
                  {...register("phone")}
                  placeholder="Telefon"
                  maxLength={9}
                  className="w-full border border-(--border) bg-(--surface) p-3 text-(--foreground) placeholder:text-(--foreground-secondary) focus:border-(--primary) focus:outline-none"
                />

                {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  className="flex-1 bg-(--primary) py-3 text-white transition hover:bg-(--primary-hover)"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
                </button>

                <button
                  className="flex-1 border border-(--border) py-3 text-(--foreground) transition hover:bg-(--surface-secondary)"
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
