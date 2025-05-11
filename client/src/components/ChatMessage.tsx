
import { Message } from "@/store/useChatStore";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { usePropertiesPanel } from "@/hooks/usePropertiesPanel";

interface ChatMessageProps {
  message: Message;
  onViewProperties?: () => void;
}

const ChatMessage = ({ message, onViewProperties }: ChatMessageProps) => {
  const isUser = message.role === "user";
  const propertyPanelIsOpen  = usePropertiesPanel(store => store.isOpen)

  // Check if this is the last AI message where we should show the button
  const showPropertiesButton = message.id === "2" && !isUser;
  
  return (
    <div
      className={cn(
        "py-5 px-4 md:px-6 flex animate-fade-in",
        isUser ? "bg-transparent" : "bg-secondary/10"
      )}
    >
      <div className={`${isUser ? "" : ""} max-w-3xl mx-auto w-full flex gap-4 md:gap-6`}>
        <div className="flex-shrink-0 mt-1">
          {isUser ? (
            <div className="w-8 h-8 rounded-full bg-chat-user text-white flex items-center justify-center">
              <span className="text-sm font-medium">U</span>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
              <div className="w-5 h-5 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8V4H8" />
                  <rect width="16" height="12" x="4" y="8" rx="2" />
                  <path d="m6 20 4-4" />
                  <path d="m18 20-4-4" />
                </svg>
              </div>
            </div>
          )}
        </div>
        <div className="w-full">
          <div className="prose prose-invert max-w-none">
            {message.content.split('\n').map((paragraph, i) => (
              <p key={i} className={paragraph.trim() === '' ? 'h-4' : 'mb-2 leading-relaxed'}>{paragraph}</p>
            ))}
            
            {showPropertiesButton && (
              <div className="mt-4">
                <Button 
                  onClick={onViewProperties}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 rounded-md"
                  disabled={propertyPanelIsOpen}
                >
                  View properties
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
