
import ChatInterface from "@/components/ChatInterface";
import AppSidebar from "@/components/AppSidebar";
import PropertiesPanel from "@/components/PropertiesPanel";
import { SidebarProvider, SidebarInset, Sidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { usePropertiesPanel } from "@/hooks/usePropertiesPanel";
import { getRouteApi } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import PropertiesPanelSidebar from "@/components/PropertiesPanelSidebar";
import PropertiesPanelWrapper from "@/components/ui/PropertyPanelSidebar";
import { useEffect } from "react";

const route = getRouteApi('/c/$id')

const ChatView = () => {
  const { id } = route.useParams();
  const globalStoreSetOpen  = usePropertiesPanel(store => store.isOpen)

  useEffect(() => console.log("Global store: ", globalStoreSetOpen), [globalStoreSetOpen])
  
  return (
    <SidebarProvider>
      <div className="h-screen w-screen flex overflow-hidden bg-chat-bg text-foreground">
        <AppSidebar />
        
        <SidebarInset>
          <div className="flex h-full">
          {/* <div className="h-14 border-b border-border/50 flex items-center px-4 justify-between">
            <div className="flex items-center gap-3">
                <SidebarTrigger className="mr-2">
                  <ChevronRight className="h-4 w-4" />
                </SidebarTrigger>
              <span className="font-medium">Gemini</span>
              <Badge variant="secondary" className="bg-secondary/30 text-xs font-normal rounded-full">
                gemini-2.0-flash
              </Badge>
            </div>
          </div> */}

            <PropertiesPanelWrapper>
              <ChatInterface chatId={id} />
            </PropertiesPanelWrapper>

            {/* <SidebarProvider
              style={{
                "--sidebar-width": "50rem",
                "--sidebar-width-mobile": "0rem",
              }}>
              <SidebarInset>
                <ChatInterface chatId={id} />
              </SidebarInset>
              <Sidebar side="right">
                <div className="flex-1 h-full border- border-border/50 overflow-hidden">
                  <PropertiesPanel />
                </div>
              </Sidebar>
            </SidebarProvider> */}
            
            {/* {showProperties && (
              <div className="flex-1 h-full border-l border-border/50 overflow-hidden">
                <PropertiesPanel />
              </div>
            )} */}
          </div>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
};

export default ChatView;
