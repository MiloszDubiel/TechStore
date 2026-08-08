import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save } from "lucide-react";
import { useAdmin } from "../../../../hooks/useAdmin";
import { editUserAdminSchema, type EditUserAdminForm } from "../../../../schemas/editUserAdminSchema";

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
      },
    );
  };

  return (
    <div className="w-full space-y-6">
      <div>
        <button type="button" onClick={onBack} className="cursor-pointer bg-orange-500 px-4 py-3 text-white hover:bg-orange-600">
          ← Powrót
        </button>
        <h1 className="text-2xl font-bold">Edytuj użytkownika</h1>

        <p className="mt-1 text-gray-500">Zmień dane konta użytkownika oraz jego uprawnienia.</p>
      </div>

      <div className="w-full border border-gray-300 bg-white p-8">
        <form onSubmit={handleSubmit(submit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-5">
            <div>
              <label className="mb-2 block font-medium">Imię</label>

              <input
                {...register("name")}
                className="w-full border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
              />

              <p className="mt-1 text-sm text-red-500">{errors.name?.message}</p>
            </div>

            <div>
              <label className="mb-2 block font-medium">Nazwisko</label>

              <input
                {...register("last_name")}
                className="w-full border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
              />

              <p className="mt-1 text-sm text-red-500">{errors.last_name?.message}</p>
            </div>
          </div>

          <div>
            <label className="mb-2 block font-medium">Adres e-mail</label>

            <input
              {...register("email")}
              className="w-full border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
            />

            <p className="mt-1 text-sm text-red-500">{errors.email?.message}</p>
          </div>

          <div>
            <label className="mb-2 block font-medium">Rola</label>

            <select
              {...register("role")}
              className="w-full border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="USER">Użytkownik</option>
              <option value="SELLER">Sprzedawca</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>

          <div className="border-t border-gray-300 pt-6">
            <h2 className="mb-4 text-lg font-semibold">Zmiana hasła (opcjonalnie)</h2>

            <div className="grid grid-cols-2 gap-5">
              <div>
                <label className="mb-2 block font-medium">Nowe hasło</label>

                <input
                  type="password"
                  {...register("password")}
                  className="w-full border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                />

                <p className="mt-1 text-sm text-red-500">{errors.password?.message}</p>
              </div>

              <div>
                <label className="mb-2 block font-medium">Powtórz hasło</label>

                <input
                  type="password"
                  {...register("confirmPassword")}
                  className="w-full border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
                />

                <p className="mt-1 text-sm text-red-500">{errors.confirmPassword?.message}</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-gray-300 pt-6">
            <button type="button" onClick={onBack} className="cursor-pointer border border-gray-300 px-6 py-3 hover:bg-gray-100">
              Anuluj
            </button>

            <button
              type="submit"
              disabled={editUser.isPending}
              className="flex cursor-pointer items-center gap-2 bg-orange-500 px-6 py-3 text-white hover:bg-orange-600 disabled:opacity-50"
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
