import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from "../../../schemas/profileSchema";
import type { ProfileFormData } from "../../../schemas/profileSchema";
import { useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export const PersonalData = () => {
  const queryClient = useQueryClient();
  const { user, token } = useAuth();

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
    mutate(data, { onSuccess: () => toast.success("Zmieniono dane") });
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Dane osobowe</h2>

      <div className="space-y-3">
        <div>
          <p className="mb-2 text-gray-500">Zarządzaj swoimi danymi konta</p>

          {isError && (
            <div className=" bg-orange-50 p-4 text-sm text-red-700 border-l-4 border-orange-500">
              Wystąpił błąd podczas zapisu
            </div>
          )}

          <form
            className="max-w-xl space-y-4"
            onSubmit={handleSubmit(onSubmit, onError)}
          >
            <fieldset>
              <div>
                <label className="border- text-sm text-gray-600">Imię</label>

                <input
                  {...register("name")}
                  placeholder="Imię"
                  className="focus:outline-none focus:border-orange-500 w-full p-3 border border-gray-200"
                />
              </div>
              {errors.name && (
                <p className="text-sm text-red-500">{errors.name.message}</p>
              )}

              <div>
                <label className="text-sm text-gray-600">Nazwisko</label>

                <input
                  placeholder="Nazwisko"
                  {...register("last_name")}
                  className="focus:outline-none focus:border-orange-500 w-full p-3 border border-gray-200"
                />
              </div>
              {errors.last_name && (
                <p className="text-sm text-red-500">
                  {errors.last_name.message}
                </p>
              )}

              <div>
                <label className="text-sm text-gray-600">Email</label>

                <input
                  {...register("email")}
                  placeholder="Email"
                  className="w-full p-3 border border-gray-200"
                />

                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
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
                  className="focus:outline-none focus:border-orange-500 w-full p-3 border border-gray-200"
                />
                {errors.phone && (
                  <p className="text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  className="hover:bg-orange-600 flex-1 py-3 text-white transition bg-orange-500"
                  disabled={isSubmitting}
                  type="submit"
                >
                  {isSubmitting ? "Zapisywanie..." : "Zapisz zmiany"}
                </button>

                <button
                  className="hover:bg-gray-100 flex-1 py-3 transition border"
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
