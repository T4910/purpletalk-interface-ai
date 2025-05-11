
import { useParams } from "react-router-dom";
import ChatInterface from "@/components/ChatInterface";

const ChatView = () => {
  const { id } = useParams<{ id: string }>();
  
  return (
    <div className="h-screen w-screen overflow-hidden">
      <ChatInterface chatId={id} />
    </div>
  );
};

export default ChatView;
