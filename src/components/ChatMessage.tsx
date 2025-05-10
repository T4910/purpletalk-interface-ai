
import { Message } from "@/store/useChatStore";
import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === "user";
  
  return (
    <div
      className={cn(
        "py-4 px-4 md:px-6 flex animate-fade-in",
        isUser ? "bg-transparent" : "bg-secondary/30"
      )}
    >
      <div className="max-w-4xl mx-auto w-full flex gap-4 md:gap-6">
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
              <p key={i} className={paragraph.trim() === '' ? 'h-4' : 'mb-2'}>{paragraph}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
