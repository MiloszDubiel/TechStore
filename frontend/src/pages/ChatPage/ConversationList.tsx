type Props = {
  selected: any;
  onSelect: (data: any) => void;
};

const ConversationList = ({ selected, onSelect }: Props) => {
  const conversations = [
    {
      id: 1,
      name: "Sklep Lenovo",
      last: "Czy laptop aktualny?",
    },
    {
      id: 2,
      name: "Adam Kowalski",
      last: "Kiedy wysyłka?",
    },
  ];

  return (
    <div className=" w-80 border-r border-gray-300">
      <h2 className=" p-5 text-xl font-bold">Wiadomości</h2>

      {conversations.map((c) => (
        <button
          key={c.id}
          onClick={() => onSelect(c)}
          className={`
w-full
p-4
text-left
border-t border-gray-300 cursor-pointer

${selected?.id === c.id ? "bg-orange-100" : ""}

`}
        >
          <p className="font-semibold">{c.name}</p>

          <p className="text-sm text-gray-500">{c.last}</p>
        </button>
      ))}
    </div>
  );
};
export default ConversationList;
