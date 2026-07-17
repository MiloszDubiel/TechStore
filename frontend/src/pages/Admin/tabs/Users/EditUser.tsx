import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Save, X } from "lucide-react";

import { useAdmin } from "../../../../hooks/useAdmin";
import { useAuth } from "../../../../context/AuthContext";

import {
  editUserAdminSchema,
  type EditUserAdminForm,
} from "../../../../schemas/editUserAdminSchema";

const EditUser = ({ user, onClose, onSuccess }: any) => {
  const { token } = useAuth();

  const { editUser } = useAdmin(token!);

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
        onSuccess: onSuccess,
      }
    );
  };

  return (
    <div className="bg-black/40 fixed inset-0 z-50 flex items-center justify-center">
      <div className="w-full max-w-xl p-6 bg-white border border-gray-300">
        <div className="flex justify-between mb-6">
          <h2 className="text-xl font-bold">Edytuj użytkownika</h2>

          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <div>
            <input
              placeholder="Imię"
              className="w-full px-3 py-2 border border-gray-300"
              {...register("name")}
            />

            <p className="text-sm text-red-500">{errors.name?.message}</p>
          </div>

          <div>
            <input
              placeholder="Nazwisko"
              className="w-full px-3 py-2 border border-gray-300"
              {...register("last_name")}
            />

            <p className="text-sm text-red-500">{errors.last_name?.message}</p>
          </div>

          <div>
            <input
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-300"
              {...register("email")}
            />

            <p className="text-sm text-red-500">{errors.email?.message}</p>
          </div>

          <select
            className="w-full px-3 py-2 border border-gray-300"
            {...register("role")}
          >
            <option value="USER">Użytkownik</option>

            <option value="SELLER">Sprzedawca</option>

            <option value="ADMIN">Administrator</option>
          </select>

          <div className="pt-4 border-t border-gray-300">
            <h3 className="mb-3 font-semibold">Zmiana hasła</h3>

            <input
              type="password"
              placeholder="Nowe hasło"
              className="w-full px-3 py-2 mb-2 border border-gray-300"
              {...register("password")}
            />

            <p className="text-sm text-red-500">{errors.password?.message}</p>

            <input
              type="password"
              placeholder="Powtórz hasło"
              className="w-full px-3 py-2 border border-gray-300"
              {...register("confirmPassword")}
            />

            <p className="text-sm text-red-500">
              {errors.confirmPassword?.message}
            </p>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 border border-gray-300"
            >
              Anuluj
            </button>

            <button
              disabled={editUser.isPending}
              className="flex items-center gap-2 px-5 py-2 text-white bg-orange-500"
            >
              <Save size={18} />

              {editUser.isPending ? "Zapisywanie..." : "Zapisz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUser;
