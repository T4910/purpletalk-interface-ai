import { useNavigate } from "@tanstack/react-router"; // Changed import
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import ChatInput from "@/components/ChatInput";

const NewChat = () => {
  const navigate = useNavigate();
  
  const handleStartChat = () => {
    // In a real app, you would create a new chat ID here via API call
    // For now, we'll navigate to a dummy chat ID
    const newChatId = "chat-" + Date.now().toString();
    // Changed navigation method to use params
    navigate({ to: '/c/$id' , params: { id: newChatId } });
  };
  
  return (
    <SidebarProvider>
      <div className="h-screen w-screen flex overflow-hidden bg-chat-bg text-foreground">
        <AppSidebar />
        
        <SidebarInset>
          <div className="flex flex-col h-full w-full">
            <div className="h-14 border-b border-border/50 flex items-center px-4 justify-between">
              <div className="flex items-center gap-3">
                <span className="font-medium">Gemini</span>
              </div>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center max-md:px-0 max-md:pb-0 p-4">
              <div className="w-full max-w-md md:mx-auto text-center">
                <div className="mb-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center">
                    <div className="w-8 h-8 text-white">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 8V4H8" />
                        <rect width="16" height="12" x="4" y="8" rx="2" />
                        <path d="m6 20 4-4" />
                        <path d="m18 20-4-4" />
                      </svg>
                    </div>
                  </div>
                </div>
                
                <h1 className="text-2xl font-bold mb-2">Good afternoon</h1>
                <p className="text-muted-foreground mb-8">How can I help you today?</p>
                
                <div className="space-y-3 max-md:px-4">
                  <Button 
                    onClick={handleStartChat}
                    className="w-full py-6 bg-chat-input-bg hover:bg-chat-input-bg/80 text-left justify-start rounded-xl border border-border/50"
                  >
                    <ArrowLeft className="mr-1" />
                    Help me find a property in Lagos
                  </Button>
                  
                  <Button 
                    onClick={handleStartChat}
                    className="w-full py-6 bg-chat-input-bg hover:bg-chat-input-bg/80 text-left justify-start rounded-xl border border-border/50"
                  >
                    <ArrowLeft className="mr-1" />
                    I need a 3-bedroom flat in Abuja
                  </Button>
                </div>

                <ChatInput onSendMessage={() => {}} isLoading={false} inNewChatPage />
              </div>
            </div>
            
            <div className="text-xs text-center text-muted-foreground py-2 border-t border-border/50">
              Realyze v0.7.8-rc1 - Every AI for Everyone.
            </div>
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default NewChat;
