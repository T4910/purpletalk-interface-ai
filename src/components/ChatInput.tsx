// Suggested code may be subject to a license. Learn more: ~LicenseLog:682806347.

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/useChatStore";
import { SendIcon, Paperclip } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatInput = ({ onSendMessage, isLoading }: ChatInputProps) => {
  const { inputValue, setInputValue } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      // Set the height to the scrollHeight, but cap it at max-h-96
      const newHeight = Math.min(textareaRef.current.scrollHeight, 160); // 384px is equivalent to max-h-96 (96 * 4)
      textareaRef.current.style.height = `${newHeight}px`;
    }
  }, [inputValue]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const trimmedMessage = inputValue.trim();
    if (!trimmedMessage || isLoading) return;
    
    onSendMessage(trimmedMessage);
  };

  return (
    <div className="border-t border-border/50 bg-chat-bg p-4">
      <form onSubmit={handleSubmit} className="flex gap-2 items-end max-w-3xl mx-auto">
        <div className="relative flex-1 rounded-2xl bg-chat-input-bg">
          <div className="absolute bottom-2 left-3 text-muted-foreground">
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </div>
          <textarea
            ref={textareaRef}
            className="w-full bg-transparent border-0 resize-none px-12 py-3 max-h-40 focus:ring-0 focus:outline-none scrollbar-thin rounded-2xl overflow-y-auto"
            placeholder="Message Gemini"
            value={inputValue.trimStart()} // Prevent leading spaces in the state
            onChange={(e) => setInputValue(e.target.value)}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="absolute bottom-2 right-3">
            <Button 
              type="submit" 
              size="icon" 
              disabled={isLoading || !inputValue.trim()}
              className={`h-8 w-8 rounded-full bg-chat-user text-white hover:bg-opacity-80 hover:bg-chat-user ${isLoading || !inputValue.trim() ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <SendIcon className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
