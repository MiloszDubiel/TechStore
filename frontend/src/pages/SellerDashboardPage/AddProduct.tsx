import { Save, ImagePlus } from "lucide-react";

const AddProduct = () => {
  return (
    <div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold">Dodaj produkt</h2>

        <p className="text-gray-500">Utwórz nową ofertę w swoim sklepie</p>
      </div>

      <form className="space-y-6">
     
        <div>
          <label className="block font-medium mb-2">Nazwa produktu</label>

          <input
            type="text"
            placeholder="Np. Laptop Lenovo Legion"
            className="w-full border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>


        <div>
          <label className="block font-medium mb-2">Opis</label>

          <textarea
            rows={6}
            placeholder="Opis produktu..."
            className="w-full border border-gray-300 px-4 py-3 outline-none resize-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

 
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
                      <label className="block font-medium mb-2">Cena (zł)
                          

            </label>

            <input
              type="number"
              placeholder="0.00"
              className="w-full border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block font-medium mb-2">Stan magazynowy</label>

            <input
              type="number"
              placeholder="0"
              className="w-full border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Kategoria */}
        <div>
          <label className="block font-medium mb-2">Kategoria</label>

          <select className="w-full border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-orange-500">
            <option>Wybierz kategorię</option>
            <option>Laptopy</option>
            <option>Komputery</option>
            <option>Monitory</option>
            <option>Akcesoria</option>
          </select>
        </div>

        {/* Zdjęcia */}
        <div>
          <label className="block font-medium mb-2">Zdjęcia produktu</label>

          <div className="border-2 border-dashed border-gray-300-lg p-10 text-center">
            <ImagePlus size={40} className="mx-auto text-gray-400 mb-4" />

            <p className="text-gray-500">
              Przeciągnij zdjęcia tutaj lub kliknij, aby je wybrać
            </p>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 border-gray-300"
          >
            <Save size={18} />
            Dodaj produkt
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
