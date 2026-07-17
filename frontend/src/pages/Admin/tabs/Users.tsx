import { Search, Trash2, ShieldCheck } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const Users = () => {
  const fetchUsers = async () => {
    const { data } = await axios.get("/api/admin/users");

    return data;
  };

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchUsers,
  });

  if (isLoading) {
    return <p>Ładowanie użytkowników...</p>;
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Użytkownicy</h2>

        <p className="text-gray-500">Zarządzaj kontami użytkowników</p>
      </div>

      <div className="flex items-center gap-3 px-4 py-3 mb-6 border border-gray-300">
        <Search size={20} className="text-gray-400" />

        <input
          placeholder="Szukaj użytkownika..."
          className="w-full outline-none"
        />
      </div>

      <div className="overflow-x-auto border border-gray-300">
        <table className="w-full text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">ID</th>

              <th className="p-4">Email</th>

              <th className="p-4">Rola</th>

              <th className="p-4">Data rejestracji</th>

              <th className="p-4">Akcje</th>
            </tr>
          </thead>

          <tbody>
            {users.map((user: any) => (
              <tr
                key={user.id}
                className="hover:bg-gray-50 border-t border-gray-300"
              >
                <td className="p-4">#{user.id}</td>

                <td className="p-4 font-medium">{user.email}</td>

                <td className="p-4">
                  <span
                    className={`
                    px-3 py-1 rounded-full text-sm
                    
                    ${
                      user.role === "ADMIN"
                        ? "bg-purple-100 text-purple-700"
                        : user.role === "SELLER"
                        ? "bg-orange-100 text-orange-700"
                        : "bg-gray-100 text-gray-700"
                    }
                    
                    `}
                  >
                    {user.role}
                  </span>
                </td>

                <td className="p-4 text-gray-600">
                  {new Date(user.created_at).toLocaleDateString("pl-PL")}
                </td>

                <td className="p-4">
                  <div className="flex gap-3">
                    <button className="hover:text-orange-800 text-orange-600">
                      <ShieldCheck size={18} />
                    </button>

                    <button className="hover:text-red-800 text-red-600">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
