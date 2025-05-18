import { useNavigate } from "@tanstack/react-router"; // Changed import
import { Button } from "@/components/ui/button";
import { ArrowLeft, ChevronRightIcon } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import ChatInput from "@/components/ChatInput";
import SidebarButton from "@/components/SidebarButton";
import { Badge } from "@/components/ui/badge";
import * as aiService from "@/services/aiService";
import { QueryKeys } from "@/services/keys";
import { useQueryClient } from "@tanstack/react-query";
// import { useMutation } from "@tanstack/react-query";
// import { useChatStore } from "@/store/useChatStore";
// import ChatMessage from "@/components/ChatMessage";

// const route = getRouteApi("/c/new");

const NewChat = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleStartChat = async (userMessage: string) => {
    // const newChatId = Date.now().toString();
    const res = await aiService.sendMessage({ user_input: userMessage });
    queryClient.invalidateQueries([QueryKeys.allConversations]);
    // Changed navigation method to use params
    navigate({ to: "/c/$id", params: { id: res.session_id } });
  };

  return (
    <>
      <div className="min-h-16 border-b border-border/50 flex items-center px-4 justify-start gap-4">
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
      <div className="flex-1 flex flex-col items-center justify-center max-md:px-0 max-md:pb-0 p-4">
        <div className="w-full max-w-md md:mx-auto text-center">
          <div className="mb-6">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
              <div className="w-8 h-8 text-white">
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

          <h1 className="text-2xl font-bold mb-2">Good afternoon</h1>
          <p className="text-muted-foreground mb-8">
            How can I help you today?
          </p>

          <div className="space-y-3 max-md:px-4">
            <Button
              onClick={() =>
                handleStartChat("Help me find a property in Lagos")
              }
              className="w-full py-6 bg-chat-input-bg hover:bg-chat-input-bg/80 text-left justify-start rounded-xl border border-border/50"
            >
              <ArrowLeft className="mr-1" />
              Help me find a property in Lagos
            </Button>

            <Button
              onClick={() =>
                handleStartChat("I need a 3-bedroom flat in Abuja")
              }
              className="w-full py-6 bg-chat-input-bg hover:bg-chat-input-bg/80 text-left justify-start rounded-xl border border-border/50"
            >
              <ArrowLeft className="mr-1" />I need a 3-bedroom flat in Abuja
            </Button>
          </div>

          <ChatInput
            onSendMessage={handleStartChat}
            isLoading={false}
            inNewChatPage
          />
        </div>
      </div>
      <div className="text-xs text-center text-muted-foreground py-2 border-t border-border/50">
        Realyze v0.7.8-rc1 - Every AI for Everyone.
      </div>
    </>
  );
};

export default NewChat;
