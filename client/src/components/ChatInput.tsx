// Suggested code may be subject to a license. Learn more: ~LicenseLog:682806347.

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useChatStore } from "@/store/useChatStore";
import { SendIcon, Paperclip } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  isLoading: boolean;
  inNewChatPage?: boolean;
}

const ChatInput = ({
  inNewChatPage,
  onSendMessage,
  isLoading,
}: ChatInputProps) => {
  const { inputValue, setInputValue } = useChatStore();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      // Set the height to the scrollHeight, but cap it at max-h-32
      const newHeight = Math.min(textareaRef.current.scrollHeight, 128);
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
    <div
      className={`"${
        inNewChatPage
          ? "p-0 mt-8"
          : "border-t bg-chat-bg -red-800 p-4 pb-0 border-border/50"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className="flex gap-2 items-end max-w-3xl mx-auto"
      >
        <div className="relative flex items-stretch flex-1 rounded-2xl bg-chat-input-bg h-fit">
          {/* <div className="absolute bottom-2 left-3 text-muted-foreground">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-full"
            >
              <Paperclip className="h-5 w-5" />
            </Button>
          </div> */}
          <textarea
            ref={textareaRef}
            className="w-full bg-transparent border-0 resize-none pl-6 px-12 py-4 h-full max-h-32 focus:ring-0 focus:outline-none scrollbar-thin rounded-2xl overflow-y-auto"
            placeholder="Message Realyze"
            value={inputValue.trimStart()} // Prevent leading spaces in the state
            onChange={(e) => setInputValue(e.target.value)}
            rows={1}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
          />
          <div className="absolute bottom-3 right-3">
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !inputValue.trim()}
              className={`h-8 w-8 rounded-full bg-chat-user text-white hover:bg-opacity-80 hover:bg-chat-user ${
                isLoading || !inputValue.trim()
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <SendIcon className="size-6" />
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatInput;
