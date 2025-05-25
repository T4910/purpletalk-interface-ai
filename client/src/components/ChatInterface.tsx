import { useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useChatStore } from "@/store/useChatStore";
import * as aiService from "@/services/aiService";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { usePropertyPanelSidebar } from "./ui/usePropertyPanelContext";
import { useParams } from "@tanstack/react-router";
import { useConversationQuery } from "@/services/provider/ai";
import SidebarButton from "./SidebarButton";

interface ChatInterfaceProps {
  chatId?: string;
}

const ChatInterface = ({ chatId }: ChatInterfaceProps) => {
  const { messages, addMessage, loadPrevMessages } = useChatStore();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { open, setOpen } = useSidebar();
  const { state: sidebarState } = useSidebar();
  const { togglePropertyPanelSidebar: openPropertiesPanel } =
    usePropertyPanelSidebar();

  const { data: prevMessages, isSuccess } = useConversationQuery(chatId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // // In a real app, we would fetch chat history based on chatId
  useEffect(() => {
    // Here you would fetch messages for this specific chat ID
    if (isSuccess) loadPrevMessages(prevMessages);
  }, [prevMessages, loadPrevMessages, isSuccess]);

  const { mutate: sendMessage, isPending: isLoading } = useMutation({
    mutationFn: aiService.sendMessage,
    onSuccess: (response) => {
      addMessage(response.content, "assistant");
    },
  });

  const handleSendMessage = (content: string) => {
    addMessage(content, "user");
    sendMessage({ session_id: chatId, user_input: content });
  };

  const handleViewProperties = () => {
    if (open) setOpen(false);
    openPropertiesPanel();
  };

  return (
    <div
      className={cn(
        "flex-1 overflow-auto flex flex-col relative transition-all duration-300"
        // showProperties ? "w-1/2" : "w-full"
      )}
    >
      <div className="min-h-16  sticky top-0 border-b border-border/50 flex items-center px-4 justify-start gap-4">
        <SidebarButton offset={true} />
        <div className="flex items-center gap-3">
          <span className="font-medium">Realyze</span>
          <Badge
            variant="secondary"
            className="bg-secondary/30 text-xs font-normal rounded-full"
          >
            <a
              href="https://floo.com.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              By Floo
            </a>
          </Badge>
        </div>
      </div>
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

      <ChatInput onSendMessage={handleSendMessage} isLoading={isLoading} />
      <div className="text-xs bg-chat-bg text-center text-muted-foreground py-2">
        Realyze v0.7.8-rc1 - Every AI for Everyone.
      </div>
    </div>
  );
};

export default ChatInterface;
