import { Search, CheckCircle, UserCog, Ban, Store } from "lucide-react";

import { useState } from "react";
import { useAdmin } from "../../../../hooks/useAdmin";
import { useAuth } from "../../../../context/AuthContext";
import EditUser from "./EditUser";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import { toast } from "react-toastify";
import SellerForm from "../../../../components/ui/SellerForm";
import { useQueryClient } from "@tanstack/react-query";
import Pagination from "../../../../components/ui/Pagination";

const Users = () => {
  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [editSeller, setEditSeller] = useState(false);
  const [editUser, setEditUser] = useState(false);
  const queryClient = useQueryClient();

  const [confirmData, setConfirmData] = useState({
    title: "",
    message: "",
  });

  const [onConfirm, setOnConfirm] = useState<(() => void) | undefined>();

  const {
    users: { data },
    activeUser,
    BanUser,
    updateSeller,
  } = useAdmin({
    page: page,
    limit: 10,
    search,
  });

  const usersList = data?.users ?? [];

  const numberOfAdmins = data?.totalAdmins ?? 0;

  const numberOfSellers = data?.totalSellers ?? 0;

  if (editUser) {
    return (
      <EditUser
        user={selectedUser}
        onBack={() => setEditUser(false)}
        onSuccess={() => {
          toast.success("Pomyślnie zaktualizowano użytkownika");
          setSelectedUser(null);
        }}
      />
    );
  }

  if (editSeller) {
    return (
      <SellerForm
        storeData={selectedUser}
        mode="edit"
        onBack={() => {
          setEditSeller(false);
          setSelectedUser(null);
        }}
        onSubmit={(form) => {
          const formData = new FormData();

          Object.entries(form).forEach(([key, value]) => {
            if (value instanceof File) {
              formData.append(key, value);
            } else if (value) {
              formData.append(key, String(value));
            }
          });

          updateSeller.mutate(
            {
              id: selectedUser.id,
              data: formData,
            },
            {
              onSuccess: () => {
                queryClient.invalidateQueries({
                  queryKey: ["admin-users"],
                });

                setEditSeller(false);

                toast.success("Zaktualizowano sklep");
              },
            },
          );
        }}
      />
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-(--foreground)">Użytkownicy</h1>

          <p className="text-(--foreground-secondary)">Zarządzaj kontami użytkowników</p>
        </div>

        <div className="relative">
          <Search size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-(--foreground-secondary)" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj użytkownika..."
            className="border border-(--border) bg-(--surface) py-2 pr-4 pl-10 text-(--foreground) outline-none focus:border-orange-500"
          />
        </div>
      </div>

      <div className="mb-8 grid grid-cols-3 gap-5">
        <div className="border border-(--border) bg-(--surface) p-5">
          <p className="text-(--foreground-secondary)">Wszystkich użytkowników</p>

          <h3 className="mt-2 text-3xl font-bold text-(--foreground)">{data?.length}</h3>
        </div>

        <div className="border border-(--border) bg-(--surface) p-5">
          <p className="text-(--foreground-secondary)">Sprzedawcy</p>

          <h3 className="mt-2 text-3xl font-bold text-(--foreground)">{numberOfSellers?.length}</h3>
        </div>

        <div className="border border-(--border) bg-(--surface) p-5">
          <p className="text-(--foreground-secondary)">Administratorzy</p>

          <h3 className="mt-2 text-3xl font-bold text-(--foreground)">{numberOfAdmins?.length}</h3>
        </div>
      </div>

      <div className="overflow-hidden border border-(--border) bg-(--surface)">
        <table className="w-full text-left">
          <thead className="border-b border-(--border) bg-(--surface-secondary)">
            <tr>
              <th className="px-5 py-4 text-(--foreground)">Użytkownik</th>

              <th className="px-5 py-4 text-(--foreground)">Email</th>

              <th className="px-5 py-4 text-(--foreground)">Rola</th>

              <th className="px-5 py-4 text-(--foreground)">Data rejestracji</th>

              <th className="px-5 py-4 text-(--foreground)">Status</th>

              <th className="px-5 py-4 text-(--foreground)">Akcje</th>
            </tr>
          </thead>

          <tbody>
            {usersList?.map((user: any) => (
              <tr key={user.id} className="border-b border-(--border) transition hover:bg-(--surface-secondary)">
                <td className="px-5 py-4 font-medium text-(--foreground)">{user?.name}</td>

                <td className="px-5 py-4 text-(--foreground-secondary)">{user?.email}</td>

                <td className="px-5 py-4">
                  <span
                    className={`text-sm font-medium ${
                      user.role === "ADMIN" ? "text-red-500" : user.role === "SELLER" ? "text-orange-500" : "text-(--foreground-secondary)"
                    } `}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-5 py-4 text-(--foreground-secondary)">{new Date(user.created_at).toLocaleDateString("pl-PL")}</td>

                <td className="px-5 py-4 text-(--foreground-secondary)">{user.is_active == 1 ? "Aktywny" : "Nieaktywny"}</td>

                <td className="flex gap-3 px-5 py-4">
                  <button
                    className="text-blue-600 hover:text-blue-800"
                    onClick={() => {
                      setSelectedUser(user);
                      setEditUser(true);
                    }}
                  >
                    <UserCog size={19} />
                  </button>

                  {user.role === "SELLER" && user.seller_id && (
                    <button
                      className="text-orange-600 hover:text-orange-800"
                      onClick={() => {
                        setSelectedUser(user);
                        setEditSeller(true);
                      }}
                    >
                      <Store size={19} />
                    </button>
                  )}

                  {user.role !== "ADMIN" &&
                    (user.is_active ? (
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => {
                          setConfirmData({
                            title: "Zdezaktywować użytkownika?",
                            message: "Czy na pewno chcesz dezaktywować tego użytkownika?",
                          });

                          setIsConfirmOpen(true);

                          setOnConfirm(() => () => {
                            BanUser.mutate(user.id);
                          });
                        }}
                      >
                        <Ban size={19} />
                      </button>
                    ) : (
                      <button
                        className="text-green-600 hover:text-green-800"
                        onClick={() => {
                          activeUser.mutate(user.id);
                        }}
                      >
                        <CheckCircle size={19} />
                      </button>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ConfirmModal
          isOpen={isConfirmOpen}
          title={confirmData.title}
          message={confirmData.message}
          onCancel={() => setIsConfirmOpen(false)}
          onConfirm={onConfirm ?? (() => {})}
        />
      </div>

      <Pagination page={page} totalPages={data?.totalPages ?? 1} onPageChange={setPage} />
    </div>
  );
};

export default Users;
