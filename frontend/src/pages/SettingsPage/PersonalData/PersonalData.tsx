import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "../../../schemas/profileSchema";
import type { ProfileFormData } from "../../../schemas/profileSchema";
import { useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import NotificationCard from "../../../components/ui/NotificationCard";

export const PersonalData = () => {
  const queryClient = useQueryClient();
  const { user, token } = useAuth();

  console

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

  const { mutate, isError, isSuccess } = useMutation({
    mutationFn: (data: ProfileFormData) =>
      axios.patch("/api/settings/edit-user/personal-data", data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),

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
    mutate(data);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Dane osobowe</h2>

      <div className="space-y-3">
        <div>
          <p className="text-gray-500 mb-2">Zarządzaj swoimi danymi konta</p>
          {isSuccess && <NotificationCard message={"Dane zostały zapisane"} />}

          {isError && (
            <div className=" p-4 border-l-4 border-orange-500 bg-orange-50 text-sm text-red-700">
              Wystąpił błąd podczas zapisu
            </div>
          )}

          <form
            className="max-w-xl space-y-4"
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <fieldset>
              <div>
                <label className="text-sm text-gray-600 border-">Imię</label>

                <input
                  {...register("name")}
                  placeholder="Imię"
                  className="w-full border p-3 focus:outline-none focus:border-orange-500 border-gray-200"
                />
              </div>
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name.message}</p>
              )}

              <div>
                <label className="text-sm text-gray-600">Nazwisko</label>

                <input
                  placeholder="Nazwisko"
                  {...register("last_name")}
                  className="w-full border p-3 focus:outline-none focus:border-orange-500 border-gray-200"
                />
              </div>
              {errors.last_name && (
                <p className="text-red-500 text-sm">
                  {errors.last_name.message}
                </p>
              )}

              <div>
                <label className="text-sm text-gray-600">Email</label>

                <input
                  {...register("email")}
                  placeholder="Email"
                  className="w-full border p-3 border-gray-200"
                />

                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-600 border-gray-200">
                  Telefon
                </label>

                <input
                  {...register("phone")}
                  placeholder="Telefon"
                  maxLength={9}
                  className="w-full border p-3 focus:outline-none focus:border-orange-500 border-gray-200"
                />
                {errors.phone && (
                  <p className="text-red-500 text-sm">{errors.phone.message}</p>
                )}
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  className="flex-1 bg-orange-500 text-white py-3 hover:bg-orange-600 transition"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
                </button>

                <button
                  className="flex-1 border py-3 hover:bg-gray-100 transition"
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
