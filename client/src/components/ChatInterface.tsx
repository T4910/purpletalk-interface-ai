import { useRef, useEffect, Suspense } from "react";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useChatStore } from "@/store/useChatStore";
import * as aiService from "@/services/aiService";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { usePropertyPanelSidebar } from "./ui/usePropertyPanelContext";
import { useParams } from "@tanstack/react-router";
import {
  getConversationOptions,
  useConversationQuery,
} from "@/services/provider/ai";
import SidebarButton from "./SidebarButton";
import { TopNavUser } from "./TopNavUser";
import Header from "./Header";
import SpinLoader from "./SpinLoader";
import { useSendAiMessage } from "@/hooks/useChat";
import { QueryKeys } from "@/services/keys";

interface ChatInterfaceProps {
  chatId?: string;
}

const ChatInterface = ({ chatId }: ChatInterfaceProps) => {
  const { addMessage } = useChatStore();
  const queryClient = useQueryClient();
  // const useSendAiMessage();

  const { mutate: sendMessage, isPending: isLoading } = useMutation({
    mutationFn: aiService.sendMessage,
    onSuccess: (response) => {
      addMessage(response.content, "assistant");
      console.log("refetching all conversations...");
      queryClient.invalidateQueries({ queryKey: [QueryKeys.allConversations] });
      queryClient.invalidateQueries({ queryKey: [QueryKeys.conversation, chatId] });
    },
    onError: (error) => {
      console.error("Error sending message:", error);
    },
    retry: 3,
  });

  const handleSendMessage = (content: string) => {
    addMessage(content, "user");
    sendMessage({ session_id: chatId, user_input: content });
  };

  return (
    <div
      className={cn(
        "flex-1 overflow-auto flex flex-col relative transition-all duration-300"
      )}
    >
      <Header />
      <Suspense
        fallback={
          <div className="flex-1 mt-auto grid place-content-center">
            <SpinLoader className="size-20" />
            {/* Loading........................................................................................................................................................................................................... */}
          </div>
        }
      >
        <MessagesDisplay
          chatId={chatId}
          isLoading={isLoading}
          sendMessage={sendMessage}
        />
      </Suspense>

      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      <div className="text-xs bg-chat-bg text-center text-muted-foreground py-2">
        Realyze v0.7.8-rc1 - Every AI for Everyone.
      </div>
    </div>
  );
};

const MessagesDisplay = ({
  chatId,
  isLoading,
  sendMessage,
}: {
  chatId: string;
  isLoading: boolean;
  sendMessage: ({
    session_id,
    user_input,
  }: {
    session_id: string;
    user_input: string;
  }) => void;
}) => {
  const { messages, loadPrevMessages } = useChatStore();

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { open, setOpen } = useSidebar();
  const { togglePropertyPanelSidebar: openPropertiesPanel } =
    usePropertyPanelSidebar();

  // const { data: prevMessages, isSuccess } = useConversationQuery(chatId);
  const { data: prevMessages, isSuccess } = useSuspenseQuery(
    getConversationOptions(chatId)
  );

  useEffect(() => {
    // Here you would fetch messages for this specific chat ID
    if (isSuccess) {
      loadPrevMessages(prevMessages);
      if (prevMessages.length === 1)
        sendMessage({
          session_id: chatId,
          user_input: prevMessages[0].content,
        });
    }
  }, [prevMessages, loadPrevMessages, isSuccess, sendMessage, chatId]);

  const handleViewProperties = () => {
    if (open) setOpen(false);
    openPropertiesPanel();
  };
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto scrollbar-thin"
    >
      {messages.map((message) => (
        <ChatMessage
          key={message.id}
          message={message}
          onViewProperties={handleViewProperties}
        />
      ))}

      {isLoading && (
        <div className="py-4 px-4 md:px-6 mx-auto">
          <div className="max-w-3xl mx-auto w-full flex gap-4 md:gap-6">
            <div className="flex-shrink-0 mt-1">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center animate-pulse-gentle">
                <div className="w-5 h-5 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 8V4H8" />
                    <rect width="16" height="12" x="4" y="8" rx="2" />
                    <path d="m6 20 4-4" />
                    <path d="m18 20-4-4" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="w-full">
              <div className="h-4 w-16 bg-muted/30 rounded animate-pulse-gentle"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// const MessageSection

export default ChatInterface;
