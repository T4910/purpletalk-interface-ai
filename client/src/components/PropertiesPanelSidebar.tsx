import React from "react";
import ChatInterface from "./ChatInterface";
import PropertiesPanel from "./PropertiesPanel";
import { Sidebar, SidebarProvider, SidebarInset } from "./ui/sidebar";

const PropertiesPanelSidebar = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider
      // id="2"
      style={{
        "--sidebar-width": "50rem",
        "--sidebar-width-mobile": "0rem",
      }}
    >
      <SidebarInset>
        {/* <ChatInterface chatId={id} /> */}
        {children}
      </SidebarInset>
      {/* <AppSidebar /> */}
        <Sidebar side="right"> 
            <div className="flex-1 h-full border- border-border/50 overflow-hidden">
                <PropertiesPanel />
            </div>
      </Sidebar>
    </SidebarProvider>
  );
};

export default PropertiesPanelSidebar;
