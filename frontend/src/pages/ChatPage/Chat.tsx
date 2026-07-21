import { useState } from "react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import Navbar from "../../components/layout/Navbar/Navbar";

const ChatPage = () => {
  const [selectedConversation, setSelectedConversation] = useState<any>(null);

  return (
    <>
      <Navbar />
      <div
        className="h-[calc(100vh-80px)] flex bg-white border border-gray-300
"
      >
        <ConversationList
          selected={selectedConversation}
          onSelect={setSelectedConversation}
        />

        <ChatWindow conversation={selectedConversation} />
      </div>
    </>
  );
};

export default ChatPage;
