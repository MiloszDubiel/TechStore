import { Search, ShieldCheck, Trash2, UserCog, Ban } from "lucide-react";
import { useState } from "react";
import { useAdmin } from "../../../../hooks/useAdmin";
import { useAuth } from "../../../../context/AuthContext";
import EditUser from "./EditUser";
import { useNotificationStore } from "../../../../zustand/states/NotificationState";
import ConfirmModal from "../../../../components/ui/ConfirmModal";

const Users = () => {
  const [search, setSearch] = useState("");
  const [currentUser, setCurrentUser] = useState<any>();
  const { token } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<any>();
  const [editUser, setEditUser] = useState<boolean>();

  const [onConfirm, setOnConfirm] = useState<(() => void) | undefined>();
  const showNotification = useNotificationStore(
    (state) => state.showNotification
  );

  const {
    users: { data = [] },
    removeUser,
    BanUser,
  } = useAdmin(token!);

  const filteredUsers = data.filter((user: any) =>
    user.email.toLowerCase().includes(search.toLowerCase())
  );

  const numberOfAdmins = data.filter((user: any) => user.role === "ADMIN");
  const numberOfSellers = data.filter((user: any) => user.role === "SELLER");

  return (
    <div>
      <div className=" flex items-center justify-between mb-6">
        <div>
          <h1 className=" text-2xl font-bold">Użytkownicy</h1>

          <p className=" text-gray-500">Zarządzaj kontami użytkowników</p>
        </div>

        <div className=" relative">
          <Search
            size={18}
            className=" left-3 top-1/2 absolute text-gray-400 -translate-y-1/2"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj użytkownika..."
            className=" focus:border-orange-500 py-2 pl-10 pr-4 border border-gray-300 outline-none"
          />
        </div>
      </div>

      <div className=" grid grid-cols-3 gap-5 mb-8">
        <div className=" p-5 bg-white border border-gray-200">
          <p className="text-gray-500">Wszystkich użytkowników</p>

          <h3 className=" mt-2 text-3xl font-bold">{data?.length}</h3>
        </div>

        <div className=" p-5 bg-white border border-gray-200">
          <p className="text-gray-500">Sprzedawcy</p>

          <h3 className=" mt-2 text-3xl font-bold">
            {numberOfSellers?.length}
          </h3>
        </div>

        <div className=" p-5 bg-white border border-gray-200">
          <p className="text-gray-500">Administratorzy</p>

          <h3 className=" mt-2 text-3xl font-bold">{numberOfAdmins?.length}</h3>
        </div>
      </div>

      <div className=" overflow-hidden bg-white border border-gray-200">
        <table className=" w-full text-left">
          <thead className=" bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-5 py-4">Użytkownik</th>

              <th className="px-5 py-4">Email</th>

              <th className="px-5 py-4">Rola</th>

              <th className="px-5 py-4">Data rejestracji</th>

              <th className="px-5 py-4">Akcje</th>
            </tr>
          </thead>

          <tbody>
            {filteredUsers.map((user: any) => (
              <tr
                key={user.id}
                className=" hover:bg-gray-50 border-b border-gray-200"
              >
                <td className="px-5 py-4 font-medium">{user?.name}</td>

                <td className="px-5 py-4 text-gray-600">{user?.email}</td>

                <td className="px-5 py-4">
                  <span
                    className={`
                  text-sm
                  font-medium

                  ${
                    user.role === "ADMIN"
                      ? "text-red-600"
                      : user.role === "SELLER"
                      ? "text-orange-600"
                      : "text-gray-700"
                  }

                  `}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="px-5 py-4 text-gray-600">{user.created}</td>

                <td className=" flex gap-3 px-5 py-4">
                  <button
                    className=" hover:text-blue-800 text-blue-600"
                    onClick={() => {
                      setEditUser(true);
                      setCurrentUser(user);
                    }}
                  >
                    <UserCog size={19} />
                  </button>

                  {user.role !== "ADMIN" && (
                    <button
                      className=" hover:text-red-800 text-red-600"
                      onClick={() => {
                        setIsOpen(true);
                        setCurrentUser(user);
                      }}
                    >
                      <Trash2 size={19} />
                    </button>
                  )}

                  {user.role !== "ADMIN" && (
                    <button
                      className="hover:text-orange-800 text-orange-600"
                      onClick={() => {
                        setCurrentUser(user);

                        setMessage({
                          title: "Dezaktywować użytkownika?",
                          message:
                            "Czy na pewno chcesz zdezaktywować tego użytkownika? Będzie mógł ponownie korzystać z konta dopiero po ponownej aktywacji.",
                        });

                        setOnConfirm(() => () => {
                          BanUser.mutate(user.id as number, {
                            onSuccess: () => {
                              showNotification(
                                "Użytkownik został zdezaktywowany.",
                                "success"
                              );

                              setIsOpen(false);
                            },
                          });
                        });

                        setIsOpen(true);
                      }}
                    >
                      <Ban size={19} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {editUser && (
          <EditUser
            user={currentUser}
            onClose={() => {
              setCurrentUser(null);
            }}
            onSuccess={() => {
              setCurrentUser(null);
              setEditUser(false);
              showNotification("Pomyślnie edytowano użytkownika", "success");
            }}
          />
        )}
        <ConfirmModal
          isOpen={isOpen}
          title={message?.title}
          message={message?.message}
          onCancel={() => setIsOpen(false)}
          onConfirm={onConfirm ?? (() => {})}
        />
      </div>
    </div>
  );
};
export default Users;
