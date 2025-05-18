
import ChatInterface from "@/components/ChatInterface";
import AppSidebar from "@/components/AppSidebar";
import PropertiesPanel from "@/components/PropertiesPanel";
import { SidebarProvider, SidebarInset, Sidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { usePropertiesPanel } from "@/hooks/usePropertiesPanel";
import { getRouteApi } from "@tanstack/react-router";
import PropertiesPanelWrapper from "@/components/ui/PropertyPanelSidebar";
import { useEffect } from "react";

const route = getRouteApi('/c/$id')

const ChatView = () => {
  const { id } = route.useParams();
  const globalStoreSetOpen  = usePropertiesPanel(store => store.isOpen)

  useEffect(() => console.log("Global store: ", globalStoreSetOpen), [globalStoreSetOpen])
  
  return (
    <PropertiesPanelWrapper>
      <ChatInterface chatId={id} />
    </PropertiesPanelWrapper>
  );
};

export default ChatView;
