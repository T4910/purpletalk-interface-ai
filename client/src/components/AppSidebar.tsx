import React, { Suspense, useEffect } from "react";
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
  LayoutDashboard,
} from "lucide-react";
import {
  Link,
  useMatches,
  useNavigate,
  useRouterState,
} from "@tanstack/react-router";
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
import {
  getConversationOptions,
  useConversationsOptions,
  useConversationsQuery,
} from "@/services/provider/ai";
import { groupConversationsByDate } from "@/lib/utils";
import { NavUser } from "./nav-user";
import { useSuspenseQuery } from "@tanstack/react-query";
import SpinLoader from "./SpinLoader";
import { useChildMatches } from "@tanstack/react-router";
import { useMatchRoute } from "@tanstack/react-router";
import { useLocation } from "@tanstack/react-router";

type TChatsByDate = Record<string, { id: string; title: string }[]>;

const AppSidebar = () => {
  const { setOpenMobile } = useSidebar();
  const navigate = useNavigate();

  const handleNewChat = () => {
    navigate({ to: "/c/new" });
    setOpenMobile(false);
  };

  const handleDashboard = () => {
    navigate({ to: "/c/dashboard" });
    setOpenMobile(false);
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
              </Button>
            </span>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {/* Dashboard Navigation Link */}
        <div className="px-2">
          <Button
            variant="outline"
            className="w-full justify-start gap-2 h-9 text-sm font-medium"
            onClick={handleDashboard}
          >
            <LayoutDashboard className="size-4" />
            Dashboard
          </Button>
        </div>

        <Suspense
          fallback={
            <div className="mx-auto py-8 grid place-content-center">
              <SpinLoader />
            </div>
          }
        >
          <ChatHistory />
        </Suspense>
      </SidebarContent>

      <SidebarFooter>
        <NavUser
          user={{
            name: "John Doe",
            email: "john@example.com",
            avatar: "/placeholder.svg",
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
};

const ChatHistory = () => {
  const { setOpenMobile } = useSidebar();
  const { data: conversations, isPending } = useSuspenseQuery(
    useConversationsOptions
  );
  const matches = useRouterState();
  const groupedChatsByDate = groupConversationsByDate(conversations);
  const chatsByDateArray = Object.entries(groupedChatsByDate);

  return (
    <>
      {/* Chat History */}
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
                        <Link
                          to="/c/$id"
                          onClick={() => setOpenMobile(false)}
                          params={{ id: chat.id }}
                          className="[&.active]:text-primary [&.active]:font-bold [&.active]:opacity-100 opacity-60"
                        >
                          <span>{chat.title}</span>
                          {`/c/${chat.id}` === matches.location.pathname &&
                            `/c/${chat.id}` !==
                              matches.resolvedLocation.pathname && (
                              <SpinLoader className="" />
                            )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
    </>
  );
};

export default AppSidebar;
