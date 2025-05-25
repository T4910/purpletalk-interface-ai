import React from "react";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Bookmark,
  User,
  ChevronLeft,
  PanelLeft,
  PanelLeftIcon,
  PencilIcon,
  EditIcon,
  SearchIcon,
} from "lucide-react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { Outlet } from "@tanstack/react-router";
import SidebarButton from "./SidebarButton";
import { useConversationsQuery } from "@/services/provider/ai";
import { groupConversationsByDate } from "@/lib/utils";

type TChatsByDate = Record<string, { id: string; title: string }[]>;

const AppSidebar = () => {
  const navigate = useNavigate();
  const { toggleSidebar } = useSidebar();
  const { data: conversations, isPending } = useConversationsQuery();

  console.log(conversations);
  const groupedChatsByDate = groupConversationsByDate(conversations);
  const chatsByDateArray = Object.entries(groupedChatsByDate);

  const handleNewChat = () => {
    navigate({ to: "/c/new" }); // Changed navigation method
  };

  return (
    <Sidebar className="bg-sidebar">
      <SidebarHeader className="h-16">
        <div className="flex gap-2 p-1 justify-between items-center">
          <div className="flex gap-2 justify-between items-center flex-1">
            <SidebarButton />
            <span>
              <Button
                variant="ghost"
                className="w-10 p-0 bg-sidebar rounded-md"
              >
                <SearchIcon className="size-6" />
              </Button>
              <Button
                variant="ghost"
                className="w-10 p-0 bg-sidebar rounded-md"
              >
                <Bookmark className="size-6" />
              </Button>
              <Button
                variant="ghost"
                className="w-10 p-0 bg-sidebar rounded-md"
                onClick={handleNewChat}
              >
                <EditIcon className="size-6" />
                {/* <span className="text-sm">New chat</span> */}
              </Button>
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {isPending
          ? "Loading..."
          : chatsByDateArray.length === 0
          ? "No chats"
          : chatsByDateArray.map(([date, chats]) => (
              <SidebarGroup key={date}>
                <SidebarGroupLabel>{date}</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {chats.map((chat) => (
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
              <User className="size-6" />
            </div>
            <div className="text-sm truncate">User</div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
