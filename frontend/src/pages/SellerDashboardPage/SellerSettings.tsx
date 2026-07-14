import { Save, Upload, Store, Building2, CreditCard } from "lucide-react";

const SellerSettings = () => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Ustawienia sklepu</h2>

        <p className="text-gray-500">Zarządzaj informacjami o swoim sklepie</p>
      </div>

      <div className="space-y-8">
        <section className="p-6 border border-gray-300">
          <div className="flex items-center gap-3 mb-6">
            <Store size={22} className="text-orange-500" />

            <h3 className="text-lg font-semibold">Dane sklepu</h3>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block mb-2 font-medium">Nazwa sklepu</label>

              <input
                type="text"
                placeholder="Nazwa sklepu"
                className=" focus:ring-2 focus:ring-orange-500 w-full px-4 py-3 border border-gray-300 outline-none"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Opis sklepu</label>

              <textarea
                rows={5}
                placeholder="Opis Twojego sklepu..."
                className=" focus:ring-2 focus:ring-orange-500 w-full px-4 py-3 border border-gray-300 outline-none resize-none"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">Logo sklepu</label>

              <div className=" p-8 text-center border-2 border-gray-300 border-dashed">
                <Upload
                  size={35}
                  className="
                  mx-auto
                  text-gray-400
                  mb-3
                  "
                />

                <p className="text-gray-500">Dodaj logo sklepu</p>
              </div>
            </div>
          </div>
        </section>

        <section className="p-6 border border-gray-300">
          <div className="flex items-center gap-3 mb-6">
            <Building2 size={22} className="text-orange-500" />

            <h3 className="text-lg font-semibold">Dane firmy</h3>
          </div>

          <div className="md:grid-cols-2 grid grid-cols-1 gap-5">
            <input
              placeholder="Nazwa firmy"
              className=" px-4 py-3 border border-gray-300"
            />

            <input
              placeholder="NIP"
              className=" px-4 py-3 border border-gray-300"
            />

            <input
              placeholder="Ulica"
              className=" px-4 py-3 border border-gray-300"
            />

            <input
              placeholder="Miasto"
              className=" px-4 py-3 border border-gray-300"
            />

            <input
              placeholder="Kod pocztowy"
              className=" px-4 py-3 border border-gray-300"
            />
          </div>
        </section>

        <section className="border border-gray-300 p-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard size={22} className="text-orange-500" />

            <h3 className="text-lg font-semibold">Płatności</h3>
          </div>

          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input type="checkbox" />

              <span>Akceptuję płatność kartą</span>
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" />

              <span>Akceptuję BLIK</span>
            </label>

            <label className="flex items-center gap-3">
              <input type="checkbox" />

              <span>Przelew tradycyjny</span>
            </label>
          </div>
        </section>

        <div className="flex justify-end">
          <button className=" hover:bg-orange-600 flex items-center gap-2 px-6 py-3 text-white bg-orange-500 border-gray-300">
            <Save size={18} />
            Zapisz zmiany
          </button>
        </div>
      </div>
    </div>
  );
};
export default SellerSettings;
