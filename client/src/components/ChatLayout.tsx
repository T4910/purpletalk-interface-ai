import { Link, Outlet } from "@tanstack/react-router";
import { ChevronRightIcon, PanelLeftIcon } from "lucide-react";
import AppSidebar from "./AppSidebar";
import { SidebarProvider, SidebarInset, SidebarTrigger } from "./ui/sidebar";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import SidebarButton from "./SidebarButton";

export default function ChatLayout() {
  return (
    <SidebarProvider>
      <div className="h-screen w-screen flex overflow-hidden bg-chat-bg text-foreground">
        <AppSidebar />

        {/* <SidebarInset> */}
        <div className="flex flex-col h-full overflow-hidden w-full">
          <Outlet />
        </div>
        {/* </SidebarInset> */}
      </div>
    </SidebarProvider>
  );
}
