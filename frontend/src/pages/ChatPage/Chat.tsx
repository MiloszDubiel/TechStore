import { useState } from "react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import Navbar from "../../components/layout/Navbar/Navbar";
import { useSearchParams } from "react-router-dom";

const ChatPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  const [searchParams] = useSearchParams();
  const seller_ID = searchParams.get("seller_id") || "";

  return (
    <>
      <Navbar />
      <div className="flex h-[calc(100vh-80px)] min-h-0 flex-col overflow-hidden border border-(--border) bg-(--surface) md:flex-row">
        <ConversationList selected={selectedConversation} onSelect={setSelectedConversation} seller_id={seller_ID} />

        <ChatWindow conversation={selectedConversation} />
      </div>
    </>
  );
};

export default ChatPage;
