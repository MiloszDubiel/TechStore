const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 py-10 text-gray-300">
      <div className="container mx-auto grid grid-cols-1 gap-8 px-6 md:grid-cols-3">
        <div>
          <h4 className="mb-4 text-lg font-semibold text-white">TechStore</h4>
          <p className="text-sm">Najlepszy sklep z elektroniką i sprzętem IT. Szybka wysyłka i gwarancja jakości.</p>
        </div>

        <div>
          <h4 className="mb-4 text-lg font-semibold text-white">Informacje</h4>
          <ul className="space-y-2 text-sm">
            <li className="cursor-pointer hover:text-orange-500">O nas</li>
            <li className="cursor-pointer hover:text-orange-500">Regulamin</li>
            <li className="cursor-pointer hover:text-orange-500">Polityka prywatności</li>
            <li className="cursor-pointer hover:text-orange-500">Kontakt</li>
          </ul>
        </div>

        <div>
          <h4 className="mb-4 text-lg font-semibold text-white">Kontakt</h4>
          <p className="text-sm">Email: kontakt@e-commerce.pl</p>
          <p className="text-sm">Tel: +48 123 456 789</p>
        </div>
      </div>

      <div className="mt-8 border-t border-gray-700 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} TechStore. Wszelkie prawa zastrzeżone.
      </div>
    </footer>
  );
};
export default Footer;
