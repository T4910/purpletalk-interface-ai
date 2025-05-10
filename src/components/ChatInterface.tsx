
import { useRef, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useChatStore } from "@/store/useChatStore";
import { aiService } from "@/services/aiService";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import Sidebar from "./Sidebar";
import PropertiesPanel from "./PropertiesPanel";
import { Badge } from "@/components/ui/badge";

const ChatInterface = () => {
  const { messages, addMessage } = useChatStore();
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const [showProperties, setShowProperties] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  
  const { mutate: sendMessage, isPending: isLoading } = useMutation({
    mutationFn: aiService.sendMessage,
    onSuccess: (response) => {
      addMessage(response.content, "assistant");
    }
  });
  
  const handleSendMessage = (content: string) => {
    addMessage(content, "user");
    sendMessage(content);
  };

  const handleViewProperties = () => {
    // Close sidebar if open
    setIsSidebarOpen(false);
    // Show properties panel
    setShowProperties(true);
  };
  
  return (
    <div className="flex h-screen bg-chat-bg text-foreground">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className={cn(
        "flex-1 flex flex-col h-full overflow-hidden ml-0 transition-all duration-300",
        showProperties ? "w-1/2" : "w-full"
      )}>
        <div className="h-14 border-b border-border/50 flex items-center px-4 justify-between">
          <div className="flex items-center gap-3">
            <span className="font-medium">Gemini</span>
            <Badge variant="secondary" className="bg-secondary/30 text-xs font-normal rounded-full">
              gemini-2.0-flash
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
            <div className="py-4 px-4 md:px-6">
              <div className="max-w-4xl mx-auto w-full flex gap-4 md:gap-6">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center animate-pulse-gentle">
                    <div className="w-5 h-5 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
        
        <div className="text-xs text-center text-muted-foreground py-2 border-t border-border/50">
          LibreChat v0.7.8-rc1 - Every AI for Everyone.
        </div>
      </div>

      {showProperties && (
        <div className="flex-1 h-full border-l border-border/50 overflow-hidden">
          <PropertiesPanel onClose={() => setShowProperties(false)} />
        </div>
      )}
    </div>
  );
};

// Helper function from utils
const cn = (...classes: any[]) => classes.filter(Boolean).join(" ");

export default ChatInterface;
