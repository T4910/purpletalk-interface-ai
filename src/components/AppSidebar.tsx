import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Bookmark, User, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router"; // Changed import
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar";
import { Outlet } from "@tanstack/react-router";

const AppSidebar = () => {
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  
  // Group chats by date
  const chatsByDate = {
    "Today": [
      { id: "chat-1", title: "What Are You In Pdf" },
      { id: "chat-2", title: "Image Generation Help" }
    ],
    "Yesterday": [
      { id: "chat-3", title: "React Query Tutorial" },
      { id: "chat-4", title: "Tailwind CSS Tricks" }
    ]
  };
  
  const handleNewChat = () => {
    navigate({ to: '/c/new' }); // Changed navigation method
  };
  
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex gap-2 px-2 justify-between items-center">
          <div className="flex gap-2 flex-1">
            <Button variant="outline" className="justify-start gap-2 bg-sidebar w-full" onClick={handleNewChat}>
              <Plus className="h-4 w-4" />
              <span className="text-sm">New chat</span>
            </Button>
            <Button variant="outline" className="w-10 p-0 bg-sidebar rounded-md">
              <Bookmark className="h-4 w-4" />
            </Button>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8" 
            onClick={toggleSidebar}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {Object.entries(chatsByDate).map(([date, chats]) => (
          <SidebarGroup key={date}>
            <SidebarGroupLabel>{date}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {chats.map(chat => (
                  <SidebarMenuItem key={chat.id}>
                    <SidebarMenuButton asChild>
                      {/* Changed Link component and props */}
                      <Link to={"/c/$id"} params={{ id: chat.id }}>
                        <span>{chat.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      
      <SidebarFooter>
        <div className="p-2">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <User className="h-4 w-4" />
            </div>
            <div className="text-sm truncate">User</div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
