
import { useParams } from "react-router-dom";
import ChatInterface from "@/components/ChatInterface";
import AppSidebar from "@/components/AppSidebar";
import PropertiesPanel from "@/components/PropertiesPanel";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { usePropertiesPanel } from "@/hooks/usePropertiesPanel";

const ChatView = () => {
  const { id } = useParams<{ id: string }>();
  const { isOpen: showProperties } = usePropertiesPanel();
  
  return (
    <SidebarProvider>
      <div className="h-screen w-screen flex overflow-hidden bg-chat-bg text-foreground">
        <AppSidebar />
        
        <SidebarInset>
          <div className="flex h-full">
            <ChatInterface chatId={id} />
            
            {showProperties && (
              <div className="flex-1 h-full border-l border-border/50 overflow-hidden">
                <PropertiesPanel />
              </div>
            )}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ChatView;
