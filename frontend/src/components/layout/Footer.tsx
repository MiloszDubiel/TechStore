const Footer: React.FC = () => {
  return (
    <footer className=" py-10 text-gray-300 bg-gray-900">
      <div className="md:grid-cols-3 container grid grid-cols-1 gap-8 px-6 mx-auto">
        <div>
          <h4 className="mb-4 text-lg font-semibold text-white">My IT Store</h4>
          <p className="text-sm">
            Najlepszy sklep z elektroniką i sprzętem IT. Szybka wysyłka i
            gwarancja jakości.
          </p>
        </div>

        <div>
          <h4 className="mb-4 text-lg font-semibold text-white">Informacje</h4>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-orange-500 cursor-pointer">O nas</li>
            <li className="hover:text-orange-500 cursor-pointer">Regulamin</li>
            <li className="hover:text-orange-500 cursor-pointer">
              Polityka prywatności
            </li>
            <li className="hover:text-orange-500 cursor-pointer">Kontakt</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-lg font-semibold text-white">Kontakt</h4>
          <p className="text-sm">Email: kontakt@myitstore.pl</p>
          <p className="text-sm">Tel: +48 123 456 789</p>
        </div>
      </div>

      <div className="pt-4 mt-8 text-sm text-center text-gray-500 border-t border-gray-700">
        © {new Date().getFullYear()} My IT Store. Wszelkie prawa zastrzeżone.
      </div>
    </footer>
  );
};
export default Footer;
