import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useAdmin } from "../../../../hooks/useAdmin";
import { useAuth } from "../../../../context/AuthContext";
import {
  editUserAdminSchema,
  type EditUserAdminForm,
} from "../../../../schemas/editUserAdminSchema";

const EditUser = ({ user, onSuccess, onBack }: any) => {


  const { editUser } = useAdmin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditUserAdminForm>({
    resolver: zodResolver(editUserAdminSchema),

    defaultValues: {
      name: user?.name ?? "",
      last_name: user?.last_name ?? "",
      email: user?.email ?? "",
      role: user?.role,

      password: "",
      confirmPassword: "",
    },
  });

  const submit = (data: EditUserAdminForm) => {
    editUser.mutate(
      { ...data, id: user?.id },
      {
        onSuccess: () => {
          onSuccess();
          onBack();
        },
      }
    );
  };

  return (
    <div className=" w-full space-y-6">
      <div>
        <button
          type="button"
          onClick={onBack}
          className="hover:bg-orange-600 px-4 py-3 text-white bg-orange-500 cursor-pointer"
        >
          ← Powrót
        </button>
        <h1 className="text-2xl font-bold">Edytuj użytkownika</h1>

        <p className="mt-1 text-gray-500">
          Zmień dane konta użytkownika oraz jego uprawnienia.
        </p>
      </div>

      <div className="w-full p-8 bg-white border border-gray-300">
        <form onSubmit={handleSubmit(submit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="block mb-2 font-medium">Imię</label>

              <input
                {...register("name")}
                className="focus:ring-2 focus:ring-orange-500 w-full px-4 py-3 border border-gray-300 outline-none"
              />

              <p className="mt-1 text-sm text-red-500">
                {errors.name?.message}
              </p>
            </div>

            <div>
              <label className="block mb-2 font-medium">Nazwisko</label>

              <input
                {...register("last_name")}
                className="focus:ring-2 focus:ring-orange-500 w-full px-4 py-3 border border-gray-300 outline-none"
              />

              <p className="mt-1 text-sm text-red-500">
                {errors.last_name?.message}
              </p>
            </div>
          </div>

          <div>
            <label className="block mb-2 font-medium">Adres e-mail</label>

            <input
              {...register("email")}
              className="focus:ring-2 focus:ring-orange-500 w-full px-4 py-3 border border-gray-300 outline-none"
            />

            <p className="mt-1 text-sm text-red-500">{errors.email?.message}</p>
          </div>

          <div>
            <label className="block mb-2 font-medium">Rola</label>

            <select
              {...register("role")}
              className="focus:ring-2 focus:ring-orange-500 w-full px-4 py-3 border border-gray-300 outline-none"
            >
              <option value="USER">Użytkownik</option>
              <option value="SELLER">Sprzedawca</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>

          <div className="pt-6 border-t border-gray-300">
            <h2 className="mb-4 text-lg font-semibold">
              Zmiana hasła (opcjonalnie)
            </h2>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="block mb-2 font-medium">Nowe hasło</label>

                <input
                  type="password"
                  {...register("password")}
                  className="focus:ring-2 focus:ring-orange-500 w-full px-4 py-3 border border-gray-300 outline-none"
                />

                <p className="mt-1 text-sm text-red-500">
                  {errors.password?.message}
                </p>
              </div>

              <div>
                <label className="block mb-2 font-medium">Powtórz hasło</label>

                <input
                  type="password"
                  {...register("confirmPassword")}
                  className="focus:ring-2 focus:ring-orange-500 w-full px-4 py-3 border border-gray-300 outline-none"
                />

                <p className="mt-1 text-sm text-red-500">
                  {errors.confirmPassword?.message}
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-6 border-t border-gray-300">
            <button
              type="button"
              onClick={onBack}
              className="hover:bg-gray-100 px-6 py-3 border border-gray-300 cursor-pointer"
            >
              Anuluj
            </button>

            <button
              type="submit"
              disabled={editUser.isPending}
              className="hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2 px-6 py-3 text-white bg-orange-500 cursor-pointer"
            >
              <Save size={18} />

              {editUser.isPending ? "Zapisywanie..." : "Zapisz zmiany"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
