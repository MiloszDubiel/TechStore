import { useState } from "react";

const ChatWindow = ({ conversation }: any) => {
  const [message, setMessage] = useState("");

  if (!conversation) {
    return (
      <div className=" flex items-center justify-center flex-1 text-gray-400">
        Wybierz rozmowę
      </div>
    );
  }
  return (
    <div className=" flex flex-col flex-1">
      <div className=" p-5.5 font-bold border-b border-gray-300">
        {conversation.name}
      </div>

      <div className=" flex-1 p-5 space-y-3 overflow-y-auto">
        <div className=" w-fit p-3 bg-gray-100">Czy produkt aktualny?</div>

        <div className=" w-fit p-3 ml-auto text-white bg-orange-500">
          Tak, jest dostępny
        </div>
      </div>

      <div className=" flex gap-3 p-4 border-t border-gray-300">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Napisz wiadomość..."
          className=" flex-1 px-4 py-3 border border-gray-300"
        />

        <button className=" px-5 text-white bg-orange-500">Wyślij</button>
      </div>
    </div>
  );
};
export default ChatWindow;
