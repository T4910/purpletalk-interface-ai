
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Bookmark, User, ChevronLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
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
  SidebarMenuButton
} from "@/components/ui/sidebar";
import { useSidebarCollapse } from "@/hooks/useSidebarCollapse";

const AppSidebar = () => {
  const navigate = useNavigate();
  const { toggle, isCollapsed } = useSidebarCollapse();
  
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
    navigate('/c/new');
  };
  
  return (
    <Sidebar collapsible={isCollapsed ? "offcanvas" : "none"}>
      <SidebarHeader>
        <div className="flex gap-2 px-2">
          <Button variant="outline" className="justify-start gap-2 bg-sidebar w-full" onClick={handleNewChat}>
            <Plus className="h-4 w-4" />
            <span className="text-sm">New chat</span>
          </Button>
          <Button variant="outline" className="w-10 p-0 bg-sidebar rounded-md">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8"
            onClick={toggle}
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
                      <Link to={`/c/${chat.id}`}>
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
