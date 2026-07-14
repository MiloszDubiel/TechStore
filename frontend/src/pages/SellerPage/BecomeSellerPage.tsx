import { useAuth } from "../../context/AuthContext";
import BecomeSellerForm from "../../components/ui/SellerForm";
import Navbar from "../../components/layout/Navbar";
import { Link } from "react-router-dom";
import { useSeller } from "../../hooks/useSeller";
const BecomeSellerPage = () => {
  const { user } = useAuth();
  const {
    createProfile: { data },
  } = useSeller();

  return (
    <>
      <Navbar />
      <section className="flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-3xl p-8 bg-white">
          <h1 className="mb-6 text-3xl font-bold text-center">
            Zostań sprzedawcą
          </h1>

          {!data && <BecomeSellerForm isLoggedIn={!user} />}
          {data && (
            <div className="bg-orange-50 p-4 mb-8 border border-gray-300">
              <p className="mb-4 text-gray-700">Zostałeś już sprzedawcą</p>

              <Link
                to="/seller/dashboard"
                className=" hover:bg-orange-600 inline-block px-5 py-2 font-semibold text-white transition bg-orange-500"
              >
                Przejdz do panelu sprzedawcy
              </Link>
            </div>
          )}

          {!user && (
            <div className="bg-orange-50 p-4 mb-8 border border-gray-300">
              <p className="mb-4 text-gray-700">
                Nie masz jeszcze konta. Utwórz konto i załóż sklep.
              </p>

              <Link
                to="/register"
                className=" hover:bg-orange-600 inline-block px-5 py-2 font-semibold text-white transition bg-orange-500"
              >
                Zarejestruj się
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
export default BecomeSellerPage;
